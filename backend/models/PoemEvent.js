const mongoose = require('mongoose');

const poemEventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  friendPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FriendPage', required: true, index: true },
  stanzasCompleted: { type: Number, default: 0 },
  totalDurationSeconds: { type: Number, default: 0 },
  completionPercent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PoemEvent', poemEventSchema);
