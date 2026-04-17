// Shared design tokens — every screen imports from here
// so the app looks consistent across four developers

export const COLORS = {
  primary: '#E85D2C',      // Warm orange — food-friendly
  primaryLight: '#FFF0EB',  // Light orange tint for backgrounds
  secondary: '#2C8E5D',     // Green for "saved" / "added" states
  secondaryLight: '#E8F5EE',
  background: '#F8F8F8',    // Light grey page background
  surface: '#FFFFFF',       // Card/container background
  text: '#1A1A1A',          // Primary text
  textSecondary: '#666666', // Muted text
  textLight: '#999999',     // Placeholder / hint text
  border: '#E0E0E0',       // Card borders, dividers
  error: '#D32F2F',         // Error states
  white: '#FFFFFF',
};

export const FONTS = {
  regular: 16,
  small: 14,
  tiny: 12,
  large: 18,
  title: 22,
  header: 26,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
};
