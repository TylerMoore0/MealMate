import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MealPlan, DayOfWeek, DAYS } from '../types/mealplan';
import { MealSummary } from '../types/meal';
import { loadMealPlan, saveMealPlan, clearMealPlan } from '../utils/storage';

interface MealPlanContextType {
  plan: MealPlan;
  loading: boolean;
  addMeal: (day: DayOfWeek, meal: MealSummary) => void;
  removeMeal: (day: DayOfWeek) => void;
  resetPlan: () => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<MealPlan>(() => {
    const empty = {} as MealPlan;
    for (const day of DAYS) empty[day] = null;
    return empty;
  });
  const [loading, setLoading] = useState(true);

  // Load saved plan on mount
  useEffect(() => {
    loadMealPlan()
      .then((saved) => setPlan(saved))
      .catch((err) => console.error('Failed to load meal plan:', err))
      .finally(() => setLoading(false));
  }, []);

  // Persist whenever plan changes (skip the initial load)
  useEffect(() => {
    if (!loading) {
      saveMealPlan(plan).catch((err) =>
        console.error('Failed to save meal plan:', err)
      );
    }
  }, [plan]);

  const addMeal = (day: DayOfWeek, meal: MealSummary) => {
    setPlan((prev) => ({ ...prev, [day]: meal }));
  };

  const removeMeal = (day: DayOfWeek) => {
    setPlan((prev) => ({ ...prev, [day]: null }));
  };

  const resetPlan = () => {
    const empty = {} as MealPlan;
    for (const day of DAYS) empty[day] = null;
    setPlan(empty);
    clearMealPlan();
  };

  return (
    <MealPlanContext.Provider value={{ plan, loading, addMeal, removeMeal, resetPlan }}>
      {children}
    </MealPlanContext.Provider>
  );
}

// Custom hook — use this in any screen that needs meal plan data
export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
