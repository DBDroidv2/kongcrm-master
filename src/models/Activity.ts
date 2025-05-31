import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required'],
    index: true,
  },
  type: {
    type: String,
    enum: ['note', 'call', 'email', 'meeting', 'task', 'status_change'],
    required: [true, 'Activity type is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  dueDate: {
    type: Date,
    index: true,
  },
  completedAt: {
    type: Date,
    index: true,
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

// Create compound index for efficient customer activity queries
ActivitySchema.index({ customer: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
