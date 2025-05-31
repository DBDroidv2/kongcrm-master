import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['lead', 'prospect', 'customer', 'inactive'],
    default: 'lead',
    index: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  customFields: {
    type: Map,
    of: String,
    default: {},
  },
  nextFollowUp: {
    type: Date,
    index: true,
  },
  lastInteraction: {
    type: Date,
    index: true,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
