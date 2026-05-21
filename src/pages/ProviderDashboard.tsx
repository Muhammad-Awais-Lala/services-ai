import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, CheckCircle, XCircle, Bell, User, Sparkles } from 'lucide-react-native';
import { cn } from '../lib/utils';
const API_BASE = 'https://services-agent.vercel.app';

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${API_BASE}/bookings/${user.email}`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((b) => ({
            id: b.id.toString(),
            customerName: b.provider_name || 'Customer',
            category: b.service_type || 'Service',
            description: `Booking for ${b.service_type}`,
            date: b.booking_time || 'N/A',
            time: '',
            location: 'TBD',
            status: b.status,
          }));
          setRequests(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const historyRequests = requests.filter((r) => r.status !== 'pending');

  const handleAction = (id, newStatus) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  return (
    <View className="flex-1 bg-neutral-950 text-neutral-50">
      <View className="absolute inset-0 pointer-events-none z-0">
        <View className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <View className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
      </View>

      <View className="flex-row items-center justify-between px-4 py-6">
        <Text className="text-xl font-bold text-white">Provider Dashboard</Text>
        <TouchableOpacity onPress={logout} className="flex-row items-center">
          <LogOut size={20} color="white" />
          <Text className="ml-2 text-white">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center space-x-4 px-4">
        <TouchableOpacity
          onPress={() => setActiveTab('pending')}
          className={cn(
            "px-4 py-2 rounded-full",
            activeTab === 'pending' ? 'bg-indigo-600' : 'bg-neutral-800'
          )}
        >
          <Text className="text-white">Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2 rounded-full",
            activeTab === 'history' ? 'bg-indigo-600' : 'bg-neutral-800'
          )}
        >
          <Text className="text-white">History</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4">
          {(activeTab === 'pending' ? pendingRequests : historyRequests).map((request) => (
            <View
              key={request.id}
              className="p-4 mb-4 bg-neutral-800 rounded-lg border border-neutral-700"
            >
              <Text className="text-white font-bold">{request.customerName}</Text>
              <Text className="text-neutral-400">{request.description}</Text>
              <Text className="text-neutral-400">{request.date}</Text>
              <View className="flex-row justify-end space-x-2 mt-2">
                {activeTab === 'pending' && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleAction(request.id, 'accepted')}
                      className="px-4 py-2 bg-emerald-600 rounded-full"
                    >
                      <Text className="text-white">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAction(request.id, 'rejected')}
                      className="px-4 py-2 bg-rose-600 rounded-full"
                    >
                      <Text className="text-white">Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
