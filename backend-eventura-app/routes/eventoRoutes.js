const express = require("express");
const eventoController = require("../controllers/eventoController");
const router = express.Router();

// Ruta para crear un nuevo evento
router.post("/eventos", eventoController.crearEvento);
router.get('/eventos', eventoController.obtenerEventos);

module.exports = router;
