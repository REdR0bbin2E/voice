import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// ⚠️ Note: The unstable_settings is typically not needed here if your structure is clean.
// I'll leave it out for a cleaner, standard implementation.

// --- PLACEHOLDER AUTH HOOK ---
// Replace this with your actual authentication context hook
function useAuth() {
  // ⚠️ In a real app, this would check AsyncStorage, Redux, or a Context provider.
  // For demonstration, let's assume the user is NOT logged in initially.
  const user = { id: 123 }; // Replace with null if user is not logged in

  // You need a way to track if the login check is finished (e.g., loading state)
  const isLoading = false;

  return { user, isLoading };
}
// -----------------------------


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();

  // You might want a full screen splash/loader while checking auth
  if (isLoading) {
    return null; // Or return a custom loading screen component
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main tab navigation (accessible when logged in) */}
        <Stack.Screen name="(tabs)" />
        
        {/* Auth screens (login/signup) */}
        <Stack.Screen name="(auth)" />
        
        {/* Chat screen */}
        <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
        
        {/* Modal screen */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
        
        {/* Root index (redirect screen) */}
        <Stack.Screen name="index" />
        
        {/* 404 screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}