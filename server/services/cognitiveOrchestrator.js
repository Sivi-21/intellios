import contextEngine from '../context/contextEngine.js';
import sessionService from './sessionService.js';
import groqService from './groqService.js';
import { parseCommand, intentToHandler } from './commandParser.js';
import { executeCommand } from '../commands/router.js';
import agentOrchestrator from '../agents/orchestrator.js';
import { routeToAgent, shouldUseAgentRoute } from './agentRouter.js';
import memoryEngine from '../memory/memoryEngine.js';
import { generateId } from '../utils/id.js';
import logger from '../utils/logger.js';
import { broadcast } from '../websocket/eventBus.js';

/**
 * Phase 3 Cognitive Orchestrator — memory + context + agent routing pipeline.
 *
 * Flow:
 * Request → Context + Memory Enrichment → Parse Intent → Command | Agent Route | Chat → Persist Memory
 */
export class CognitiveOrchestrator {
  async processChat({ sessionId, message, workspace, model, stream = false, onToken }) {
    const parsed = parseCommand(message);
    const envelope = contextEngine.buildContextEnvelope(workspace);

    await contextEngine.updateContext(sessionId, {
      activePage: workspace.activePage,
      activeProject: workspace.activeProject,
      recentAction: { type: 'chat', summary: message.slice(0, 80) },
    }, workspace);

    await memoryEngine.recordConversation(sessionId, 'user', message);

    if (parsed.intent !== 'chat' && parsed.confidence >= 0.8) {
      return this.processCommand({ sessionId, input: message, workspace, model, parsed });
    }

    const agentRoute = routeToAgent(message, envelope);
    if (shouldUseAgentRoute(parsed, agentRoute)) {
      broadcast(sessionId, {
        type: 'agent.routed',
        payload: agentRoute,
      });
      const agentResult = await agentOrchestrator.run(agentRoute.agentId, {
        sessionId,
        task: message,
        workspace,
        model,
      });
      await memoryEngine.recordConversation(sessionId, 'assistant', agentResult.message.content);
      return {
        success: true,
        mode: 'agent',
        agent: agentResult.agent,
        route: agentRoute,
        message: agentResult.message,
      };
    }

    const conversation = await sessionService.getConversation(sessionId);
    const history = sessionService.getMessageHistory(conversation);

    await sessionService.appendMessage(sessionId, { role: 'user', content: message });

    const { messages } = await contextEngine.buildInferenceContext(
      sessionId,
      workspace,
      message,
      history
    );

    if (stream && onToken) {
      for await (const event of groqService.stream({ messages, model })) {
        if (event.type === 'token') onToken(event.content);
        else if (event.type === 'done') {
          const assistantMsg = {
            id: generateId('msg'),
            role: 'assistant',
            content: event.content,
            codeSnippet: event.codeSnippet,
          };
          await sessionService.appendMessage(sessionId, assistantMsg, event.model);
          await memoryEngine.recordConversation(sessionId, 'assistant', event.content);
          return {
            success: true,
            mode: 'chat_stream',
            message: assistantMsg,
            model: event.model,
            route: agentRoute,
          };
        }
      }
    }

    const result = await groqService.complete({ messages, model });
    const assistantMsg = {
      id: generateId('msg'),
      role: 'assistant',
      content: result.content,
      codeSnippet: result.codeSnippet,
    };

    await sessionService.appendMessage(sessionId, assistantMsg, result.model);
    await memoryEngine.recordConversation(sessionId, 'assistant', result.content);

    return {
      success: true,
      mode: 'chat',
      message: assistantMsg,
      model: result.model,
      route: agentRoute,
    };
  }

  async processCommand({ sessionId, input, workspace, model, parsed: preParsed }) {
    const parsed = preParsed || parseCommand(input);
    const handlerName = intentToHandler(parsed.intent);

    broadcast(sessionId, {
      type: 'command.status',
      payload: { status: 'running', intent: parsed.intent, handler: handlerName },
    });

    const start = Date.now();
    try {
      let result;
      if (handlerName) {
        result = await executeCommand(handlerName, {
          sessionId,
          args: parsed.args,
          raw: parsed.raw,
          workspace,
          model,
        });
      } else {
        result = await agentOrchestrator.delegate(parsed.intent, {
          sessionId,
          input,
          workspace,
          model,
        });
      }

      await sessionService.logCommand({
        sessionId,
        command: parsed.raw,
        intent: parsed.intent,
        handler: handlerName || 'agent',
        input: parsed.args,
        output: { summary: result.summary },
        status: 'completed',
        durationMs: Date.now() - start,
      });

      await memoryEngine.recordCommand(sessionId, parsed.raw, result, parsed.intent);

      if (result.message) {
        await sessionService.appendMessage(sessionId, { role: 'user', content: input });
        await sessionService.appendMessage(sessionId, {
          role: 'assistant',
          content: result.message.content,
          codeSnippet: result.message.codeSnippet,
        }, model);
      }

      broadcast(sessionId, {
        type: 'command.status',
        payload: { status: 'completed', intent: parsed.intent },
      });

      return { success: true, mode: 'command', intent: parsed.intent, handler: handlerName, ...result };
    } catch (err) {
      broadcast(sessionId, {
        type: 'command.status',
        payload: { status: 'failed', error: err.message },
      });
      await sessionService.logCommand({
        sessionId,
        command: parsed.raw,
        intent: parsed.intent,
        handler: handlerName,
        status: 'failed',
        error: err.message,
        durationMs: Date.now() - start,
      });
      throw err;
    }
  }

  async runAgent(opts) {
    return agentOrchestrator.run(opts.agentId, opts);
  }

  async routeAgent(opts) {
    return agentOrchestrator.routeAndRun(opts);
  }
}

export default new CognitiveOrchestrator();
