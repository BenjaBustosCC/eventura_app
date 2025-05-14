const db = require('../db');

const eventController = {
  // obtener todos los eventos
  getAllEvents: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM evento');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // obtener evento por ID
  getEventById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM evento WHERE id_evento = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // obtener eventos por ID de usuario
  getEventsByUserId: async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await db.query('SELECT * FROM evento WHERE id_usuario = $1', [userId]);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  // crear evento
  createEvent: async (req, res) => {
    const {
      nombre_evento,
      descripcion_evento,
      fecha_evento,
      hora_inicio_evento,
      hora_termino_evento,
      lugar_evento,
      latitud,
      longitud,
      id_usuario,
      id_tipo_evento
    } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO evento (
          nombre_evento, descripcion_evento, fecha_evento, 
          hora_inicio_evento, hora_termino_evento, lugar_evento,
          latitud, longitud, id_usuario, id_tipo_evento
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [nombre_evento, descripcion_evento, fecha_evento, 
         hora_inicio_evento, hora_termino_evento, lugar_evento,
         latitud, longitud, id_usuario, id_tipo_evento]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // actualizar evento
  updateEvent: async (req, res) => {
    const { id } = req.params;
    const {
      nombre_evento,
      descripcion_evento,
      fecha_evento,
      hora_inicio_evento,
      hora_termino_evento,
      lugar_evento,
      latitud,
      longitud,
      id_usuario,
      id_tipo_evento
    } = req.body;

    try {
      const result = await db.query(
        `UPDATE evento SET 
          nombre_evento = $1,
          descripcion_evento = $2,
          fecha_evento = $3,
          hora_inicio_evento = $4,
          hora_termino_evento = $5,
          lugar_evento = $6,
          latitud = $7,
          longitud = $8,
          id_usuario = $9,
          id_tipo_evento = $10
        WHERE id_evento = $11 RETURNING *`,
        [nombre_evento, descripcion_evento, fecha_evento,
         hora_inicio_evento, hora_termino_evento, lugar_evento,
         latitud, longitud, id_usuario, id_tipo_evento, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // eliminar evento
  deleteEvent: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM evento WHERE id_evento = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = eventController;