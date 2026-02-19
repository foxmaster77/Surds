const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: Number, default: 1 },
  color: { type: String, default: '#6c63ff' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);
