const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para registrar usuario
router.post('/usuarios', userController.registerUser);

// Ruta para obtener todos los usuarios
router.get('/usuarios', userController.getAllUsers);

module.exports = router;