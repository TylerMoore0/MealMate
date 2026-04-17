import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getMealById, parseIngredients } from '../../src/services/api';
import { useMealPlan } from '../../src/context/MealPlanContext';
import { Meal, Ingredient } from '../../src/types/meal';
import { DAYS, DayOfWeek } from '../../src/types/mealplan';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import ErrorDisplay from '../../src/components/ErrorDisplay';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/styles/constants';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { plan, addMeal } = useMealPlan();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeal = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMealById(id);
      if (data) {
        setMeal(data);
        setIngredients(parseIngredients(data));
        navigation.setOptions({ title: data.strMeal });
      } else {
        setError('Meal not found.');
      }
    } catch (err) {
      setError('Could not load meal details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, [id]);

  const handleAddToPlan = () => {
    if (!meal) return;

    // Find available days (days with no meal assigned)
    const available = DAYS.filter((d) => plan[d] === null);
    // Find days that already have this meal
    const alreadyPlanned = DAYS.filter(
      (d) => plan[d]?.idMeal === meal.idMeal
    );

    if (alreadyPlanned.length > 0 && available.length === 0) {
      Alert.alert('Already Planned', 'This meal is already in your plan and all days are full.');
      return;
    }

    // Show day picker
    const options = DAYS.map((day) => {
      const current = plan[day];
      if (current?.idMeal === meal.idMeal) return `${day} ✓ (already set)`;
      if (current) return `${day} (replace ${current.strMeal})`;
      return day;
    });

    Alert.alert(
      'Add to Meal Plan',
      'Which day?',
      [
        ...DAYS.map((day, index) => ({
          text: options[index],
          onPress: () => {
            addMeal(day, {
              idMeal: meal.idMeal,
              strMeal: meal.strMeal,
              strMealThumb: meal.strMealThumb,
            });
            Alert.alert('Added!', `${meal.strMeal} added to ${day}.`);
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
  };

  if (loading) return <LoadingSpinner message="Loading meal..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchMeal} />;
  if (!meal) return <ErrorDisplay message="Meal not found." />;

  return (
    <ScrollView style={styles.screen}>
      {/* Hero image */}
      <Image source={{ uri: meal.strMealThumb }} style={styles.heroImage} />

      {/* Meal info */}
      <View style={styles.infoCard}>
        <Text style={styles.mealName}>{meal.strMeal}</Text>
        <View style={styles.tagRow}>
          {meal.strCategory ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{meal.strCategory}</Text>
            </View>
          ) : null}
          {meal.strArea ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{meal.strArea}</Text>
            </View>
          ) : null}
        </View>

        {/* Add to Plan button */}
        <Pressable style={styles.addButton} onPress={handleAddToPlan}>
          <Text style={styles.addButtonText}>+ Add to Meal Plan</Text>
        </Pressable>
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Ingredients ({ingredients.length})
        </Text>
        {ingredients.map((ing, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.ingredientBullet}>•</Text>
            <Text style={styles.ingredientMeasure}>{ing.measure}</Text>
            <Text style={styles.ingredientName}>{ing.name}</Text>
          </View>
        ))}
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>{meal.strInstructions}</Text>
      </View>

      {/* YouTube link */}
      {meal.strYoutube ? (
        <View style={styles.section}>
          <Text style={styles.youtubeLabel}>
            Video tutorial available on YouTube
          </Text>
        </View>
      ) : null}

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xxl,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  mealName: {
    fontSize: FONTS.header,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  tagRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tag: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  tagText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  ingredientBullet: {
    fontSize: FONTS.regular,
    color: COLORS.primary,
    marginRight: SPACING.sm,
    width: 14,
  },
  ingredientMeasure: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    width: 80,
  },
  ingredientName: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.text,
  },
  instructions: {
    fontSize: FONTS.regular,
    color: COLORS.text,
    lineHeight: 24,
  },
  youtubeLabel: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
