const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkedInAt: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    type: String
  },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Critical index to prevent duplicate checkins at DB level
checkinSchema.index({ ticketId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Checkin', checkinSchema);
