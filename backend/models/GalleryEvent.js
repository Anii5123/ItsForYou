const mongoose = require('mongoose');

const galleryEventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  friendPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FriendPage', required: true, index: true },
  imageIndex: { type: Number, required: true },
  opened: { type: Boolean, default: true },
  durationSeconds: { type: Number, default: 0 },
  openCount: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('GalleryEvent', galleryEventSchema);
