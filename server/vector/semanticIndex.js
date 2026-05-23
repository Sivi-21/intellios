import vectorMemory from './vectorMemory.js';
import memoryStore from '../memory/memoryStore.js';
import logger from '../utils/logger.js';

/**
 * Semantic index coordinator — bridges keyword store and vector layer.
 */
export class SemanticIndex {
  async indexSessionMemories(sessionId) {
    const memories = await memoryStore.findBySession(sessionId, { limit: 50 });
    let indexed = 0;
    for (const m of memories) {
      try {
        await vectorMemory.indexMemory(sessionId, m);
        indexed++;
      } catch (err) {
        logger.debug('Index skip', { id: m._id, error: err.message });
      }
    }
    return { indexed, total: memories.length };
  }

  async search(sessionId, query, limit = 8) {
    const vectorHits = await vectorMemory.semanticQuery(sessionId, query, limit);
    if (vectorHits.length) return vectorHits;
    return memoryStore.search(sessionId, query, limit);
  }
}

export default new SemanticIndex();
