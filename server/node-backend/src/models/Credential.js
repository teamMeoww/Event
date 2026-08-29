const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['POAP', 'CERTIFICATE', 'BADGE'],
    default: 'POAP'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  blockchain: {
    tokenId: String,
    transactionHash: String,
    minted: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

credentialSchema.index({ userId: 1 });
credentialSchema.index({ eventId: 1 });

module.exports = mongoose.model('Credential', credentialSchema);
