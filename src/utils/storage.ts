import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealPlan, DAYS } from '../types/mealplan';

const MEAL_PLAN_KEY = '@mealplanner_plan';
const SEARCH_HISTORY_KEY = '@mealplanner_search_history';

// --- Meal Plan storage ---

// Returns an empty plan if nothing saved yet
export async function loadMealPlan(): Promise<MealPlan> {
  const json = await AsyncStorage.getItem(MEAL_PLAN_KEY);
  if (json) {
    return JSON.parse(json);
  }
  // Default: every day is null (no meal assigned)
  const empty: MealPlan = {} as MealPlan;
  for (const day of DAYS) {
    empty[day] = null;
  }
  return empty;
}

export async function saveMealPlan(plan: MealPlan): Promise<void> {
  await AsyncStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
}

export async function clearMealPlan(): Promise<void> {
  await AsyncStorage.removeItem(MEAL_PLAN_KEY);
}

// --- Search history storage ---

const MAX_HISTORY = 10;

export async function loadSearchHistory(): Promise<string[]> {
  const json = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addToSearchHistory(query: string): Promise<void> {
  const history = await loadSearchHistory();
  // Remove if already exists, then add to front
  const filtered = history.filter((item) => item !== query);
  filtered.unshift(query);
  // Keep only the last MAX_HISTORY items
  await AsyncStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(filtered.slice(0, MAX_HISTORY))
  );
}

export async function clearSearchHistory(): Promise<void> {
  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
}
