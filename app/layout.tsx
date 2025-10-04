import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';

const tamaguiConfig = createTamagui(defaultConfig);

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <TamaguiProvider config={tamaguiConfig}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ contentStyle: { backgroundColor: '#2E7D32' } }}>
                    {/* Auth stack */}
                    <Stack.Screen
                        name="auth/Login"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="auth/Register"
                        options={{ title: 'Register' }}
                    />

                    {/* Main tabs */}
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />

                    {/* Example modal */}
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: 'modal', title: 'Modal' }}
                    />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </TamaguiProvider>
    );
}
