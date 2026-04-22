import '@/global.css';
import { useAuth } from '@clerk/expo';
import { useFonts } from 'expo-font';
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
    const [fontsLoaded] = useFonts({
        'sans-regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
        'sans-bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
        'sans-medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
        'sans-semibold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'sans-extrabold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'sans-light': require('@/assets/fonts/PlusJakartaSans-Light.ttf')
    });

    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded || !isLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/(tabs)" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}