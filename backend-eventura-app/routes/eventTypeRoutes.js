const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');

// Get all event types
router.get('/tipos-evento', eventTypeController.getAllEventTypes);

// Create new event type
router.post('/tipos-evento', eventTypeController.createEventType);

// Delete event type
router.delete('/tipos-evento/:id', eventTypeController.deleteEventType);

module.exports = router;