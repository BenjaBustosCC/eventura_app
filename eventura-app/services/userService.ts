import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const response = await fetch(`${API_URL}/users/usuarios`, {
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
    
    getAllUsers: async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users/usuarios`);
  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }

  const data = await response.json();

  // Mapea los campos a los nombres esperados si vienen en mayúsculas
  const mapped = data.map((user: any) => ({
    id: user.ID_USUARIO ?? user.id,
    nombre_usuario: user.NOMBRE_USUARIO ?? user.nombre_usuario,
    id_rol: user.ID_ROL ?? user.id_rol ?? 0,
  }));

  // Filtra usuarios válidos
  const validUsers: User[] = mapped.filter(
    (user: any) =>
      typeof user.id === "number" &&
      typeof user.nombre_usuario === "string" &&
      typeof user.id_rol === "number"
  );

  return validUsers;
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
  