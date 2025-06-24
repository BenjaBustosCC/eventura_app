import { API_URL } from "@env";
import { OPENAI_API_KEY } from "@env";

export async function generarItinerario(promptUsuario: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ prompt: promptUsuario }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del backend:", errorText);
      return "No se pudo generar el itinerario. Intenta más tarde.";
    }

    const data = await response.json();
    return data.resultado || "No se recibió una respuesta válida.";
  } catch (error) {
    console.error("Error en la petición:", error);
    console.log("Detalles del error:", error);
    return "Ocurrió un error al generar el itinerario.";
  }
}
