import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MealSummary } from '../types/meal';
import { COLORS, FONTS, SPACING, RADIUS } from '../styles/constants';

interface MealCardProps {
  meal: MealSummary;
}

export default function MealCard({ meal }: MealCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/meal/${meal.idMeal}`);
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {meal.strMeal}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONTS.regular,
    fontWeight: '600',
    color: COLORS.text,
  },
});
