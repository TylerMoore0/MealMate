import { Ingredient } from '../types/meal';
import { ShoppingItem } from '../types/mealplan';

// Takes ingredients from multiple meals, combines duplicates,
// and returns a unified shopping list
export function buildShoppingList(allIngredients: Ingredient[]): ShoppingItem[] {
  const map = new Map<string, string[]>();

  for (const ing of allIngredients) {
    const key = ing.name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, []);
    }
    if (ing.measure) {
      map.get(key)!.push(ing.measure);
    }
  }

  const list: ShoppingItem[] = [];
  for (const [name, measures] of map) {
    list.push({
      // Capitalize first letter for display
      name: name.charAt(0).toUpperCase() + name.slice(1),
      measure: measures.join(' + '),
      checked: false,
    });
  }

  // Sort alphabetically
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
