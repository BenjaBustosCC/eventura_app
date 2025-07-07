const pool = require("../db.js");
const axios = require("axios");
require('dotenv').config();

exports.getItinerariosByUsuario = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { id_usuario } = req.params;
    const result = await connection.execute(
      `SELECT id_itinerario, ciudad, TO_CHAR(fecha, 'YYYY-MM-DD') as fecha, contenido, creado_en
       FROM itinerario
       WHERE id_usuario = :id_usuario
       ORDER BY creado_en DESC`,
      { id_usuario }
    );

    const keys = ["id_itinerario", "ciudad", "fecha", "contenido", "creado_en"];
    // Procesa los LOBs a string
    const itinerarios = await Promise.all(result.rows.map(async row => {
      const obj = Object.fromEntries(keys.map((k, i) => [k, row[i]]));
      // Si contenido es un LOB, conviértelo a string
      if (obj.contenido && typeof obj.contenido === "object" && typeof obj.contenido.getData === "function") {
        obj.contenido = await obj.contenido.getData();
      }
      return obj;
    }));

    res.json(itinerarios);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los itinerarios" });
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

exports.generarItinerarioDesdeEventos = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    // Extrae la ubicación del prompt recibido
    const promptUsuario = req.body.prompt || "";
    let ubicacion = "";
    // Busca la ciudad/lugar después de "quiero visitar" o "en"
    const match = promptUsuario.match(/(?:quiero visitar|en)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i);
    if (match && match[1]) {
      ubicacion = match[1].trim();
    }

    // Prepara la fecha actual en formato YYYY-MM-DD
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaActual = `${yyyy}-${mm}-${dd}`;

    // Consulta solo eventos de hoy y de la ubicación (si hay ubicación)
    let query = `
      SELECT NOMBRE_EVENTO, LUGAR_EVENTO, FECHA_EVENTO, HORA_INICIO_EVENTO, HORA_TERMINO_EVENTO
      FROM EVENTO
      WHERE TRUNC(FECHA_EVENTO) = TO_DATE(:fecha, 'YYYY-MM-DD')
    `;
    const binds = [fechaActual];

    if (ubicacion) {
      query += " AND LOWER(LUGAR_EVENTO) LIKE :ubicacion";
      binds.push(`%${ubicacion.toLowerCase()}%`);
    }

    query += `
      ORDER BY FECHA_EVENTO
      FETCH FIRST 10 ROWS ONLY
    `;

    const result = await connection.execute(query, binds);

    const eventos = result.rows || [];

    if (eventos.length === 0) {
      return res.status(200).json({ itinerario: "No hay eventos disponibles para la fecha y ubicación seleccionadas." });
    }

    // Corrige el mapeo de los campos
    const listaEventos = eventos
      .map(([nombre, lugar, fecha, horaInicio, horaTermino]) =>
        `- ${nombre} en ${lugar} el ${fecha} de ${horaInicio} a ${horaTermino}`
      )
      .join("\n");

    // Incluye la fecha en el prompt para la IA
    const prompt = `Genera un itinerario cultural para una persona en ${ubicacion || "la ciudad"} para el día ${fechaActual} con los siguientes eventos:\n${listaEventos}`;

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

    // GUARDAR EL ITINERARIO EN LA TABLA
    const id_usuario = req.body.id_usuario; // asegúrate de enviar id_usuario desde el frontend
    await connection.execute(
      `INSERT INTO itinerario (id_usuario, ciudad, fecha, contenido)
       VALUES (:id_usuario, :ciudad, TO_DATE(:fecha, 'YYYY-MM-DD'), :contenido)`,
      {
        id_usuario,
        ciudad: ubicacion || null,
        fecha: fechaActual,
        contenido: textoGenerado || "No se pudo generar itinerario.",
      },
      { autoCommit: true }
    );
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