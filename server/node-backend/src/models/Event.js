const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  images: [String],
  category: {
    type: String,
  },
  tags: [String],
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  venue: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date
  },
  capacity: {
    type: Number,
    required: true,
    default: 0
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "CANCELLED"],
    default: "DRAFT"
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  ticketTypes: [
    {
      name: String,
      price: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      capacity: Number,
      registeredCount: { type: Number, default: 0 }
    }
  ],
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true
});

// Indexes for optimized searching
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ organizationId: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Event', eventSchema);
