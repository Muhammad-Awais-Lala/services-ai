import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Sparkles, KeyRound } from 'lucide-react-native';
import { cn } from '../lib/utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-950 text-neutral-50 justify-center py-12 px-6 relative overflow-hidden font-sans">
      <View className="absolute inset-0 pointer-events-none">
        <View className="absolute top-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </View>

      <View className="mx-auto w-full max-w-md relative z-10">
        <View className="flex justify-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <KeyRound size={32} color="white" />
          </View>
        </View>
        <Text className="text-center text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          Reset Password
        </Text>
        <Text className="mt-2 text-center text-sm text-neutral-400">
          Remembered your password?{' '}
          <Text
            className="font-medium text-indigo-400"
            onPress={() => navigation.navigate('Login')}
          >
            Sign in
          </Text>
        </Text>
      </View>

      <View className="mt-8 mx-auto w-full max-w-md relative z-10">
        <View className="bg-black/40 py-8 px-4 shadow-2xl rounded-2xl border border-white/10">
          {success ? (
            <View className="text-center space-y-4">
              <View className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Sparkles size={24} color="#34D399" />
              </View>
              <Text className="text-emerald-400 font-medium">Reset link sent!</Text>
              <Text className="text-sm text-neutral-400">Check your email for instructions to reset your password.</Text>
            </View>
          ) : (
            <View className="space-y-6">
              <View>
                <Text className="block text-sm font-medium text-neutral-300">
                  Email address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="email-address"
                  className="mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </View>

              {error ? (
                <Text className="text-rose-400 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={cn(
                  "w-full flex justify-center items-center py-3 px-4 rounded-xl bg-indigo-600",
                  loading && "opacity-70"
                )}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-sm font-semibold text-white">Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
