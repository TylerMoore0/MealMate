import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { searchMeals } from '../src/services/api';
import {
  addToSearchHistory,
  loadSearchHistory,
  clearSearchHistory,
} from '../src/utils/storage';
import { MealSummary } from '../src/types/meal';
import MealCard from '../src/components/MealCard';
import LoadingSpinner from '../src/components/LoadingSpinner';
import ErrorDisplay from '../src/components/ErrorDisplay';
import EmptyState from '../src/components/EmptyState';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/styles/constants';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [query, setQuery] = useState(q ?? '');
  const [results, setResults] = useState<MealSummary[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory().then(setHistory);
  }, []);

  // If navigated here with a query param, search immediately
  useEffect(() => {
    if (q) {
      handleSearch(q);
    }
  }, [q]);

  const handleSearch = async (searchTerm?: string) => {
    const term = (searchTerm ?? query).trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchMeals(term);
      setResults(data);
      // Save to search history
      await addToSearchHistory(term);
      const updated = await loadSearchHistory();
      setHistory(updated);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await clearSearchHistory();
    setHistory([]);
  };

  const handleHistoryTap = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <View style={styles.screen}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search meals by name..."
          placeholderTextColor={COLORS.textLight}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
          autoFocus={!q}
        />
        <Pressable style={styles.searchButton} onPress={() => handleSearch()}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {/* Search history (shown before first search) */}
      {!hasSearched && history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <Pressable onPress={handleClearHistory}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
          {history.map((term) => (
            <Pressable
              key={term}
              style={styles.historyItem}
              onPress={() => handleHistoryTap(term)}
            >
              <Text style={styles.historyItemText}>🕐 {term}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Results */}
      {loading && <LoadingSpinner message="Searching..." />}
      {error && <ErrorDisplay message={error} onRetry={() => handleSearch()} />}
      {!loading && !error && hasSearched && results.length === 0 && (
        <EmptyState
          emoji="🔍"
          title="No results"
          subtitle={`Nothing found for "${query}". Try a different name.`}
        />
      )}
      {!loading && !error && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <MealCard meal={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.regular,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONTS.regular,
  },
  historySection: {
    paddingHorizontal: SPACING.lg,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  historyTitle: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearText: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  historyItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyItemText: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
  },
  list: {
    paddingVertical: SPACING.sm,
  },
});
