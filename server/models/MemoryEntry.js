import mongoose from 'mongoose';

/**
 * Memory-ready schema for future vector / semantic retrieval.
 * embedding field reserved for Atlas Vector Search or external store sync.
 */
const memoryEntrySchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    type: {
      type: String,
      enum: ['conversation', 'note', 'task', 'command', 'insight', 'embedding'],
      required: true,
    },
    content: { type: String, required: true },
    summary: String,
    embedding: { type: [Number], select: false },
    embeddingModel: String,
    sourceId: String,
    tags: [String],
    relevanceScore: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

memoryEntrySchema.index({ sessionId: 1, type: 1 });

export default mongoose.models.MemoryEntry ||
  mongoose.model('MemoryEntry', memoryEntrySchema);
