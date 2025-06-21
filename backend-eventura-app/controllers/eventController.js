const db = require('../db');
const pool = require("../db.js");


const eventController = {
  // obtener todos los eventos
  getAllEvents: async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `SELECT 
        id_evento, 
        nombre_evento, 
        descripcion_evento,
        TO_CHAR(fecha_evento, 'DD-MM-YYYY') as fecha,
        TO_CHAR(hora_inicio_evento, 'HH24:MI') as hora
      FROM evento
      ORDER BY fecha_evento ASC`
    );

    const eventos = result.rows.map((row) => ({
      id: row[0] || 0,
      titulo: row[1] || 'Sin título',
      descripcion: row[2] || 'Sin descripción',
      fecha: row[3] ? `${row[3]} a las ${row[4] || '00:00'}` : 'Fecha no especificada',
      imagen: 'https://placehold.co/200x120/ff9800/ffffff?text=Evento' 
    }));

    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
},

  // obtener evento por ID
  getEventById: async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute(
        `SELECT * FROM evento WHERE id_evento = :1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener evento:', error);
      res.status(500).json({ error: error.message });
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.error('Error al cerrar la conexión:', err);
        }
      }
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
        descripcion_evento,
        TO_CHAR(fecha_evento, 'YYYY-MM-DD') AS fecha_formateada, 
        TO_CHAR(hora_inicio_evento, 'HH24:MI') AS hora_formateada,
        TO_CHAR(hora_termino_evento, 'HH24:MI') AS hora_termino_formateada
      FROM evento
      WHERE id_usuario = :1
      ORDER BY fecha_evento ASC`,
      [userId]
    );

    // Mapeamos las filas en un formato más amigable para el frontend
    const eventos = result.rows.map((row) => ({
      id: row[0],
      titulo: row[1],
      descripcion: row[2],   
      fecha: `${row[3]} a las ${row[4]}`,
      imagen: 'https://placehold.co/200x120/ff9800/ffffff?text=Evento' // Reemplaza si tienes una columna real de imagen
    }));

    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos del usuario:", error);
    res.status(500).json({ error: "Error al obtener eventos del usuario" });
  } finally {
    if (conn) await conn.close();
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

  // Validación de campos requeridos
  if (!nombre_evento || !fecha_evento || !id_usuario || !id_tipo_evento) {
    return res.status(400).json({
      error: "Los campos nombre, fecha, usuario y tipo son obligatorios"
    });
  }

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

    let conn;
    try {
      conn = await pool.getConnection();
      
      const result = await conn.execute(
        `UPDATE evento SET 
          nombre_evento = :1,
          descripcion_evento = :2,
          fecha_evento = TO_DATE(:3, 'YYYY-MM-DD'),
          hora_inicio_evento = TO_TIMESTAMP(:4, 'HH24:MI'),
          hora_termino_evento = TO_TIMESTAMP(:5, 'HH24:MI'),
          lugar_evento = :6,
          latitud = :7,
          longitud = :8,
          id_usuario = :9,
          id_tipo_evento = :10
        WHERE id_evento = :11
        RETURNING id_evento INTO :12`,
        [
          nombre_evento,
          descripcion_evento,
          fecha_evento,
          hora_inicio_evento,
          hora_termino_evento,
          lugar_evento,
          latitud,
          longitud,
          id_usuario,
          id_tipo_evento,
          id,
          { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        ],
        { autoCommit: true }
      );

      if (result.outBinds[0]) {
        res.json({ 
          message: 'Evento actualizado correctamente',
          id: result.outBinds[0]
        });
      } else {
        res.status(404).json({ message: 'Evento no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      res.status(500).json({ error: error.message });
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.error('Error al cerrar la conexión:', err);
        }
      }
    }
  },

  // eliminar evento
  deleteEvent: async (req, res) => {
    let conn;
    const { id } = req.params;

    try {
      conn = await pool.getConnection();

      const result = await conn.execute(
        `DELETE FROM evento WHERE id_evento = :1`, // parámetro posicional
        [parseInt(id)], // array de parámetros, orden importa
        { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        await conn.close();
        return res.status(404).json({ message: 'Evento no encontrado' });
      }

      await conn.close();
      res.json({ message: 'Evento eliminado exitosamente' });

    } catch (error) {
      console.error("Error al eliminar evento:", error.message);
      if (conn) await conn.close();
      res.status(500).json({ error: error.message });
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.error('Error al cerrar la conexión:', err);
        }
      }
    }
  }
};

module.exports = eventController;