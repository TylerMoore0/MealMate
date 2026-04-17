import { Stack } from 'expo-router';
import { MealPlanProvider } from '../src/context/MealPlanContext';
import { COLORS } from '../src/styles/constants';

export default function RootLayout() {
  return (
    // MealPlanProvider wraps the whole app so every screen
    // can access the meal plan via useMealPlan()
    <MealPlanProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'MealMate' }} />
        <Stack.Screen name="categories" options={{ title: 'Categories' }} />
        <Stack.Screen name="search" options={{ title: 'Search Meals' }} />
        <Stack.Screen name="meal/[id]" options={{ title: 'Meal Detail' }} />
        <Stack.Screen name="mealplan/index" options={{ title: 'My Meal Plan' }} />
        <Stack.Screen name="mealplan/shopping" options={{ title: 'Shopping List' }} />
      </Stack>
    </MealPlanProvider>
  );
}
