import { getAgent, listAgents, resolveAgentForIntent } from './registry.js';
import { routeToAgent } from '../services/agentRouter.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import { broadcast } from '../websocket/eventBus.js';

export class AgentOrchestrator {
  list() {
    return listAgents();
  }

  async run(agentId, { sessionId, task, workspace, model, history }) {
    const agent = getAgent(agentId);
    if (!agent) {
      throw new AppError(`Agent not found: ${agentId}`, 404, 'AGENT_NOT_FOUND');
    }

    logger.info('Agent execution', { agentId, sessionId: sessionId?.slice(0, 8) });

    broadcast(sessionId, {
      type: 'agent.activity',
      payload: { agentId, status: 'running', task: task.slice(0, 80) },
    });

    try {
      const result = await agent.execute({ sessionId, task, workspace, model, history });

      broadcast(sessionId, {
        type: 'agent.activity',
        payload: { agentId, status: 'completed' },
      });

      return {
        success: true,
        agent: agent.getMeta(),
        route: { agentId, reason: 'explicit' },
        result,
        message: { content: result.content, codeSnippet: result.codeSnippet },
      };
    } catch (err) {
      broadcast(sessionId, {
        type: 'agent.activity',
        payload: { agentId, status: 'failed', error: err.message },
      });
      throw err;
    }
  }

  async routeAndRun({ sessionId, input, workspace, model, history }) {
    const route = routeToAgent(input, workspace);
    return this.run(route.agentId, {
      sessionId,
      task: input,
      workspace,
      model,
      history,
    }).then((res) => ({ ...res, route }));
  }

  async delegate(intent, ctx) {
    const agentId = resolveAgentForIntent(intent);
    return this.run(agentId, {
      sessionId: ctx.sessionId,
      task: ctx.input,
      workspace: ctx.workspace,
      model: ctx.model,
    });
  }
}

export default new AgentOrchestrator();
