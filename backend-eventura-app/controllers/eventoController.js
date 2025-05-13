const pool = require("../db.js");

// Registrar un nuevo evento
exports.crearEvento = async (req, res) => {
  const { nombre, descripcion, fecha, horaInicio, horaTermino, lugar, perfilId, tipoEventoId } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();

    await conn.execute(
      `INSERT INTO evento (
        nombre_evento, descripcion_evento, fecha_evento, hora_inicio_evento,
        hora_termino_evento, lugar_evento, perfil_id_perfil, tipo_evento_id_tipo_evento
      ) VALUES (
        :nombre, :descripcion, TO_DATE(:fecha, 'YYYY-MM-DD'),
        TO_DATE(:horaInicio, 'HH24:MI'), TO_DATE(:horaTermino, 'HH24:MI'),
        :lugar, :perfilId, :tipoEventoId
      )`,
      { nombre, descripcion, fecha, horaInicio, horaTermino, lugar, perfilId, tipoEventoId },
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: "Evento creado exitosamente" });
  } catch (error) {
    if (conn) await conn.close();
    console.error("Error al crear evento:", error);
    res.status(500).json({ error: "Error al crear evento" });
  }
};

// Obtener eventos para mostrar en el frontend
exports.obtenerEventos = async (req, res) => {
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
};