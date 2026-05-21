import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Stack>
        <Stack.Screen 
          name="(auth)/login" 
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack.Group>
        </>
      ) : (
        <>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Group>
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
