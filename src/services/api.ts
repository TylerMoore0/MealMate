import { Meal, Category, MealSummary } from '../types/meal';
import { Ingredient } from '../types/meal';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Centralized fetch wrapper — handles errors in one place
async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// GET /categories.php — list all categories
export async function getCategories(): Promise<Category[]> {
  const data = await fetchJson<{ categories: Category[] }>('/categories.php');
  return data.categories ?? [];
}

// GET /filter.php?c=Seafood — meals in a category
export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
  const data = await fetchJson<{ meals: MealSummary[] | null }>(`/filter.php?c=${category}`);
  return data.meals ?? [];
}

// GET /search.php?s=chicken — search by name
export async function searchMeals(query: string): Promise<MealSummary[]> {
  const data = await fetchJson<{ meals: MealSummary[] | null }>(`/search.php?s=${query}`);
  return data.meals ?? [];
}

// GET /lookup.php?i=52772 — full meal detail by ID
export async function getMealById(id: string): Promise<Meal | null> {
  const data = await fetchJson<{ meals: Meal[] | null }>(`/lookup.php?i=${id}`);
  return data.meals?.[0] ?? null;
}

// GET /random.php — one random meal
export async function getRandomMeal(): Promise<Meal | null> {
  const data = await fetchJson<{ meals: Meal[] | null }>('/random.php');
  return data.meals?.[0] ?? null;
}

// Parse strIngredient1..20 and strMeasure1..20 into a clean array
export function parseIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (name && name !== '') {
      ingredients.push({ name, measure: measure ?? '' });
    }
  }
  return ingredients;
}
