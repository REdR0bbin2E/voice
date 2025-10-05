import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native'; // Import Platform for conditional styling

// Assuming these imports are correctly aliased in your project
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Using IconSymbol for SF Symbols
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Theme colors to match your style guide
  const ACTIVE_COLOR = '#E6AFA4'; // Soft Pink/Coral (A primary color from your app)
  const INACTIVE_COLOR = '#B7A9C9'; // Muted Purple
  const BACKGROUND_COLOR = '#FFFFFF'; // White for a clean, floating bar

  return (
    <Tabs
      screenOptions={{
        // 1. GLOBAL HEADER REMOVAL: Ensures no header is shown on any tab screen
        headerShown: false,

        // Tab bar styling options
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,

        // Use your custom Haptic button component
        tabBarButton: HapticTab,

        // 2. CUSTOM TAB BAR STYLE: Floating/Modern look
        tabBarStyle: {
          // General Style
          backgroundColor: BACKGROUND_COLOR,
          height: Platform.OS === 'ios' ? 90 : 60, // Increase height for safety area on iOS
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 5, // Padding for safe area on iOS

          // Floating/Card Style
          position: 'absolute',
          marginHorizontal: 15,
          marginBottom: Platform.OS === 'ios' ? 25 : 15,
          borderRadius: 20,
          borderTopWidth: 0, // Ensure no default border line is visible
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10, // Android shadow
        },

        // Style for the labels
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4, // Adjust for spacing
        }
      }}>

      {/* --- AUTH/REDIRECTION SCREENS (Hidden Tab Bar) --- */}
      {/* These screens should hide the tab bar completely */}
      <Tabs.Screen
        name="index" // Assuming this is your main redirect or Signup screen
        options={{
          title: 'Sign Up',
          tabBarStyle: { display: 'none' }, // HIDES THE TAB BAR
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.badge.key" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore" // Assuming this is your Login screen
        options={{
          title: 'Login',
          tabBarStyle: { display: 'none' }, // HIDES THE TAB BAR
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="lock.fill" color={color} />,
        }}
      />

      {/* --- MAIN APPLICATION TABS --- */}

      <Tabs.Screen
        name="HomePage"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="EchoesMessaging"
        options={{
          title: 'Echoes',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="bubble.left.and.bubble.right.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="timeline" // Assuming you have a timeline.tsx file
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="clock.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="share" // Assuming you have a share.tsx file (ShareScreen)
        options={{
          title: 'Share',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="square.and.arrow.up.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}