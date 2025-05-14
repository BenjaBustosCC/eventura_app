const db = require('../db');

const eventTypeController = {
  // obtener todos los tipos de eventos
  getAllEventTypes: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM tipo_evento');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // crear un nuevo tipo de evento
  createEventType: async (req, res) => {
    const { nombre_tipo_evento } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO tipo_evento (nombre_tipo_evento) VALUES ($1) RETURNING *',
        [nombre_tipo_evento]
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
      const result = await db.query(
        'DELETE FROM tipo_evento WHERE id_tipo_evento = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tipo de evento no encontrado' });
      }
      
      res.json({ message: 'Tipo de evento eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = eventTypeController;