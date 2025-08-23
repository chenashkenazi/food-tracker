export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface Food {
  id: number;
  name: string;
  brand?: string;
  barcode?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  creator_id?: number;
  created_at: string;
}

export interface MealItem {
  id: number;
  food_id: number;
  quantity: number;
  unit: string;
  food: Food;
}

export interface Meal {
  id: number;
  user_id: number;
  name: string;
  meal_type: string;
  date: string;
  notes?: string;
  meal_items: MealItem[];
  created_at: string;
}

export interface NutritionGoal {
  id: number;
  user_id: number;
  daily_calories: number;
  daily_protein: number;
  daily_carbohydrates: number;
  daily_fat: number;
  daily_fiber?: number;
  daily_sugar?: number;
  daily_sodium?: number;
  created_at: string;
  updated_at: string;
}

export interface DailyNutritionSummary {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbohydrates: number;
  total_fat: number;
  total_fiber?: number;
  total_sugar?: number;
  total_sodium?: number;
  goal?: NutritionGoal;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}