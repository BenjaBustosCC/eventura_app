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
  lugar_evento: string;
  latitud: number;
  longitud: number;
  id_usuario: number | string;
  id_tipo_evento: number | string;
  imagen: string | null;
}) {
  const payload = {
    ...evento,
    id_usuario: Number(evento.id_usuario),
    id_tipo_evento: Number(evento.id_tipo_evento),
  };
  const response = await fetch(`${API_URL}/eventos/eventos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al crear evento');
  return response.json();
}

export async function fetchEventosByUserId(userId: number | string) {
  const response = await fetch(`${API_URL}/eventos/eventos/usuario/${userId}`);
  if (!response.ok) throw new Error('Error al obtener los eventos del usuario');
  return response.json();
}

export async function deleteEvento(id: number | string) {
  const response = await fetch(`${API_URL}/eventos/eventos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar el evento');
  return true;
}

export async function updateEvento(id: number | string, evento: {
  nombre_evento: string;
  descripcion_evento: string;
  fecha_evento: string;
  hora_inicio_evento: string;
  hora_termino_evento: string;
  lugar_evento: string;
  latitud: number;
  longitud: number;
  id_usuario: number | string;
  id_tipo_evento: number | string;
  id_estado?: number | string; // <-- Añadido
  imagen: string | null;
}) {
  const payload = {
    ...evento,
    id_usuario: Number(evento.id_usuario),
    id_tipo_evento: Number(evento.id_tipo_evento),
    ...(evento.id_estado !== undefined && { id_estado: Number(evento.id_estado) }), // <-- Añadido
  };
  const response = await fetch(`${API_URL}/eventos/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar evento: ${errorText}`);
  }
  return response.json();
}

export async function updateEstadoEvento(id: number | string, id_estado: number) {
  const response = await fetch(`${API_URL}/eventos/eventos/${id}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_estado }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar estado: ${errorText}`);
  }
  return response.json();
}