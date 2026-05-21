import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { cn } from '../../src/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/(app)/chat');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      Alert.alert('Login Error', err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-950" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Background Gradients - simplified for mobile */}
      <View className="absolute inset-0 pointer-events-none">
        <View className="absolute top-0 left-0 w-72 h-72 rounded-full bg-indigo-900/20 blur-3xl" />
        <View className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-900/20 blur-3xl" />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center px-6 relative z-10">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 justify-center items-center mb-6 shadow-lg">
            <Text className="text-3xl">✨</Text>
          </View>
          <Text className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 mb-3">
            Welcome Back
          </Text>
          <View className="flex-row">
            <Text className="text-neutral-400 text-sm">
              Or{' '}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-indigo-400 text-sm font-semibold">create a new account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Form */}
        <View className="bg-black/40 rounded-2xl p-6 border border-white/10">
          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-neutral-300 text-sm font-medium mb-2">Email address</Text>
            <TextInput
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="you@example.com"
              placeholderTextColor="#737373"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-neutral-300 text-sm font-medium">Password</Text>
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-indigo-400 text-sm font-medium">Forgot your password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <TextInput
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="••••••••"
              placeholderTextColor="#737373"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 mb-5">
              <Text className="text-rose-400 text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            className={cn(
              'bg-indigo-600 rounded-xl py-3 flex-row justify-center items-center shadow-lg',
              loading && 'opacity-70'
            )}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-semibold">Sign in</Text>
                <Text className="text-white ml-2">→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
