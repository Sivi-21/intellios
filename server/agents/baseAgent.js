import contextEngine from '../context/contextEngine.js';
import groqService from '../services/groqService.js';
import memoryEngine from '../memory/memoryEngine.js';

export class BaseAgent {
  constructor({ id, name, description, capabilities = [], systemPrompt = '' }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.capabilities = capabilities;
    this.systemPrompt = systemPrompt;
  }

  getMeta() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      capabilities: this.capabilities,
      systemPrompt: this.systemPrompt,
    };
  }

  buildAgentPrompt(task) {
    return `${this.systemPrompt}\n\n## Task\n${task}`;
  }

  async execute({ sessionId, task, workspace, model, history = [] }) {
    const agentMeta = this.getMeta();
    const { messages } = await contextEngine.buildInferenceContext(
      sessionId,
      workspace,
      this.buildAgentPrompt(task),
      history,
      agentMeta
    );

    const result = await groqService.complete({
      messages,
      model,
      temperature: 0.5,
    });

    await memoryEngine.recordInteraction(sessionId, {
      type: 'interaction',
      content: `[${this.id}] ${task}`,
      summary: result.content.slice(0, 200),
      tags: ['agent', this.id],
      metadata: { agentId: this.id },
    });

    return {
      agentId: this.id,
      content: result.content,
      codeSnippet: result.codeSnippet,
      model: result.model,
    };
  }
}
