import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useMealPlan } from '../../src/context/MealPlanContext';
import { getMealById, parseIngredients } from '../../src/services/api';
import { buildShoppingList } from '../../src/utils/shoppingList';
import { DAYS } from '../../src/types/mealplan';
import { Ingredient } from '../../src/types/meal';
import { ShoppingItem } from '../../src/types/mealplan';
import IngredientCheckbox from '../../src/components/IngredientCheckbox';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import ErrorDisplay from '../../src/components/ErrorDisplay';
import EmptyState from '../../src/components/EmptyState';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/styles/constants';

export default function ShoppingListScreen() {
  const { plan } = useMealPlan();

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkedCount = items.filter((i) => i.checked).length;

  const fetchIngredients = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all planned meal IDs (skip empty days, remove duplicates)
      const mealIds = [
        ...new Set(
          DAYS.map((d) => plan[d]?.idMeal).filter(Boolean) as string[]
        ),
      ];

      if (mealIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Fetch full details for each meal to get ingredients
      const allIngredients: Ingredient[] = [];
      for (const mealId of mealIds) {
        const meal = await getMealById(mealId);
        if (meal) {
          allIngredients.push(...parseIngredients(meal));
        }
      }

      // Build unified shopping list with duplicates combined
      const list = buildShoppingList(allIngredients);
      setItems(list);
    } catch (err) {
      setError('Could not build shopping list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [plan]);

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const uncheckAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  if (loading) return <LoadingSpinner message="Building shopping list..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchIngredients} />;
  if (items.length === 0) {
    return (
      <EmptyState
        emoji="🛒"
        title="No items yet"
        subtitle="Add meals to your plan first, then come back here."
      />
    );
  }

  return (
    <View style={styles.screen}>
      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {checkedCount}/{items.length} items checked
        </Text>
        {checkedCount > 0 && (
          <Pressable onPress={uncheckAll}>
            <Text style={styles.uncheckText}>Uncheck all</Text>
          </Pressable>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(checkedCount / items.length) * 100}%` },
          ]}
        />
      </View>

      {/* Shopping items */}
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <IngredientCheckbox
            name={item.name}
            measure={item.measure}
            checked={item.checked}
            onToggle={() => toggleItem(index)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  summaryText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
  },
  uncheckText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: 4,
    backgroundColor: COLORS.secondary,
  },
});
