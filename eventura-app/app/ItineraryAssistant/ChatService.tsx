import { OPENAI_API_KEY, OPENAI_API_URL } from "@env";

export async function generarItinerario(
  promptUsuario: string
): Promise<string> {
  try {
    // Convertir la URL a string y validar
    const apiUrl = new URL(OPENAI_API_URL).toString();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que crea itinerarios culturales y sociales para personas. Genera una lista clara con horas, tipo de evento y emojis si es posible. Usa un lenguaje informal y directo.",
          },
          {
            role: "user",
            content: promptUsuario,
          },
        ],
      }),
    });

    // Manejo de errores por código de estado
    if (response.status === 429) {
      return "🚫 Has hecho demasiadas solicitudes. Por favor espera un momento antes de intentarlo nuevamente.";
    }

    if (!response.ok) {
      console.error("Error en la respuesta:", await response.text());
      return "⚠️ No se pudo generar el itinerario. Intenta más tarde.";
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("Respuesta inesperada:", data);
      return "Lo siento, no pude generar el itinerario.";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Ocurrió un error al generar el itinerario.";
  }
}
