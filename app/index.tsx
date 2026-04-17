import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCategories, getRandomMeal } from '../src/services/api';
import { loadSearchHistory } from '../src/utils/storage';
import { useMealPlan } from '../src/context/MealPlanContext';
import { Category, Meal } from '../src/types/meal';
import { DAYS } from '../src/types/mealplan';
import LoadingSpinner from '../src/components/LoadingSpinner';
import ErrorDisplay from '../src/components/ErrorDisplay';
import CategoryCard from '../src/components/CategoryCard';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/styles/constants';

export default function HomeScreen() {
  const router = useRouter();
  const { plan } = useMealPlan();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMeal, setFeaturedMeal] = useState<Meal | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const plannedCount = DAYS.filter((d) => plan[d] !== null).length;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, random, history] = await Promise.all([
        getCategories(),
        getRandomMeal(),
        loadSearchHistory(),
      ]);
      setCategories(cats);
      setFeaturedMeal(random);
      setRecentSearches(history);
    } catch (err) {
      setError('Could not load data. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh search history when screen regains focus
  useEffect(() => {
    loadSearchHistory().then(setRecentSearches);
  }, []);

  if (loading) return <LoadingSpinner message="Loading MealMate..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} />;

  return (
    <ScrollView style={styles.screen}>
      {/* Featured Meal */}
      {featuredMeal && (
        <Pressable
          style={styles.featuredCard}
          onPress={() => router.push(`/meal/${featuredMeal.idMeal}`)}
        >
          <Image
            source={{ uri: featuredMeal.strMealThumb }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredLabel}>Today's Pick</Text>
            <Text style={styles.featuredName}>{featuredMeal.strMeal}</Text>
            <Text style={styles.featuredCategory}>
              {featuredMeal.strCategory} · {featuredMeal.strArea}
            </Text>
          </View>
        </Pressable>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.actionEmoji}>🔍</Text>
          <Text style={styles.actionText}>Search</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/mealplan')}
        >
          <Text style={styles.actionEmoji}>📋</Text>
          <Text style={styles.actionText}>
            Meal Plan {plannedCount > 0 ? `(${plannedCount}/7)` : ''}
          </Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/mealplan/shopping')}
        >
          <Text style={styles.actionEmoji}>🛒</Text>
          <Text style={styles.actionText}>Shopping</Text>
        </Pressable>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Browse by Category</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.idCategory}
        renderItem={({ item }) => <CategoryCard category={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.chipContainer}>
            {recentSearches.slice(0, 5).map((term) => (
              <Pressable
                key={term}
                style={styles.chip}
                onPress={() =>
                  router.push({ pathname: '/search', params: { q: term } })
                }
              >
                <Text style={styles.chipText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Bottom spacer */}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  featuredCard: {
    margin: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredOverlay: {
    padding: SPACING.lg,
  },
  featuredLabel: {
    fontSize: FONTS.tiny,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  featuredName: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featuredCategory: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flex: 1,
    marginHorizontal: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionEmoji: {
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: FONTS.tiny,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  categoryList: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  recentSection: {
    marginTop: SPACING.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  chipText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
