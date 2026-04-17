import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from './constants';

// Reusable styles shared across screens
// Import what you need: import { commonStyles } from '../styles/commonStyles';

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
  },
  bodyText: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  searchBar: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    fontSize: FONTS.regular,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center' as const,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});
