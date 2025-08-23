import client from './client';
import type { Food } from '../types';

export const foodsApi = {
  getAll: async (search?: string, barcode?: string): Promise<Food[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (barcode) params.append('barcode', barcode);
    
    const response = await client.get('/foods', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Food> => {
    const response = await client.get(`/foods/${id}`);
    return response.data;
  },

  create: async (food: Omit<Food, 'id' | 'creator_id' | 'created_at'>): Promise<Food> => {
    const response = await client.post('/foods', food);
    return response.data;
  },

  update: async (id: number, food: Omit<Food, 'id' | 'creator_id' | 'created_at'>): Promise<Food> => {
    const response = await client.put(`/foods/${id}`, food);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/foods/${id}`);
  },
};