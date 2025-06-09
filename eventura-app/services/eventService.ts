import { API_URL } from '@env';

export async function fetchEventos() {
  const response = await fetch(`${API_URL}/eventos/eventos`);
  if (!response.ok) throw new Error('Error al obtener eventos');
  return response.json();
}

export async function fetchTiposEvento() {
  const response = await fetch(`${API_URL}/tipos-evento/tipos-evento`);
  if (!response.ok) throw new Error('Error al obtener tipos de evento');
  return response.json();
}

export async function createEvento(evento: {
  nombre_evento: string;
  descripcion_evento: string;
  fecha_evento: string;
  hora_inicio_evento: string;
  hora_termino_evento: string;
  lugar_evento: string; // <-- agregado
  id_usuario: number | string;
  id_tipo_evento: number | string;
}) {
  const response = await fetch(`${API_URL}/eventos/eventos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evento),
  });
  if (!response.ok) throw new Error('Error al crear evento');
  return response.json();
}

export async function fetchEventosByUserId(userId: number | string) {
  const response = await fetch(`${API_URL}/eventos/eventos/usuario/${userId}`);
  if (!response.ok) throw new Error('Error al obtener los eventos del usuario');
  return response.json();
}