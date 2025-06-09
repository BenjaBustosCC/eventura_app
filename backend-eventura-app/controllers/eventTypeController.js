const db = require('../db');
const pool = require("../db.js");


const eventTypeController = {
  // obtener todos los tipos de eventos
  getAllEventTypes: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute(
        `SELECT id_tipo_evento, nombre_tipo_evento FROM tipo_evento ORDER BY nombre_tipo_evento ASC`
      );
      const tipos = result.rows.map(row => ({
        id: row[0],
        nombre: row[1],
      }));
      await conn.close();
      res.json(tipos);
    } catch (error) {
      if (conn) await conn.close();
      console.error("Error al obtener tipos de evento:", error);
      res.status(500).json({ error: "Error al obtener tipos de evento" });
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