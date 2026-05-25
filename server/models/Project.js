import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    slug: String,
    description: String,
    source: {
      type: String,
      enum: ['local', 'github', 'zip', 'workspace'],
      default: 'workspace',
    },
    repositoryUrl: String,
    rootPath: String,
    fileIndex: [
      {
        path: String,
        language: String,
        size: Number,
      },
    ],
    analysis: mongoose.Schema.Types.Mixed,
    lastAnalyzedAt: Date,
    status: {
      type: String,
      enum: ['idle', 'indexing', 'ready', 'error'],
      default: 'idle',
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

projectSchema.index({ sessionId: 1, slug: 1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
