import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mealsApi } from '../api/meals';
import { foodsApi } from '../api/foods';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose }) => {
  console.log('AddMealModal rendered, isOpen:', isOpen);
  
  const [meal, setMeal] = useState('');
  const [grams, setGrams] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const createMealMutation = useMutation({
    mutationFn: async () => {
      // First, create or find the food item
      const foodData = {
        name: meal,
        serving_size: parseFloat(grams) || 100,
        serving_unit: 'g',
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        fat: parseFloat(fat) || 0,
        carbohydrates: parseFloat(carbs) || 0,
      };

      // Create the food item
      const food = await foodsApi.create(foodData);

      // Create the meal with the food item
      const mealData = {
        name: meal,
        meal_type: 'custom',
        date: date,
        meal_items: [
          {
            food_id: food.id,
            quantity: 1,
            unit: 'serving',
          },
        ],
      };
  
      return mealsApi.create(mealData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Failed to add meal');
    },
  });

  const resetForm = () => {
    setMeal('');
    setGrams('');
    setCalories('');
    setProtein('');
    setFat('');
    setCarbs('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!meal) {
      setError('Meal name is required');
      return;
    }

    createMealMutation.mutate();
  };

  if (!isOpen) {
    console.log('Modal not rendering because isOpen is false');
    return null;
  }

  console.log('Modal is rendering the content');
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" style={{ position: 'relative', zIndex: 10000 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Meal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="meal" className="block text-sm font-medium text-gray-700">
              Meal *
            </label>
            <input
              type="text"
              id="meal"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="e.g., Chicken breast with rice"
              required
            />
          </div>

          <div>
            <label htmlFor="grams" className="block text-sm font-medium text-gray-700">
              Grams
            </label>
            <input
              type="number"
              id="grams"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="100"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="250"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
              Protein (grams)
            </label>
            <input
              type="number"
              id="protein"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="30"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
              Fat (grams)
            </label>
            <input
              type="number"
              id="fat"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="10"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
              Carbs (grams)
            </label>
            <input
              type="number"
              id="carbs"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="35"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMealMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {createMealMutation.isPending ? 'Adding...' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};