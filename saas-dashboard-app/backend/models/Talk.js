const mongoose = require('mongoose');

const talkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  speaker: { type: String, required: true },
  date: { type: Date, required: true },
  topic: { type: String, default: 'General' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Talk', talkSchema);
