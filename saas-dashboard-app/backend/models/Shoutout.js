const mongoose = require('mongoose');

const shoutoutSchema = new mongoose.Schema({
  message: { type: String, required: true },
  author: { type: String, required: true },
  emoji: { type: String, default: '🎉' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shoutout', shoutoutSchema);
