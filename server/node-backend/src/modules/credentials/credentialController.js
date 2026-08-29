const Credential = require('../../models/Credential');
const Checkin = require('../../models/Checkin');
const Event = require('../../models/Event');
const User = require('../../models/User');
const blockchainService = require('../blockchain/blockchainService');

// @desc    Get my credentials
// @route   GET /api/v1/credentials/me
// @access  Private (PARTICIPANT)
const getMyCredentials = async (req, res, next) => {
  try {
    const credentials = await Credential.find({ userId: req.user._id })
      .populate('eventId', 'title coverImage')
      .sort({ issuedAt: -1 });

    res.json({ success: true, data: credentials });
  } catch (error) {
    next(error);
  }
};

// @desc    Issue POAPs to checked-in participants
// @route   POST /api/v1/events/:eventId/credentials/issue
// @access  Private (ORGANIZER)
const issueCredentials = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { title, description, image } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this event' });
    }

    // Find all checked in participants
    const checkins = await Checkin.find({ eventId }).populate('participantId');
    const issuedList = [];

    // Issue credential to each participant sequentially (in real world, use a queue like bullmq)
    for (const checkin of checkins) {
      const participant = checkin.participantId;
      
      // Check if already issued
      const existing = await Credential.findOne({ eventId, userId: participant._id });
      if (existing) continue;

      const credential = await Credential.create({
        userId: participant._id,
        eventId,
        type: 'POAP',
        title: title || `${event.title} POAP`,
        description,
        image
      });

      // Attempt async blockchain minting
      if (participant.walletAddress) {
        blockchainService.mintCredentialAsync(participant.walletAddress, `https://api.eventone.app/metadata/poap/${credential._id}`)
          .then(async (result) => {
             if (result.success) {
               credential.blockchain.minted = true;
               credential.blockchain.transactionHash = result.transactionHash;
               await credential.save();
             }
          });
      }

      issuedList.push(credential);
    }

    res.json({ 
      success: true, 
      message: `Successfully issued ${issuedList.length} credentials`,
      data: issuedList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCredentials,
  issueCredentials
};
