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
      <Stack>
        {/* 1. Conditionally render (app) or (auth) */}
        {user ? (
          // If the user IS logged in, show the main app group
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        ) : (
          // If the user is NOT logged in, show the authentication group
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}

        {/* 2. Keep the modal as a shared screen outside the main groups */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

        {/* 3. Catch-all for 404/Unknown routes */}
        <Stack.Screen name="+not-found" />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// ⚠️ You'll also need a separate layout for the (app) group
// to redirect unauthenticated access, though the above logic handles it.
// e.g., app/(app)/_layout.tsx:
/*
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function AppLayout() {
  const { user } = useAuth();

  // If the user is not logged in, redirect them to the login screen
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Render the inner app stack (where the tabs are defined)
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
*/