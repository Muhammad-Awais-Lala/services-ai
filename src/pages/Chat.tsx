import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Send, Sparkles, Loader2, RefreshCw, LogOut, MessageSquare, Menu, X } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useServiceAgent } from '../hooks/useServiceAgent';
import { cn } from '../lib/utils';

const API_BASE = 'https://services-agent.vercel.app';

const STATUS_LABELS = {
  awaiting_clarification: 'Please provide more details',
  awaiting_confirmation: 'Confirm your booking above (Yes/No)',
  completed: '✅ Service Booked Successfully',
  processing: 'Agent is thinking...',
};

export default function Chat() {
  const { user, logout } = useAuth();
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, traceEvents, resetConversation, loadThread, threadId } = useServiceAgent();
  const scrollRef = useRef(null);

  const [threads, setThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/threads/${user.email}`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setThreads(data);
      })
      .catch(console.error);
  }, [user, threadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, traceEvents]);

  const onSend = () => {
    if (!input.trim() || status === 'processing') return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <View className="flex-1 bg-neutral-950 text-neutral-50">
      <View className="absolute inset-0 pointer-events-none z-0">
        <View className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <View className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]" />
      </View>

      {sidebarOpen && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/60 z-30"
          onPress={() => setSidebarOpen(false)}
        />
      )}

      <View className="flex-row items-center justify-between px-4 py-6">
        <Text className="text-xl font-bold text-white">Chat</Text>
        <TouchableOpacity onPress={logout} className="flex-row items-center">
          <LogOut size={20} color="white" />
          <Text className="ml-2 text-white">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.length === 0 ? (
          <View className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
              <Sparkles size={32} color="#6366F1" />
            </View>
            <Text className="text-2xl font-semibold text-neutral-100">How can I help you?</Text>
            <Text className="text-neutral-400 text-sm">
              I can help you find and book the best service professionals nearby.
            </Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <View
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white/10 text-neutral-100 rounded-tl-sm'
                }`}
              >
                <Text>{msg.content}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View className="p-4 bg-black/40">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#A1A1AA"
          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white"
        />
        <TouchableOpacity
          onPress={onSend}
          className="absolute right-4 bottom-4 bg-indigo-600 p-3 rounded-full"
        >
          <Send size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
