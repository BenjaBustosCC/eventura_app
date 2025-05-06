const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// Ruta para registrar un usuario
router.post("/register", userController.registerUser);

module.exports = router;