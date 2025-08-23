import client from './client';
import type { User, LoginCredentials, RegisterData } from '../types';

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await client.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<{ access_token: string; token_type: string }> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await client.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await client.get('/auth/me');
    return response.data;
  },
};