const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  originalUrl: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Invalid URL'
    }
  },
  shortCode: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  customAlias: { 
    type: String, 
    unique: true,
    sparse: true,
    index: true
  },
  title: String,
  description: String,
  tags: [String],
  clicks: { 
    type: Number, 
    default: 0 
  },
  clickDetails: [{
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    referer: String,
    userAgent: String,
    ipAddress: String,
    country: String
  }],
  expiresAt: Date,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
})

// Auto-delete expired links
LinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Link', LinkSchema)
