require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require("./routes/eventRoutes");
const eventTypeRoutes = require("./routes/eventTypeRoutes");
const authRoutes = require('./routes/authRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const artistRoutes = require("./routes/artistRoutes");

const app = express();
const PORT = 8081;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());

// Aumenta el límite de tamaño del body a 10mb
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/eventos", eventRoutes);
app.use("/api/tipos-evento", eventTypeRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/artist", artistRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});