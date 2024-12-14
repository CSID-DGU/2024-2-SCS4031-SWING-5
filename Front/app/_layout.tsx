import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserDataProvider } from '../context/UserDataContext';
import { FamilyProvider } from '@/context/FamilyContext';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <UserDataProvider>
      <FamilyProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: {
              backgroundColor: '#AFB8DA', 
            }, }}>
            {/* 초기 진입점을 index로 설정 */}
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="successpage" />
            <Stack.Screen name="userextra" />
            <Stack.Screen name="(main)" />
          </Stack>
        </ThemeProvider>
      </FamilyProvider>
    </UserDataProvider>
  );
}

