/**
 * Embedding service interface — plug in OpenAI, Groq embeddings, or local models.
 */
export class EmbeddingServiceInterface {
  async embed(_text) {
    throw new Error('EmbeddingService.embed not implemented');
  }

  async embedBatch(_texts) {
    throw new Error('EmbeddingService.embedBatch not implemented');
  }

  get modelName() {
    return 'not-configured';
  }
}
