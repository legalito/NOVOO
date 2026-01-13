import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingLayout() {
  return (
      <Stack 
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: 'white'
          }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false,
          }} 
        />
      </Stack>
  );
} 