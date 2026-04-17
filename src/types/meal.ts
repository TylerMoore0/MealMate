// Matches the shape returned by TheMealDB API
export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  // TheMealDB returns ingredients as strIngredient1..strIngredient20
  // and measures as strMeasure1..strMeasure20
  // We parse these into the Ingredient[] array below
  [key: string]: string;
}

// Cleaned-up ingredient after parsing the raw meal data
export interface Ingredient {
  name: string;
  measure: string;
}

// Category from /categories.php
export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

// Meal summary from /filter.php (less data than full Meal)
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}
