const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Importa las rutas de usuario

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/users", userRoutes); // Usa las rutas de usuario

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});