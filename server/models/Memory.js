import mongoose from 'mongoose';

/**
 * Unified cognitive memory document — supports episodic, semantic, and procedural recall.
 */
const memorySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    category: {
      type: String,
      enum: [
        'conversation',
        'command',
        'preference',
        'workflow',
        'interaction',
        'project',
        'task',
        'insight',
        'embedding',
      ],
      required: true,
      index: true,
    },
    key: String,
    content: { type: String, required: true },
    summary: String,
    importance: { type: Number, default: 0.5, min: 0, max: 1 },
    embedding: { type: [Number], select: false },
    embeddingModel: String,
    sourceId: String,
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed,
    expiresAt: Date,
  },
  { timestamps: true }
);

memorySchema.index({ sessionId: 1, category: 1, updatedAt: -1 });
memorySchema.index({ sessionId: 1, key: 1 });

export default mongoose.models.Memory || mongoose.model('Memory', memorySchema);
