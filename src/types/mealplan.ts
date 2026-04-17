import { MealSummary } from './meal';

// Days of the week for the meal plan
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// A single day's meal assignment
export interface DayMeal {
  day: DayOfWeek;
  meal: MealSummary | null;
}

// The full weekly meal plan stored in AsyncStorage
export type MealPlan = Record<DayOfWeek, MealSummary | null>;

// Shopping list item (derived from meal plan ingredients)
export interface ShoppingItem {
  name: string;
  measure: string;
  checked: boolean;
}
