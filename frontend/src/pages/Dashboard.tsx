import React, { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { mealsApi } from '../api/meals';
import type { DailyNutritionSummary } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus } from 'lucide-react';
import { AddMealModal } from '../components/AddMealModal';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);

  React.useEffect(() => {
    console.log('Modal state changed:', isAddMealModalOpen);
  }, [isAddMealModalOpen]);

  const { data: summary, isLoading } = useQuery<DailyNutritionSummary>({
    queryKey: ['daily-summary', selectedDate],
    queryFn: () => mealsApi.getDailySummary(selectedDate),
  });

  const { data: meals } = useQuery({
    queryKey: ['meals', selectedDate],
    queryFn: () => mealsApi.getAll({ start_date: selectedDate, end_date: selectedDate }),
  });

  const macroData = summary ? [
    { name: 'Protein', value: summary.total_protein * 4, color: '#3B82F6' },
    { name: 'Carbs', value: summary.total_carbohydrates * 4, color: '#10B981' },
    { name: 'Fat', value: summary.total_fat * 9, color: '#F59E0B' },
  ] : [];

  const getPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Food Tracker</h1>
        <div className={styles.headerControls}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.dateInput}
          />
          <button
            onClick={() => {
              console.log('Button clicked, setting modal to open');
              setIsAddMealModalOpen(true);
            }}
            className={styles.addButton}
            title="Add Meal"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : summary && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Calories</div>
              <div className={styles.statValue}>
                {Math.round(summary.total_calories)}
              </div>
              {summary.goal && (
                <div className={styles.statProgress}>
                  <div className={styles.statProgressText}>
                    {getPercentage(summary.total_calories, summary.goal.daily_calories)}% of goal
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.progressFillCalories}`}
                      style={{ width: `${getPercentage(summary.total_calories, summary.goal.daily_calories)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>Protein</div>
              <div className={styles.statValue}>
                {Math.round(summary.total_protein)}g
              </div>
              {summary.goal && (
                <div className={styles.statProgress}>
                  <div className={styles.statProgressText}>
                    {getPercentage(summary.total_protein, summary.goal.daily_protein)}% of goal
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.progressFillProtein}`}
                      style={{ width: `${getPercentage(summary.total_protein, summary.goal.daily_protein)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>Carbohydrates</div>
              <div className={styles.statValue}>
                {Math.round(summary.total_carbohydrates)}g
              </div>
              {summary.goal && (
                <div className={styles.statProgress}>
                  <div className={styles.statProgressText}>
                    {getPercentage(summary.total_carbohydrates, summary.goal.daily_carbohydrates)}% of goal
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.progressFillCarbs}`}
                      style={{ width: `${getPercentage(summary.total_carbohydrates, summary.goal.daily_carbohydrates)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.statCard}>
              <div className={styles.statLabel}>Fat</div>
              <div className={styles.statValue}>
                {Math.round(summary.total_fat)}g
              </div>
              {summary.goal && (
                <div className={styles.statProgress}>
                  <div className={styles.statProgressText}>
                    {getPercentage(summary.total_fat, summary.goal.daily_fat)}% of goal
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.progressFillFat}`}
                      style={{ width: `${getPercentage(summary.total_fat, summary.goal.daily_fat)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Macro Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Today's Meals</div>
              <div className={styles.mealsList}>
                {meals && meals.length > 0 ? (
                  meals.map((meal) => (
                    <div key={meal.id} className={styles.mealItem}>
                      <h3 className={styles.mealName}>{meal.name}</h3>
                      <p className={styles.mealType}>{meal.meal_type}</p>
                      <p className={styles.mealItems}>
                        {meal.meal_items.length} items
                      </p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noMeals}>No meals logged for today</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <AddMealModal 
        isOpen={isAddMealModalOpen} 
        onClose={() => setIsAddMealModalOpen(false)} 
      />
    </div>
  );
};