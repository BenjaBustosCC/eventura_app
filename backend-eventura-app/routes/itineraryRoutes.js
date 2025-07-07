const express = require("express");
const router = express.Router();
const { generarItinerarioDesdeEventos } = require("../controllers/itineraryController");
const itineraryController = require("../controllers/itineraryController");


router.post("/", generarItinerarioDesdeEventos);
router.get("/:id_usuario", itineraryController.getItinerariosByUsuario);


module.exports = router;
