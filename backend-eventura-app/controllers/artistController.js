const oracledb = require("oracledb");
const pool = require("../db.js");

// Crear una nueva solicitud de gestor
const createSolicitud = async (req, res) => {
  const { usuario_id, instagram_link, youtube_link, descripcion, id_estado } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.execute(
      `INSERT INTO solicitud_gestor (usuario_id, instagram_link, youtube_link, descripcion, id_estado)
       VALUES (:usuario_id, :instagram_link, :youtube_link, :descripcion, :id_estado)`,
      { usuario_id, instagram_link, youtube_link, descripcion, id_estado },
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ message: "Solicitud creada exitosamente" });
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al crear la solicitud" });
  }
};

// Obtener todas las solicitudes con el nombre del estado
const getAllSolicitudes = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `SELECT 
         s.id, 
         s.usuario_id, 
         u.nombre_usuario, -- <-- nombre del usuario
         s.instagram_link, 
         s.youtube_link, 
         s.descripcion, 
         s.id_estado, 
         e.nombre_estado
       FROM solicitud_gestor s
       JOIN estado_solicitud e ON s.id_estado = e.id_estado
       JOIN usuarios u ON s.usuario_id = u.id_usuario`, // <-- join con usuarios
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();
    res.json(result.rows);
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al obtener las solicitudes" });
  }
};

// Obtener una solicitud por ID
const getSolicitudById = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `SELECT s.id, s.usuario_id, s.instagram_link, s.youtube_link, s.descripcion, s.id_estado, e.nombre_estado
         FROM solicitud_gestor s
         JOIN estado_solicitud e ON s.id_estado = e.id_estado
         WHERE s.id = :id`,
      { id }
    );
    await conn.close();
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al obtener la solicitud" });
  }
};

// Actualizar el estado de una solicitud
const updateEstadoSolicitud = async (req, res) => {
  const { id } = req.params;
  const { id_estado } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `UPDATE solicitud_gestor SET id_estado = :id_estado WHERE id = :id`,
      { id_estado, id },
      { autoCommit: true }
    );
    await conn.close();
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};

// Eliminar una solicitud
const deleteSolicitud = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `DELETE FROM solicitud_gestor WHERE id = :id`,
      { id },
      { autoCommit: true }
    );
    await conn.close();
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
};

module.exports = {
  createSolicitud,
  getAllSolicitudes,
  getSolicitudById,
  updateEstadoSolicitud,
  deleteSolicitud,
};