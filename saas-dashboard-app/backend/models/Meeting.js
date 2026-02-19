const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 },
  attendees: { type: Number, default: 1 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', meetingSchema);
