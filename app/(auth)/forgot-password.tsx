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
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { cn } from '../../src/lib/utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage('Password reset link sent to your email');
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-neutral-950" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="absolute inset-0 pointer-events-none">
        <View className="absolute top-0 left-0 w-72 h-72 rounded-full bg-indigo-900/20 blur-3xl" />
        <View className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-900/20 blur-3xl" />
      </View>

      <View className="flex-1 justify-center px-6 relative z-10">
        <View className="items-center mb-12">
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 justify-center items-center mb-6">
            <Text className="text-3xl">🔑</Text>
          </View>
          <Text className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 mb-3">
            Reset Password
          </Text>
          <Text className="text-neutral-400 text-sm text-center">
            Enter your email to receive a password reset link
          </Text>
        </View>

        <View className="bg-black/40 rounded-2xl p-6 border border-white/10">
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

          {message ? (
            <View className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-5">
              <Text className="text-green-400 text-sm">{message}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            className={cn(
              'bg-indigo-600 rounded-xl py-3 flex-row justify-center items-center',
              loading && 'opacity-70'
            )}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-sm font-semibold">Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
