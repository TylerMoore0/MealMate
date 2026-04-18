import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMealPlan } from '../../src/context/MealPlanContext';
import { DAYS } from '../../src/types/mealplan';
import EmptyState from '../../src/components/EmptyState';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/styles/constants';

export default function MealPlanScreen() {
  const router = useRouter();
  const { plan, removeMeal, resetPlan } = useMealPlan();

  const plannedCount = DAYS.filter((d) => plan[d] !== null).length;

  const handleRemove = (day: string) => {
    const meal = plan[day as keyof typeof plan];
    if (!meal) return;

    Alert.alert(
      'Remove Meal',
      `Remove ${meal.strMeal} from ${day}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeMeal(day as any),
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Meal Plan',
      'This will remove all meals from your plan. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetPlan },
      ]
    );
  };

  return (
    <ScrollView style={styles.screen}>
      {/* Header summary */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {plannedCount}/7 days planned
        </Text>
        <View style={styles.headerButtons}>
          {plannedCount > 0 && (
            <>
              <Pressable
                style={styles.shoppingButton}
                onPress={() => router.push('/mealplan/shopping')}
              >
                <Text style={styles.shoppingButtonText}>🛒 Shopping List</Text>
              </Pressable>
              <Pressable style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Day cards */}
      {DAYS.map((day) => {
        const meal = plan[day];

        return (
          <View key={day} style={styles.dayCard}>
            <Text style={styles.dayLabel}>{day}</Text>

            {meal ? (
              <View style={styles.mealRow}>
                <Pressable
                  style={styles.mealInfo}
                  onPress={() => router.push(`/meal/${meal.idMeal}`)}
                >
                  <Image
                    source={{ uri: meal.strMealThumb }}
                    style={styles.mealThumb}
                  />
                  <Text style={styles.mealName} numberOfLines={1}>
                    {meal.strMeal}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemove(day)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.emptySlot}
                onPress={() => router.push('/search')}
              >
                <Text style={styles.emptyText}>+ Add a meal</Text>
              </Pressable>
            )}
          </View>
        );
      })}

      {plannedCount === 0 && (
        <EmptyState
          emoji="🗓️"
          title="No meals planned yet"
          subtitle="Search for meals and add them to your weekly plan."
        />
      )}

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  shoppingButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  shoppingButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONTS.small,
  },
  resetButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  resetButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: FONTS.small,
  },
  dayCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dayLabel: {
    fontSize: FONTS.small,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealThumb: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.md,
  },
  mealName: {
    flex: 1,
    fontSize: FONTS.regular,
    fontWeight: '500',
    color: COLORS.text,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  removeText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  emptySlot: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.regular,
    color: COLORS.textLight,
  },
});
