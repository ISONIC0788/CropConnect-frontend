import axiosClient from './axiosClient';

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string; // FIXED: Matches your Spring Boot AuthResponseDTO exactly
}

// Data matching your Spring Boot User.java model
export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  passwordHash: string; // Your backend uses this specific field name
  role: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // NEW: Register function pointing to your UserController
  register: async (userData: RegisterData) => {
    const response = await axiosClient.post('/users/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
  }
};