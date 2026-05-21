import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

const API_BASE = 'https://services-agent.vercel.app';

interface BookingRequest {
  id: string;
  customerName: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: { 'Authorization': `Bearer ${user.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.accessToken}` }
      });
      if (res.ok) {
        Alert.alert('Success', 'Booking accepted');
        loadBookings();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to accept booking');
    }
  };

  const handleReject = async (bookingId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.accessToken}` }
      });
      if (res.ok) {
        Alert.alert('Success', 'Booking rejected');
        loadBookings();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reject booking');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          logout();
        },
        style: 'destructive',
      },
    ]);
  };

  const renderBooking = ({ item }: { item: BookingRequest }) => (
    <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-neutral-300 text-sm">From: {item.customerName}</Text>
          <Text className="text-white font-semibold text-lg">{item.category}</Text>
        </View>
        <View
          className={
            item.status === 'pending'
              ? 'bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-2 py-1'
              : item.status === 'accepted'
              ? 'bg-green-500/20 border border-green-500/50 rounded-lg px-2 py-1'
              : 'bg-red-500/20 border border-red-500/50 rounded-lg px-2 py-1'
          }
        >
          <Text
            className={
              item.status === 'pending'
                ? 'text-yellow-300'
                : item.status === 'accepted'
                ? 'text-green-300'
                : 'text-red-300'
            }
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View className="space-y-2 mb-4">
        <Text className="text-neutral-400 text-sm">{item.description}</Text>
        <View className="flex-row gap-4">
          <Text className="text-neutral-500 text-xs">📅 {item.date}</Text>
          <Text className="text-neutral-500 text-xs">🕐 {item.time}</Text>
          <Text className="text-neutral-500 text-xs">📍 {item.location}</Text>
        </View>
      </View>

      {/* Actions */}
      {item.status === 'pending' && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 bg-green-600 rounded-lg py-2"
            onPress={() => handleAccept(item.id)}
          >
            <Text className="text-white font-semibold text-center">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-red-600 rounded-lg py-2"
            onPress={() => handleReject(item.id)}
          >
            <Text className="text-white font-semibold text-center">Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-neutral-950">
      {/* Background Gradients */}
      <View className="absolute inset-0 pointer-events-none z-0">
        <View className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-900/20 blur-3xl" />
        <View className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
      </View>

      {/* Header */}
      <View className="px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white font-bold text-lg">Provider Dashboard</Text>
            <Text className="text-neutral-400 text-xs mt-1">{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="p-2">
            <Text className="text-neutral-400 text-sm">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#6366f1" size="large" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-neutral-500 text-center">No bookings yet</Text>
            </View>
          }
          onRefresh={loadBookings}
          refreshing={loading}
          scrollEnabled
        />
      )}
    </View>
  );
}
