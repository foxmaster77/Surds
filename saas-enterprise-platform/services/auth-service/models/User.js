const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: String,
  lastName: String,
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  teamId: mongoose.Schema.Types.ObjectId,
  subscription: {
    plan: { 
      type: String, 
      enum: ['free', 'pro', 'enterprise'], 
      default: 'free' 
    },
    active: { 
      type: Boolean, 
      default: true 
    },
    renewalDate: Date,
    usageCount: { 
      type: Number, 
      default: 0 
    },
    usageResetDate: Date
  },
  apiKeys: [{
    key: String,
    name: String,
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
})

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
