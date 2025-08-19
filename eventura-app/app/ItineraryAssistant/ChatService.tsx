import { API_URL } from "@env";
import { OPENAI_API_KEY } from "@env";

/**
 * Genera un itinerario usando el prompt y el id del usuario autenticado.
 * @param promptUsuario El texto del prompt para la IA.
 * @param id_usuario El id del usuario autenticado.
 */
export async function generarItinerario(promptUsuario: string, id_usuario: number): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ prompt: promptUsuario, id_usuario }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del backend:", errorText);
      return "No se pudo generar el itinerario. Intenta más tarde.";
    }

    const data = await response.json();
    console.log("Respuesta del backend:", data);

    return data.itinerario || "No se recibió una respuesta válida.";
  } catch (error) {
    console.error("Error en la petición:", error);
    return "Ocurrió un error al generar el itinerario.";
  }
}