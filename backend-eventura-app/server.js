const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Importa las rutas de usuario
const eventRoutes = require("./routes/eventoRoutes"); // Importa las rutas de evento
const authController = require("./routes/authRoutes");


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/users", userRoutes); // Usa las rutas de usuario
app.use("/api/eventos", eventRoutes); // Usa las rutas de eventos
app.use("/api/auth", authController); // Usa las rutas de autenticación


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
