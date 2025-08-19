const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

// Crear nueva solicitud
router.post("/solicitudes", artistController.createSolicitud);

// Obtener todas las solicitudes
router.get("/solicitudes", artistController.getAllSolicitudes);

// Obtener una solicitud por ID
router.get("/solicitudes/:id", artistController.getSolicitudById);

// Actualizar el estado de una solicitud
router.put("/solicitudes/:id/estado", artistController.updateEstadoSolicitud);

// Eliminar una solicitud
router.delete("/solicitudes/:id", artistController.deleteSolicitud);

module.exports = router;