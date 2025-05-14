const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Get all events
router.get('/eventos', eventController.getAllEvents);

// Get event by ID
router.get('/eventos/:id', eventController.getEventById);

// Get events by user ID
router.get('/eventos/usuario/:userId', eventController.getEventsByUserId);

// Get events by type
router.get('/eventos/tipo/:typeId', eventController.getEventsByType);

// Create new event
router.post('/eventos', eventController.createEvent);

// Update event
router.put('/eventos/:id', eventController.updateEvent);

// Delete event
router.delete('/eventos/:id', eventController.deleteEvent);

module.exports = router;