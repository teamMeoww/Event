const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getFeaturedEvents, 
  getEventById, 
  createEvent, 
  getMyEvents, 
  publishEvent,
  registerForEvent,
  assignVolunteer,
  getEventAnalytics 
} = require('./eventController');
const { protect, authorize } = require('../../middleware/authMiddleware');
const { issueCredentials } = require('../credentials/credentialController');

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:id', getEventById); // Ensure this is below /featured

// Organizer routes
router.post('/', protect, authorize('ORGANIZER'), createEvent);
router.get('/my/events', protect, authorize('ORGANIZER'), getMyEvents); // Switched to /my/events to avoid collision
router.post('/:id/publish', protect, authorize('ORGANIZER'), publishEvent);
router.post('/:eventId/volunteers', protect, authorize('ORGANIZER'), assignVolunteer);
router.get('/:eventId/analytics', protect, authorize('ORGANIZER'), getEventAnalytics);
router.post('/:eventId/credentials/issue', protect, authorize('ORGANIZER'), issueCredentials);

// Participant routes
router.post('/:eventId/register', protect, registerForEvent);

module.exports = router;
