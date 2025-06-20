import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].accent,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#252525',
          borderTopWidth: 0,
          borderRadius: 24,
          marginHorizontal: 16,
          height: 64,
          position: 'absolute',
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
      }}>
      <Tabs.Screen
        name="prog"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: focused ? Colors[colorScheme ?? 'light'].accent : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol
                size={24}
                name="house.fill"
                color={focused ? '#252525' : '#9BA1A6'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trainning"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol
                size={24}
                name="dumbbell.fill"
                color={focused ? '#252525' : '#9BA1A6'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol
                size={24}
                name="chart.bar.fill"
                color={focused ? '#252525' : '#9BA1A6'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol
                size={24}
                name="person.circle.fill"
                color={focused ? '#252525' : '#9BA1A6'}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
