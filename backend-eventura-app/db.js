const mysql = require("mysql2/promise"); // Asegúrate de usar mysql2/promise

const pool = mysql.createPool({
  host: "localhost", // Cambia esto al host de tu servidor MySQL
  user: "root", // Usuario de MySQL
  password: "Colocolo060811!", // Contraseña de MySQL
  database: "eventura_app", // Nombre de la base de datos en MySQL
  connectionLimit: 5,
  port: 3307, // Cambia esto si tu MySQL está en otro puerto
});

module.exports = pool;