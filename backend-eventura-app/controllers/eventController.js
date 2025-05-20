const db = require('../db');
const pool = require("../db.js");


const eventController = {
  // obtener todos los eventos
  getAllEvents: async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.execute(
      `SELECT id_evento, nombre_evento, TO_CHAR(fecha_evento, 'DD-MM-YYYY'), TO_CHAR(hora_inicio_evento, 'HH24:MI')
       FROM evento
       ORDER BY fecha_evento ASC`
    );

    const eventos = result.rows.map((row) => ({
      id: row[0],
      titulo: row[1],
      fecha: `${row[2]} a las ${row[3]}`,
      imagen: 'https://via.placeholder.com/150', // Podés adaptar esto si tenés un campo real de imagen
    }));

    await conn.close();
    res.json(eventos);
  } catch (error) {
    if (conn) await conn.close();
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
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
  let conn;

  try {
    conn = await pool.getConnection();

    // Ejecutamos la consulta con alias claros para facilitar el mapeo
    const result = await conn.execute(
      `SELECT 
         id_evento, 
         nombre_evento, 
         TO_CHAR(fecha_evento, 'DD-MM-YYYY') AS fecha_formateada, 
         TO_CHAR(hora_inicio_evento, 'HH24:MI') AS hora_formateada
       FROM evento
       WHERE id_usuario = :1
       ORDER BY fecha_evento ASC`,
      [userId]
    );

    // Mapeamos las filas en un formato más amigable para el frontend
    const eventos = result.rows.map((row) => ({
      id: row[0],
      titulo: row[1],
      fecha: `${row[2]} a las ${row[3]}`,
      imagen: 'https://via.placeholder.com/150', // Reemplaza si tienes una columna real de imagen
    }));

    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos del usuario:", error);
    res.status(500).json({ error: "Error al obtener eventos del usuario" });
  } finally {
    if (conn) await conn.close(); // Aseguramos el cierre de la conexión siempre
  }
},
  // crear evento
  createEvent: async (req, res) => {
  const {
    nombre_evento,
    descripcion_evento,
    fecha_evento,           // formato: 'YYYY-MM-DD'
    hora_inicio_evento,     // formato: 'HH:MI' o 'HH24:MI'
    hora_termino_evento,    // formato: 'HH:MI' o 'HH24:MI'
    lugar_evento,
    latitud,
    longitud,
    id_usuario,
    id_tipo_evento
  } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.execute(
      `INSERT INTO evento (
        nombre_evento, descripcion_evento, fecha_evento, 
        hora_inicio_evento, hora_termino_evento, lugar_evento,
        latitud, longitud, id_usuario, id_tipo_evento
      ) VALUES (
        :1, :2, TO_DATE(:3, 'YYYY-MM-DD'), 
        TO_TIMESTAMP(:4, 'HH24:MI'), TO_TIMESTAMP(:5, 'HH24:MI'), :6, :7, :8, :9, :10
      )`,
      [
        nombre_evento, descripcion_evento, fecha_evento,
        hora_inicio_evento, hora_termino_evento, lugar_evento,
        latitud, longitud, id_usuario, id_tipo_evento
      ],
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ message: 'Evento creado correctamente' });
  } catch (error) {
    if (conn) await conn.close();
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