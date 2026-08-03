const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { _id: true });

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' }
}, { _id: true });

const customColorsSchema = new mongoose.Schema({
  primary: { type: String, default: '#E11D48' },
  secondary: { type: String, default: '#F43F5E' },
  background: { type: String, default: '#FFF1F2' },
  text: { type: String, default: '#881337' },
  accent: { type: String, default: '#FB7185' }
}, { _id: false });

const friendPageSchema = new mongoose.Schema({
  randomId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  friendSlug: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  friendName: {
    type: String,
    required: [true, 'Friend name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  theme: {
    key: { type: String, default: 'rose_gold' },
    customColors: { type: customColorsSchema, default: () => ({}) }
  },
  backgroundMusicUrl: { type: String, default: '' },
  heroMessage: { type: String, default: 'A special journey crafted just for you.' },
  friendshipDayMessage: { type: String, default: 'Happy Friendship Day! Thank you for being such an incredible part of my life.' },
  timelineEvents: { type: [timelineEventSchema], default: [] },
  galleryImages: { type: [galleryImageSchema], default: [] },
  galleryFallbackMessage: {
    type: String,
    default: "Some of our best memories weren't captured on camera — they were lived fully in the moment, etched deep in my heart."
  },
  voiceNoteUrl: { type: String, default: '' },
  poemStanzas: { type: [String], default: [] },
  surpriseGiftContent: {
    type: { type: String, enum: ['text', 'image', 'link'], default: 'text' },
    title: { type: String, default: 'One More Surprise For You!' },
    body: { type: String, default: 'You mean the world to me. Here is a little memory token just for us.' },
    imageUrl: { type: String, default: '' },
    linkUrl: { type: String, default: '' }
  },
  endingMessage: { type: String, default: 'Thank you for reliving our journey. Here’s to many more memories together!' },
  currentStep: { type: Number, default: 1 },
  publishedAt: { type: Date }
}, { timestamps: true });

// Compound index on randomId + friendSlug for strict privacy verification
friendPageSchema.index({ randomId: 1, friendSlug: 1 });

module.exports = mongoose.model('FriendPage', friendPageSchema);
