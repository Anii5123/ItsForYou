const mongoose = require('mongoose');

const voiceNoteEventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  friendPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FriendPage', required: true, index: true },
  played: { type: Boolean, default: false },
  paused: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  percentListened: { type: Number, default: 0 },
  replayCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('VoiceNoteEvent', voiceNoteEventSchema);
