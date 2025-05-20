import { API_URL } from '@env';

export async function fetchEventos() {
  const response = await fetch(`${API_URL}/eventos/eventos`);
  if (!response.ok) throw new Error('Error al obtener eventos');
  return response.json();
}