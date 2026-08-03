const mongoose = require('mongoose');

const pageVisitSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  friendPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FriendPage', required: true, index: true },
  pageKey: { type: String, required: true },
  enteredAt: { type: Date, default: Date.now },
  exitedAt: { type: Date },
  durationSeconds: { type: Number, default: 0 },
  maxScrollPercent: { type: Number, default: 0 },
  skipped: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PageVisit', pageVisitSchema);
