import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../styles/constants';

interface IngredientCheckboxProps {
  name: string;
  measure: string;
  checked: boolean;
  onToggle: () => void;
}

export default function IngredientCheckbox({
  name,
  measure,
  checked,
  onToggle,
}: IngredientCheckboxProps) {
  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.name, checked && styles.strikethrough]}>
        {name}
      </Text>
      {measure ? (
        <Text style={[styles.measure, checked && styles.strikethrough]}>
          {measure}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checkboxChecked: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.text,
  },
  measure: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
});
