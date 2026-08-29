const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "ORGANIZER", "VOLUNTEER", "PARTICIPANT"],
    default: "PARTICIPANT"
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  profileImage: {
    type: String
  },
  walletAddress: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  refreshTokens: [String]
}, {
  timestamps: true
});

// Password hash middleware
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
