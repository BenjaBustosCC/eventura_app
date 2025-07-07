import { API_URL } from '@env';

export interface SolicitudGestor {
  id?: number;
  usuario_id: number;
  instagram_link: string;
  youtube_link: string;
  descripcion: string;
  id_estado: number;
  nombre_estado?: string;
}

export const artistService = {
  // Crear nueva solicitud
  createSolicitud: async (solicitud: Omit<SolicitudGestor, "id" | "nombre_estado">) => {
    const response = await fetch(`${API_URL}/artist/solicitudes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud),
    });
    if (!response.ok) throw new Error("No se pudo crear la solicitud");
    return await response.json();
  },

  // Obtener todas las solicitudes
  getAllSolicitudes: async (): Promise<SolicitudGestor[]> => {
    const response = await fetch(`${API_URL}/artist/solicitudes`);
    if (!response.ok) throw new Error("No se pudieron obtener las solicitudes");
    return await response.json();
  },

  // Obtener una solicitud por ID
  getSolicitudById: async (id: number): Promise<SolicitudGestor> => {
    const response = await fetch(`${API_URL}/artist/solicitudes/${id}`);
    if (!response.ok) throw new Error("No se pudo obtener la solicitud");
    return await response.json();
  },

  // Actualizar estado de una solicitud
  updateEstadoSolicitud: async (id: number, id_estado: number) => {
    const response = await fetch(`${API_URL}/artist/solicitudes/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_estado }),
    });
    if (!response.ok) throw new Error("No se pudo actualizar el estado");
    return await response.json();
  },

  // Eliminar una solicitud
  deleteSolicitud: async (id: number) => {
    const response = await fetch(`${API_URL}/artist/solicitudes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("No se pudo eliminar la solicitud");
    return await response.json();
  },

  updateUserRole: async (userId: number, newRole: number): Promise<any> => {
    const response = await fetch(`${API_URL}/users/usuarios/${userId}/rol`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_rol: newRole }),
    });
    if (!response.ok) {
      throw new Error("No se pudo actualizar el rol");
    }
    return await response.json();
  },
};
