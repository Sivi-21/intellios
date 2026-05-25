import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    externalId: { type: String, unique: true, sparse: true },
    email: { type: String, sparse: true },
    name: { type: String, default: 'IntelliOS Operator' },
    role: { type: String, default: 'Developer' },
    preferences: {
      model: String,
      theme: String,
      engineTheme: String,
      audioFeedback: Boolean,
      autoSave: { type: Boolean, default: true },
    },
    activeProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    lastSessionId: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
