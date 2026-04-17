import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../styles/constants';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ emoji = '📭', title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
