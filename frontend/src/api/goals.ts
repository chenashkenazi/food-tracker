import client from './client';
import type { NutritionGoal } from '../types';

export const goalsApi = {
  getAll: async (): Promise<NutritionGoal[]> => {
    const response = await client.get('/goals');
    return response.data;
  },

  getCurrent: async (): Promise<NutritionGoal> => {
    const response = await client.get('/goals/current');
    return response.data;
  },

  create: async (goal: Omit<NutritionGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<NutritionGoal> => {
    const response = await client.post('/goals', goal);
    return response.data;
  },

  update: async (id: number, goal: Omit<NutritionGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<NutritionGoal> => {
    const response = await client.put(`/goals/${id}`, goal);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/goals/${id}`);
  },
};