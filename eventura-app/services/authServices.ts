export const authService = {
    login: async (email: string, password: string) => {
      try {
        const response = await fetch("http://192.168.1.98:3001/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al iniciar sesión");
        }
  
        const data = await response.json();
        return data; // Devuelve el token y los datos del usuario
      } catch (error) {
        console.error("Error en el servicio de autenticación:", error);
        throw error;
      }
    },
  };