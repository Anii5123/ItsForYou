const mongoose = require('mongoose');

const timelineEventViewSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  friendPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FriendPage', required: true, index: true },
  eventIndex: { type: Number, required: true },
  viewed: { type: Boolean, default: true },
  skipped: { type: Boolean, default: false },
  durationSeconds: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TimelineEventView', timelineEventViewSchema);
