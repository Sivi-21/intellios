import memoryStore from './memoryStore.js';
import retrievalPipeline from './retrievalPipeline.js';
import logger from '../utils/logger.js';

const CATEGORIES = {
  CONVERSATION: 'conversation',
  COMMAND: 'command',
  PREFERENCE: 'preference',
  WORKFLOW: 'workflow',
  INTERACTION: 'interaction',
  PROJECT: 'project',
  TASK: 'task',
  INSIGHT: 'insight',
};

export class MemoryEngine {
  async recordInteraction(sessionId, { type, content, summary, tags, metadata, importance }) {
    return memoryStore.save({
      sessionId,
      category: type || CATEGORIES.INTERACTION,
      content,
      summary,
      tags,
      metadata,
      importance,
    });
  }

  async recordConversation(sessionId, role, content, sourceId) {
    return memoryStore.save({
      sessionId,
      category: CATEGORIES.CONVERSATION,
      content: `[${role}] ${content}`,
      summary: content.slice(0, 200),
      sourceId,
      tags: ['chat', role],
      importance: role === 'user' ? 0.6 : 0.4,
    });
  }

  async recordCommand(sessionId, command, result, intent) {
    return memoryStore.save({
      sessionId,
      category: CATEGORIES.COMMAND,
      content: command,
      summary: result?.summary || intent,
      tags: ['command', intent].filter(Boolean),
      metadata: { intent, handler: result?.handler },
      importance: 0.7,
    });
  }

  async savePreference(sessionId, key, value) {
    return memoryStore.save({
      sessionId,
      category: CATEGORIES.PREFERENCE,
      key: `pref:${key}`,
      content: JSON.stringify(value),
      summary: `${key}=${typeof value === 'string' ? value : JSON.stringify(value)}`,
      tags: ['preference', key],
      importance: 0.8,
    });
  }

  async recordWorkflow(sessionId, name, steps) {
    return memoryStore.save({
      sessionId,
      category: CATEGORIES.WORKFLOW,
      key: `workflow:${name}`,
      content: JSON.stringify(steps),
      summary: `Workflow: ${name} (${steps?.length || 0} steps)`,
      tags: ['workflow', name],
      importance: 0.75,
    });
  }

  async buildRecallContext(sessionId, query = '') {
    const [recent, commands, preferences, insights] = await Promise.all([
      memoryStore.findBySession(sessionId, { category: CATEGORIES.INTERACTION, limit: 8 }),
      memoryStore.findBySession(sessionId, { category: CATEGORIES.COMMAND, limit: 6 }),
      memoryStore.findBySession(sessionId, { category: CATEGORIES.PREFERENCE, limit: 5 }),
      query
        ? retrievalPipeline.semanticSearch({ sessionId, query, limit: 5 })
        : memoryStore.findBySession(sessionId, { category: CATEGORIES.INSIGHT, limit: 5 }),
    ]);

    return {
      recentInteractions: recent.map(formatMemory),
      recentCommands: commands.map(formatMemory),
      preferences: preferences.map(formatMemory),
      relevantInsights: (insights || []).map(formatMemory),
      memoryCount: recent.length + commands.length + preferences.length,
    };
  }

  async search(sessionId, query) {
    return memoryStore.search(sessionId, query);
  }
}

function formatMemory(m) {
  return {
    id: m._id,
    category: m.category,
    summary: m.summary,
    content: (m.content || '').slice(0, 300),
    tags: m.tags,
    at: m.updatedAt || m.createdAt,
  };
}

export const MEMORY_CATEGORIES = CATEGORIES;
export default new MemoryEngine();
