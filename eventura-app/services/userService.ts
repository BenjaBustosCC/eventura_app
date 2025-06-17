import { API_URL } from '@env';

export type User = {
  id: number;
  nombre_usuario: string;
  id_rol: number;
};

export const userService = {
    registerUser: async (user: {
        name: string;
        email: string;
        password: string;
    }) => {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Lee la respuesta como texto
        throw new Error(`Error del servidor: ${errorText}`);
      }
  
      try {
        return await response.json(); // Intenta analizar la respuesta como JSON
      } catch (error) {
        throw new Error("La respuesta del servidor no es JSON válido.");
      }
    },
    
    etAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    return await response.json();
  },

  updateUserRole: async (userId: number, newRole: number): Promise<any> => {
    const response = await fetch(`${API_URL}/usuarios/${userId}/rol`, {
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