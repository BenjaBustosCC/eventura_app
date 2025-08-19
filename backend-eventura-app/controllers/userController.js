const oracledb = require("oracledb");
const pool = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.execute(
      "INSERT INTO usuarios (nombre_usuario, email, password) VALUES (:name, :email, :password)",
      { name, email, password: hashedPassword },
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    if (conn) await conn.close();
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

const getAllUsers = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `SELECT * FROM usuarios`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();
    res.status(200).json(result.rows);
  } catch (error) {
    if (conn) await conn.close();
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { id_rol } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.execute(
      "UPDATE usuarios SET id_rol = :id_rol WHERE id_usuario = :id",
      { id_rol, id },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      "DELETE FROM usuarios WHERE id_usuario = :id",
      { id },
      { autoCommit: true }
    );
    await conn.close();
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    if (conn) await conn.close();
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  updateUserRole,
  deleteUser
};