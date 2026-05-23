import Memory from '../models/Memory.js';
import { isDatabaseReady } from '../config/database.js';
import { VectorStoreInterface } from '../memory/vectorStore.interface.js';
import embeddingProvider from './embeddingProvider.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * In-process vector memory — swap for Pinecone/Qdrant/Atlas Vector Search.
 */
class InMemoryVectorStore extends VectorStoreInterface {
  constructor() {
    super();
    this.vectors = new Map();
  }

  async upsert(items) {
    for (const item of items) {
      this.vectors.set(item.id, item);
    }
    return { upserted: items.length };
  }

  async query(embedding, { sessionId, limit = 5 }) {
    const candidates = [...this.vectors.values()].filter(
      (v) => !sessionId || v.sessionId === sessionId
    );
    const scored = candidates
      .map((v) => ({ v, score: cosineSimilarity(embedding, v.embedding) }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => ({ ...s.v, score: s.score }));
  }

  async delete(ids) {
    ids.forEach((id) => this.vectors.delete(id));
  }
}

function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export class VectorMemory {
  constructor(store = new InMemoryVectorStore()) {
    this.store = store;
    this.enabled = env.ENABLE_MEMORY === true || env.ENABLE_MEMORY === 'true';
  }

  async indexMemory(sessionId, memoryDoc) {
    if (!this.enabled) return null;
    const embedding = await embeddingProvider.embed(memoryDoc.content);
    if (!embedding) return null;

    const id = String(memoryDoc._id);
    await this.store.upsert([
      {
        id,
        sessionId,
        embedding,
        content: memoryDoc.content,
        summary: memoryDoc.summary,
        category: memoryDoc.category,
      },
    ]);

    if (isDatabaseReady()) {
      await Memory.findByIdAndUpdate(memoryDoc._id, {
        embedding,
        embeddingModel: embeddingProvider.modelName,
      });
    }
    return id;
  }

  async semanticQuery(sessionId, query, limit = 5) {
    const embedding = await embeddingProvider.embed(query);
    if (!embedding) return [];
    return this.store.query(embedding, { sessionId, limit });
  }
}

export default new VectorMemory();
