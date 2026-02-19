const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    unique: true,
    index: true
  },
  plan: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
    index: true
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'canceled', 'past_due'],
    default: 'active',
    index: true
  },
  billingCycle: {
    start: Date,
    end: Date,
    renewDate: { 
      type: Date,
      index: true
    }
  },
  pricing: {
    monthlyPrice: Number,
    annualPrice: Number,
    currency: { 
      type: String, 
      default: 'USD' 
    }
  },
  limits: {
    linksPerMonth: Number,
    customDomains: { type: Boolean, default: false },
    teamMembers: Number,
    apiRequests: Number
  },
  usage: {
    linksCreated: { type: Number, default: 0 },
    apiCallsUsed: { type: Number, default: 0 },
    resetDate: Date
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'stripe', 'paypal']
  },
  invoices: [mongoose.Schema.Types.ObjectId],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
})

module.exports = mongoose.model('Subscription', SubscriptionSchema)

const InvoiceSchema = new mongoose.Schema({
  subscriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true
  },
  invoiceNumber: { 
    type: String, 
    unique: true,
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft',
    index: true
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  dueDate: Date,
  paidDate: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

exports.Invoice = mongoose.model('Invoice', InvoiceSchema)
