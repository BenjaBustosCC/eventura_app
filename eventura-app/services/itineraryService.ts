import { API_URL } from "@env";

export const itineraryService = {
  getItinerariosByUsuario: async (id_usuario: number) => {
    const response = await fetch(`${API_URL}/itinerary/${id_usuario}`);
    if (!response.ok) throw new Error("No se pudieron obtener los itinerarios");
    return await response.json();
  },
};