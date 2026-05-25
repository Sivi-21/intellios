import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    externalId: String,
    title: { type: String, required: true },
    content: { type: String, default: '' },
    category: { type: String, default: 'General' },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
