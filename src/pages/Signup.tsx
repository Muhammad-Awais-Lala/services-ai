import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { cn } from '../lib/utils';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { signup } = useAuth();

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      console.log("payload======>", { fullName, email, password, role });

      await signup(fullName, email, password, role);
      navigation.navigate('Home');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-950 text-neutral-50 justify-center py-12 px-6 relative overflow-hidden font-sans">

      {/* Background Gradients */}
      <View className="absolute inset-0 pointer-events-none">
        <View className="absolute top-[20%] left-[60%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <View className="absolute bottom-[10%] right-[30%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </View>

      <View className="mx-auto w-full max-w-md relative z-10">
        <View className="flex justify-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles size={32} color="white" />
          </View>
        </View>
        <Text className="text-center text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          Create Account
        </Text>
        <Text className="mt-2 text-center text-sm text-neutral-400">
          Already have an account?{' '}
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
          <View className="space-y-5">
            <View>
              <Text className="block text-sm font-medium text-neutral-300">
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor="#A1A1AA"
                className="mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </View>

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

            <View>
              <Text className="block text-sm font-medium text-neutral-300">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                className="mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </View>

            {error ? (
              <Text className="text-rose-400 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 mt-4">
                {error}
              </Text>
            ) : null}

            <View className="pt-2">
              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                className={cn(
                  "w-full flex justify-center items-center py-3 px-4 rounded-xl bg-indigo-600",
                  loading && "opacity-70"
                )}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text className="text-sm font-semibold text-white">Create Account</Text>
                    <ArrowRight size={18} color="white" className="ml-2" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
