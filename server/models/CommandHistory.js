import mongoose from 'mongoose';

const commandHistorySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    command: { type: String, required: true },
    intent: String,
    handler: String,
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'completed',
    },
    durationMs: Number,
    error: String,
  },
  { timestamps: true }
);

export default mongoose.models.CommandHistory ||
  mongoose.model('CommandHistory', commandHistorySchema);
