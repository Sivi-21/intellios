import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userProfile: mongoose.Schema.Types.Mixed,
    context: {
      activePage: String,
      activeProject: String,
      openWorkspace: String,
      selectedNoteId: String,
      selectedTaskId: String,
      recentActions: [mongoose.Schema.Types.Mixed],
    },
    lastActivityAt: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);
