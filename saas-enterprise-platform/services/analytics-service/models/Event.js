const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  eventType: { 
    type: String, 
    required: true,
    enum: ['link_created', 'link_clicked', 'page_view', 'user_signup', 'api_call', 'error'],
    index: true
  },
  resourceId: String,
  resourceType: { 
    type: String, 
    enum: ['link', 'team', 'api_key']
  },
  metadata: {
    country: String,
    device: String,
    browser: String,
    referer: String,
    statusCode: Number,
    duration: Number
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true,
    expires: 7776000 // 90 days TTL
  }
})

// Compound index for efficient queries
EventSchema.index({ userId: 1, timestamp: -1 })
EventSchema.index({ eventType: 1, timestamp: -1 })

module.exports = mongoose.model('Event', EventSchema)
