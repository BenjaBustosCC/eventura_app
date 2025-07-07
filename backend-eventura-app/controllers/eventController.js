const pool = require("../db.js");
const oracledb = require('oracledb');

const eventController = {
  // Obtener todos los eventos (con imagen)
  getAllEvents: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute(
        `SELECT e.id_evento, e.nombre_evento, e.descripcion_evento, 
                TO_CHAR(e.fecha_evento, 'DD-MM-YYYY'), TO_CHAR(e.hora_inicio_evento, 'HH24:MI'), 
                e.latitud, e.longitud, e.lugar_evento, e.imagen, te.nombre_tipo_evento, e.id_estado
        FROM evento e
        LEFT JOIN tipo_evento te ON e.id_tipo_evento = te.id_tipo_evento
        ORDER BY e.fecha_evento ASC`
      );

      // Función auxiliar para convertir LOB a Buffer
      const lobToBuffer = (lob) => {
        return new Promise((resolve, reject) => {
          const chunks = [];
          lob.on('data', (chunk) => chunks.push(chunk));
          lob.on('end', () => resolve(Buffer.concat(chunks)));
          lob.on('error', reject);
        });
      };

      const eventos = await Promise.all(result.rows.map(async (row) => {
        const [id, nombre, descripcion, fecha, hora, latitud, longitud, lugar_evento, imagenLob, tipo_evento_nombre, id_estado] = row;
        let imagenBase64 = null;
        if (imagenLob) {
          if (Buffer.isBuffer(imagenLob)) {
            imagenBase64 = `data:image/jpeg;base64,${imagenLob.toString('base64')}`;
          } else if (typeof imagenLob === 'object' && typeof imagenLob.on === 'function') {
            try {
              const buffer = await lobToBuffer(imagenLob);
              imagenBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
            } catch (err) {
              console.error('Error al convertir LOB a buffer:', err);
            }
          }
        }

        return {
          id,
          titulo: nombre,
          descripcion,
          fecha: `${fecha} a las ${hora}`,
          imagen: imagenBase64,
          latitud,
          longitud,
          lugar_evento,
          tipo_evento_nombre,
          id_estado, // <-- ahora sí lo envías al frontend
        };
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

  // Obtener evento por ID (con imagen)
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

      const row = result.rows[0];
      let imagenBase64 = null;
      if (row[11] && Buffer.isBuffer(row[11])) {
        imagenBase64 = `data:image/jpeg;base64,${row[11].toString('base64')}`;
      }

      res.json({
        id: row[0],
        nombre: row[1],
        descripcion: row[2],
        fecha: row[3],
        hora_inicio: row[4],
        hora_termino: row[5],
        lugar_evento: row[6],
        latitud: row[7],
        longitud: row[8],
        id_usuario: row[9],
        id_tipo_evento: row[10],
        imagen: imagenBase64,
        id_estado: row[12], // <-- nuevo campo
      });

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

  // Obtener eventos por ID de usuario (sin imagen)
  getEventsByUserId: async (req, res) => {
    const { userId } = req.params;
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute(
        `SELECT 
          id_evento, 
          nombre_evento, 
          descripcion_evento,
          TO_CHAR(fecha_evento, 'YYYY-MM-DD') AS fecha_formateada, 
          TO_CHAR(hora_inicio_evento, 'HH24:MI') AS hora_formateada,
          TO_CHAR(hora_termino_evento, 'HH24:MI') AS hora_termino_formateada,
          id_estado
        FROM evento
        WHERE id_usuario = :1
        ORDER BY fecha_evento ASC`,
        [userId]
      );

      const eventos = result.rows.map((row) => ({
        id: row[0],
        titulo: row[1],
        descripcion: row[2],
        fecha: `${row[3]} a las ${row[4]}`,
        imagen: 'https://placehold.co/200x120/ff9800/ffffff?text=Evento',
        id_estado: row[6], // <-- nuevo campo
      }));

      res.json(eventos);
    } catch (error) {
      console.error("Error al obtener eventos del usuario:", error);
      res.status(500).json({ error: "Error al obtener eventos del usuario" });
    } finally {
      if (conn) await conn.close();
    }
  },

  // Crear evento (con imagen base64)
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
    id_tipo_evento,
    // id_estado, // <-- ya no lo tomamos del body
    imagen // <-- base64 string
  } = req.body;

  // Validación de campos requeridos
  if (!nombre_evento || !fecha_evento || !id_usuario || !id_tipo_evento) {
    return res.status(400).json({
      error: "Los campos nombre, fecha, usuario y tipo son obligatorios"
    });
  }

  let conn;
  try {
    // Decodifica la imagen base64 a buffer (si viene)
    let imagenBuffer = null;
    if (imagen) {
      const base64Data = imagen.includes(',') ? imagen.split(',')[1] : imagen;
      imagenBuffer = Buffer.from(base64Data, 'base64');
    }

    conn = await pool.getConnection();
    await conn.execute(
      `INSERT INTO evento (
        nombre_evento, descripcion_evento, fecha_evento, 
        hora_inicio_evento, hora_termino_evento, lugar_evento,
        latitud, longitud, id_usuario, id_tipo_evento, id_estado, imagen
      ) VALUES (
        :1, :2, TO_DATE(:3, 'YYYY-MM-DD'), 
        TO_TIMESTAMP(:4, 'HH24:MI'), TO_TIMESTAMP(:5, 'HH24:MI'), :6, :7, :8, :9, :10, :11, :12
      )`,
      [
        nombre_evento, descripcion_evento, fecha_evento,
        hora_inicio_evento, hora_termino_evento, lugar_evento,
        latitud, longitud, id_usuario, id_tipo_evento, 1, imagenBuffer // <-- aquí va el 1 fijo
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

  // Actualizar evento (con imagen opcional, compatible con BLOB)
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
      id_tipo_evento,
      id_estado, // <-- nuevo campo
      imagen // <-- base64 string opcional
    } = req.body;

    let conn;
    try {
      // Decodifica la imagen base64 a buffer (si viene)
      let imagenBuffer = null;
      if (imagen) {
        const base64Data = imagen.includes(',') ? imagen.split(',')[1] : imagen;
        imagenBuffer = Buffer.from(base64Data, 'base64');
      }

      conn = await pool.getConnection();

      let query = `
        UPDATE evento SET
          nombre_evento = :1,
          descripcion_evento = :2,
          fecha_evento = TO_DATE(:3, 'YYYY-MM-DD'),
          hora_inicio_evento = TO_TIMESTAMP(:4, 'HH24:MI'),
          hora_termino_evento = TO_TIMESTAMP(:5, 'HH24:MI'),
          lugar_evento = :6,
          latitud = :7,
          longitud = :8,
          id_usuario = :9,
          id_tipo_evento = :10,
          id_estado = :11
          ${imagen ? ', imagen = :12' : ''}
        WHERE id_evento = :${imagen ? 13 : 12}
      `;

      // Arma los binds según si hay imagen o no
      let binds = [
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
        id_estado
      ];

      if (imagen) {
        binds.push(imagenBuffer); // :12
        binds.push(id);           // :13
      } else {
        binds.push(id);           // :12
      }

      const result = await conn.execute(query, binds, { autoCommit: true });

      await conn.close();

      if (result.rowsAffected && result.rowsAffected > 0) {
        res.json({ message: 'Evento actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Evento no encontrado' });
      }
    } catch (error) {
      if (conn) await conn.close();
      console.error('Error al actualizar evento:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar evento
  deleteEvent: async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.execute(
        'DELETE FROM evento WHERE id_evento = :1',
        [id],
        { autoCommit: true }
      );
      await conn.close();
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Evento no encontrado' });
      }
      res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
      if (conn) await conn.close();
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = eventController;