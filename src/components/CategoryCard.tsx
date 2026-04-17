import React from 'react';
import { Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '../types/meal';
import { COLORS, FONTS, SPACING, RADIUS } from '../styles/constants';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/categories',
      params: { category: category.strCategory },
    });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Image
        source={{ uri: category.strCategoryThumb }}
        style={styles.image}
      />
      <Text style={styles.label} numberOfLines={1}>
        {category.strCategory}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    padding: SPACING.sm,
    marginRight: SPACING.md,
    width: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
