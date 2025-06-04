import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
<<<<<<< HEAD
import { Colors } from '@/constants/Colors';
=======
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

<<<<<<< HEAD
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#252525',
      card: '#1D1D1D',
      text: '#FFFFFF',
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : DefaultTheme}>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#252525' },
=======
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade',
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
<<<<<<< HEAD
      <StatusBar style="light" />
=======
      <StatusBar style="auto" />
>>>>>>> e51dcd8e84724688b8f4c4924d730f55f89ca583
    </ThemeProvider>
  );
}
