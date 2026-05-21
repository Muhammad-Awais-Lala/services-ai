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

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signup(fullName, email, password, role);
      router.replace('/(app)/chat');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      Alert.alert('Signup Error', err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-950" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Background Gradients */}
      <View className="absolute inset-0 pointer-events-none">
        <View className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-indigo-900/20 blur-3xl" />
        <View className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-purple-900/20 blur-3xl" />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center px-6 relative z-10">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 justify-center items-center mb-6 shadow-lg">
            <Text className="text-3xl">✨</Text>
          </View>
          <Text className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 mb-3">
            Create Account
          </Text>
          <View className="flex-row">
            <Text className="text-neutral-400 text-sm">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-indigo-400 text-sm font-semibold">Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Form */}
        <View className="bg-black/40 rounded-2xl p-6 border border-white/10">
          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-neutral-300 text-sm font-medium mb-2">Full Name</Text>
            <TextInput
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="John Doe"
              placeholderTextColor="#737373"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
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

          {/* Password */}
          <View className="mb-4">
            <Text className="text-neutral-300 text-sm font-medium mb-2">Password</Text>
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
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-semibold">Create Account</Text>
                <Text className="text-white ml-2">→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
