const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

//Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    let conn;
    try {
      // Obtener la conexión
      conn = await pool.getConnection();

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Ejecutar la query
      await conn.query(
        "INSERT INTO usuarios (nombre_usuario, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      conn.release();

      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
      if (conn) conn.release();
      console.error("Error al registrar usuario:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
};