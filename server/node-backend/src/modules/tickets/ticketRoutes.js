const express = require('express');
const router = express.Router();
const { getMyTickets, getTicketById, getTicketQR } = require('./ticketController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/my-tickets', protect, getMyTickets);
router.get('/:id', protect, getTicketById);
router.get('/:id/qr', protect, getTicketQR);

module.exports = router;
