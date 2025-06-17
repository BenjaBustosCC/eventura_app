const pool = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

//Registrar un nuevo usuario
registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  let conn;
  try {
    // Obtener la conexión
    conn = await pool.getConnection();

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ejecutar la query (Oracle usa :param en vez de ?)
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

getAllUsers = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `SELECT * FROM usuarios`, // Ajusta el nombre de la tabla si es necesario
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();
    res.status(200).json(result.rows);
  } catch (error) {
    if (conn) await conn.close();
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

module.exports = {
  registerUser,
  getAllUsers
};