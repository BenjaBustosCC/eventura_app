import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';



interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de autenticación: ${errorText}`);
    }

    const data = await response.json();
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    
    return data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  },

  getCurrentUser: async () => {
    const userDataString = await AsyncStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('userToken');
  },

  verifyToken: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/users/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Helper method for authenticated requests
  authorizedRequest: async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = await AsyncStorage.getItem('userToken');
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
};