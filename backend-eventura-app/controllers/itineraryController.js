const pool = require("../db.js");
const axios = require("axios");
require('dotenv').config();


exports.generarItinerarioDesdeEventos = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const result = await connection.execute(
    `SELECT NOMBRE_EVENTO, DESCRIPCION_EVENTO, FECHA_EVENTO, LUGAR_EVENTO
     FROM EVENTO
     WHERE FECHA_EVENTO >= SYSDATE
     ORDER BY FECHA_EVENTO
     FETCH FIRST 10 ROWS ONLY`
);


    const eventos = result.rows || [];

    if (eventos.length === 0) {
      return res.status(200).json({ itinerario: "No hay eventos disponibles." });
    }
    //arreglar para que hable en persona y no en maquina
    const listaEventos = eventos
      .map(([nombre, descripcion, fecha, lugar]) => `- ${nombre} en ${lugar} el ${fecha}`)
      .join("\n");

    const prompt = `Genera un itinerario cultural para una persona con los siguientes eventos:\n${listaEventos}`;

    const response = await axios.post(
      process.env.OPENAI_API_URL,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente experto en crear itinerarios turísticos y sociales con base en eventos reales.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const textoGenerado = response.data.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ itinerario: textoGenerado || "No se pudo generar itinerario." });

  } catch (error) {
    console.error("Error generando itinerario:", error);
    return res.status(500).json({ error: "No se pudo generar el itinerario" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("Error cerrando conexión:", e);
      }
    }
  }
};
