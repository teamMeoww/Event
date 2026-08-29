const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketCode: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  ticketType: {
    type: String
  },
  status: {
    type: String,
    enum: ["ACTIVE", "MINTING", "MINTED", "USED", "CANCELLED", "REVOKED"],
    default: "ACTIVE"
  },
  qrSecret: {
    type: String,
  },
  checkedInAt: {
    type: Date
  },
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  blockchain: {
    enabled: { type: Boolean, default: false },
    tokenId: String,
    transactionHash: String,
    minted: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

ticketSchema.index({ userId: 1 });
ticketSchema.index({ eventId: 1 });
ticketSchema.index({ ticketCode: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
