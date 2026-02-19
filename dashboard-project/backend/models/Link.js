const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    short: {
      type: String,
      required: [true, 'Please provide a short link'],
      unique: true
    },
    url: {
      type: String,
      required: [true, 'Please provide a URL'],
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid URL'
      ]
    },
    time: {
      type: String,
      default: 'just now'
    },
    clicks: {
      type: Number,
      default: 0
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);
