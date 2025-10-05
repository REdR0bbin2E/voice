// Likely in app/index.tsx or app/(auth)/index.tsx

import { Redirect } from 'expo-router';

export default function AppRootIndex() {
    // Use '/(app)' to target the layout that contains (tabs)
    return <Redirect href="./(auth)/login" />;
}