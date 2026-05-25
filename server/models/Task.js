import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    externalId: String,
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'backlog'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: { type: String, default: 'General' },
    dueDate: String,
    source: { type: String, default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
