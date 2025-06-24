const express = require("express");
const router = express.Router();
const { generarItinerarioDesdeEventos } = require("../controllers/itineraryController");

router.post("/", generarItinerarioDesdeEventos);

module.exports = router;
