const db = require('../db');

const eventTypeController = {
  // obtener todos los tipos de eventos
  getAllEventTypes: async (req, res) => {
    try {
      const result = await conn.query('SELECT * FROM tipo_evento');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // crear un nuevo tipo de evento
  createEventType: async (req, res) => {
    const { nombre_tipo_evento } = req.body;

    try {
      const result = await conn.query(
        `INSERT INTO tipo_evento (nombre_tipo_evento) 
         VALUES (:nombre_tipo_evento) 
         RETURNING id_tipo_evento, nombre_tipo_evento INTO :out`,
        { nombre_tipo_evento },
        { autoCommit: true }
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // eliminar un tipo de evento
  deleteEventType: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await conn.query(
        'DELETE FROM tipo_evento WHERE id_tipo_evento = :id RETURNING id_tipo_evento INTO :out',
        { id },
        { autoCommit: true }
      );
      
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Tipo de evento no encontrado' });
      }
      
      res.json({ message: 'Tipo de evento eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = eventTypeController;