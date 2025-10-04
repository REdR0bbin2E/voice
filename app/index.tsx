import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useRootNavigation } from 'expo-router';

export default function Entry() {
    const router = useRouter();
    const rootNavigation = useRootNavigation();

    useEffect(() => {
        const unsubscribe = rootNavigation?.addListener('state', () => {
            // only navigate once the root navigation is mounted
            if (rootNavigation?.isReady()) {
                router.replace('/auth/Login');
            }
        });

        return unsubscribe;
    }, [rootNavigation]);

    return <View />;
}
