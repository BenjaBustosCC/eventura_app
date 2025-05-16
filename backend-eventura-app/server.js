//KBROS EN EL PACKAGE.JSON CAMBIE LA VERSION DE EXPRESS DE 5.10... A 4.18
// Y ESO LO ARREGLO. Y AGREGUE UNAS RUTAS PARA CONECTAR TODO CLARAMENTE
//Y HASTA EL MOMENTO NO SE HA ROTO NADA DE NUEVO :3


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes"); // Importa las rutas de usuario
const eventRoutes = require("./routes/eventRoutes");
const eventTypeRoutes = require("./routes/eventTypeRoutes"); // Importa las rutas de tipos de eventos
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 8081;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());

app.use(bodyParser.json());

// Rutas
app.use("/api/users", userRoutes); // Usa las rutas de usuario
app.use("/api/auth", authRoutes); // Usa las rutas de autenticación
app.use("/api/eventos", eventRoutes);
app.use("/api/tipos-evento", eventTypeRoutes); // Usa las rutas de tipos de eventos

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
