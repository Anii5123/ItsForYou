const mongoose = require('mongoose');

const feedbackResponseSchema = new mongoose.Schema({
  friendPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'FriendPage', required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  visitorName: { type: String, default: '' },
  visitorEmail: { type: String, default: '' },
  likedGift: { type: Boolean, default: true },
  likedMostText: { type: String, default: '' },
  didntLikeText: { type: String, default: '' },
  reflectionAnswers: {
    whatAmIToYou: { type: String, default: '' },
    describeOurFriendship: { type: String, default: '' },
    favouriteMemory: { type: String, default: '' },
    anythingElse: { type: String, default: '' },
    friendVoiceNoteUrl: { type: String, default: '' }
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('FeedbackResponse', feedbackResponseSchema);
