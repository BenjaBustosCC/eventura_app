export const userService = {
    registerUser: async (user: {
        name: string;
        email: string;
        password: string;
    }) => {
      const response = await fetch("http://192.168.1.87:3001/api/users/register", {
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
  };
  