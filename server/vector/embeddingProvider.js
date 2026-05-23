import env from '../config/env.js';
import { EmbeddingServiceInterface } from '../memory/embeddingService.interface.js';
import logger from '../utils/logger.js';

/**
 * Pluggable embedding provider — wire OpenAI, Groq embeddings, or local models.
 */
export class EmbeddingProvider extends EmbeddingServiceInterface {
  get modelName() {
    return env.EMBEDDING_MODEL || 'text-embedding-3-small';
  }

  async embed(text) {
    if (!env.OPENAI_API_KEY && !env.GROQ_API_KEY) {
      logger.debug('Embeddings skipped — no provider key');
      return null;
    }
    // Stub: deterministic pseudo-embedding for dev scaffolding
    const vec = new Array(64).fill(0);
    for (let i = 0; i < text.length; i++) {
      vec[i % 64] += text.charCodeAt(i) / 1000;
    }
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map((v) => v / norm);
  }

  async embedBatch(texts) {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}

export default new EmbeddingProvider();
