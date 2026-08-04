const mongoose = require('mongoose');

const visitSessionSchema = new mongoose.Schema({
  friendPageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FriendPage',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  isFirstVisit: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  deviceInfo: {
    userAgent: { type: String, default: '' },
    deviceType: { type: String, enum: ['mobile', 'tablet', 'desktop', 'unknown'], default: 'unknown' }
  },
  visitorName: { type: String, default: '' },
  visitorEmail: { type: String, default: '' },
  totalTimeSeconds: { type: Number, default: 0 },
  currentStep: { type: Number, default: 1 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('VisitSession', visitSessionSchema);
