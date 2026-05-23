import Memory from '../models/Memory.js';
import MemoryEntry from '../models/MemoryEntry.js';
import { isDatabaseReady } from '../config/database.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import semanticIndex from '../vector/semanticIndex.js';

/**
 * Retrieval pipeline stub — ready for vector search integration.
 * Currently uses keyword-based recall from MemoryEntry collection.
 */
export class RetrievalPipeline {
  constructor({ vectorStore = null, embeddingService = null } = {}) {
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
  }

  async storeInsight({ sessionId, content, type = 'insight', tags = [], metadata = {} }) {
    if (!isDatabaseReady()) {
      logger.debug('Memory store skipped (no database)');
      return null;
    }
    return Memory.create({
      sessionId,
      category: type,
      content,
      summary: content.slice(0, 200),
      tags,
      metadata,
    });
  }

  async recall({ sessionId, query, limit = 5 }) {
    if (!isDatabaseReady()) return [];

    const regex = new RegExp(query.split(/\s+/).filter(Boolean).join('|'), 'i');

    const entries = await Memory.find({
      sessionId,
      $or: [{ content: regex }, { summary: regex }, { tags: { $in: [query] } }],
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('-embedding');

    return entries;
  }

  async semanticSearch({ sessionId, query, limit = 5 }) {
    if (env.ENABLE_MEMORY) {
      return semanticIndex.search(sessionId, query, limit);
    }
    if (this.vectorStore && this.embeddingService) {
      const embedding = await this.embeddingService.embed(query);
      return this.vectorStore.query(embedding, { sessionId, limit });
    }
    return this.recall({ sessionId, query, limit });
  }
}

export default new RetrievalPipeline();
