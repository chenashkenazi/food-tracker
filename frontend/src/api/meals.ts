import client from './client';
import type { Meal, DailyNutritionSummary } from '../types';

export const mealsApi = {
  getAll: async (params?: {
    start_date?: string;
    end_date?: string;
    meal_type?: string;
  }): Promise<Meal[]> => {
    const response = await client.get('/meals', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Meal> => {
    const response = await client.get(`/meals/${id}`);
    return response.data;
  },

  getDailySummary: async (date: string): Promise<DailyNutritionSummary> => {
    const response = await client.get(`/meals/daily-summary/${date}`);
    return response.data;
  },

  create: async (meal: {
    name: string;
    meal_type: string;
    date: string;
    notes?: string;
    meal_items: Array<{
      food_id: number;
      quantity: number;
      unit: string;
    }>;
  }): Promise<Meal> => {
    const response = await client.post('/meals', meal);
    return response.data;
  },

  update: async (id: number, meal: {
    name: string;
    meal_type: string;
    date: string;
    notes?: string;
    meal_items: Array<{
      food_id: number;
      quantity: number;
      unit: string;
    }>;
  }): Promise<Meal> => {
    const response = await client.put(`/meals/${id}`, meal);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/meals/${id}`);
  },
};