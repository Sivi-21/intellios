import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    id: String,
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    codeSnippet: {
      code: String,
      language: String,
      filePath: String,
    },
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    title: { type: String, default: 'IntelliOS Thread' },
    messages: [messageSchema],
    model: String,
    agentId: String,
    contextSnapshot: mongoose.Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

conversationSchema.index({ sessionId: 1, updatedAt: -1 });

export default mongoose.models.Conversation ||
  mongoose.model('Conversation', conversationSchema);
