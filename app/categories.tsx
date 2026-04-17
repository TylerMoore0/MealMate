import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getMealsByCategory } from '../src/services/api';
import { MealSummary } from '../src/types/meal';
import MealCard from '../src/components/MealCard';
import LoadingSpinner from '../src/components/LoadingSpinner';
import ErrorDisplay from '../src/components/ErrorDisplay';
import EmptyState from '../src/components/EmptyState';
import { COLORS, SPACING } from '../src/styles/constants';

export default function CategoriesScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const navigation = useNavigation();

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set the header title to the category name
  useEffect(() => {
    if (category) {
      navigation.setOptions({ title: category });
    }
  }, [category]);

  const fetchMeals = async () => {
    if (!category) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMealsByCategory(category);
      setMeals(data);
    } catch (err) {
      setError(`Could not load ${category} meals.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [category]);

  if (loading) return <LoadingSpinner message={`Loading ${category}...`} />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchMeals} />;
  if (meals.length === 0) {
    return (
      <EmptyState
        emoji="🍽️"
        title="No meals found"
        subtitle={`No meals in the ${category} category.`}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <MealCard meal={item} />}
        contentContainerStyle={styles.list}
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
  list: {
    paddingVertical: SPACING.sm,
  },
});
