/**
 * Vector store interface — implement with Pinecone, Qdrant, MongoDB Atlas Vector Search, etc.
 */
export class VectorStoreInterface {
  async upsert(_vectors) {
    throw new Error('VectorStore.upsert not implemented');
  }

  async query(_embedding, _options) {
    throw new Error('VectorStore.query not implemented');
  }

  async delete(_ids) {
    throw new Error('VectorStore.delete not implemented');
  }
}
