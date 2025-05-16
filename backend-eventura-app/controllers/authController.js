const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let conn;
  
  try {
    conn = await pool.getConnection();

    // Buscar usuario por email
    const result = await conn.execute(
      "SELECT id_usuario, nombre_usuario, email, password, id_rol FROM usuarios WHERE email = :email",
      { email }
    );

    if (result.rows.length === 0) {
      await conn.close();
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = {
      id: result.rows[0][0],
      name: result.rows[0][1],
      email: result.rows[0][2],
      password: result.rows[0][3],
      role: result.rows[0][4]
    };

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await conn.close();
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    await conn.close();

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    if (conn) await conn.close();
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};