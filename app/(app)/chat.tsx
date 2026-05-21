import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useServiceAgent } from '../../src/hooks/useServiceAgent';
import { cn } from '../../src/lib/utils';

const API_BASE = 'https://services-agent.vercel.app';

const STATUS_LABELS: Record<string, string> = {
  awaiting_clarification: 'Please provide more details',
  awaiting_confirmation: 'Confirm your booking above (Yes/No)',
  completed: '✅ Service Booked Successfully',
  processing: 'Agent is thinking...',
};

export default function Chat() {
  const { user, logout } = useAuth();
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, traceEvents, resetConversation, loadThread, threadId } = useServiceAgent();
  const flatListRef = useRef<FlatList>(null);
  const [threads, setThreads] = useState<any[]>([]);

  // Fetch threads on mount and when threadId changes
  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/threads/${user.email}`, {
      headers: { 'Authorization': `Bearer ${user.accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setThreads(data);
      })
      .catch(console.error);
  }, [user, threadId]);

  const onSend = () => {
    if (!input.trim() || status === 'processing') return;
    sendMessage(input.trim());
    setInput('');
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

  const renderMessage = ({ item }: any) => (
    <View className={cn('mb-4 flex-row', item.role === 'user' ? 'justify-end' : 'justify-start')}>
      <View
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          item.role === 'user'
            ? 'bg-indigo-600 rounded-tr-none'
            : 'bg-white/10 border border-white/20 rounded-tl-none'
        )}
      >
        <Text className={cn('text-sm', item.role === 'user' ? 'text-white' : 'text-neutral-100')}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  const renderTraceEvent = ({ item }: any) => (
    <View className="mb-2 pl-4 border-l border-indigo-500/30">
      <Text className="text-xs text-neutral-400">{item.agent}: {item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-neutral-950"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="flex-1">
        {/* Background Gradients */}
        <View className="absolute inset-0 pointer-events-none z-0">
          <View className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-900/20 blur-3xl" />
          <View className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
        </View>

        {/* Header */}
        <View className="px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 justify-center items-center">
                <Text className="text-lg">✨</Text>
              </View>
              <Text className="text-lg font-bold text-white">ServiceLink</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} className="p-2">
              <Text className="text-neutral-400 text-sm">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Status Label */}
          {status !== 'idle' && (
            <Text className="text-xs text-indigo-300 mt-2">
              {STATUS_LABELS[status] || 'Agent processing...'}
            </Text>
          )}
        </View>

        {/* Messages */}
        <View className="flex-1 px-6 py-4 relative z-10">
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            scrollEnabled
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-12">
                <Text className="text-neutral-500 text-center">Start a conversation with the service agent</Text>
              </View>
            }
          />

          {/* Trace Events */}
          {traceEvents.length > 0 && (
            <View className="mt-4 bg-black/40 rounded-lg p-4 border border-indigo-500/20">
              <Text className="text-xs text-indigo-300 font-semibold mb-2">Agent Activity</Text>
              <FlatList
                scrollEnabled={false}
                data={traceEvents.slice(-3)}
                renderItem={renderTraceEvent}
                keyExtractor={(_, i) => i.toString()}
              />
            </View>
          )}
        </View>

        {/* Input Area */}
        <View className="px-6 py-4 border-t border-white/5 relative z-10">
          <View className="flex-row gap-3">
            <TextInput
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="Type your message..."
              placeholderTextColor="#737373"
              value={input}
              onChangeText={setInput}
              editable={status !== 'processing'}
              multiline
              maxHeight={100}
            />
            <TouchableOpacity
              className={cn(
                'bg-indigo-600 rounded-xl px-4 py-3 justify-center items-center',
                (status === 'processing' || !input.trim()) && 'opacity-50'
              )}
              onPress={onSend}
              disabled={status === 'processing' || !input.trim()}
            >
              <Text className="text-white text-lg">→</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mt-3">
            <TouchableOpacity
              className="flex-1 bg-indigo-600/20 border border-indigo-500/30 rounded-lg py-2"
              onPress={() => { resetConversation(); }}
            >
              <Text className="text-indigo-300 text-xs font-medium text-center">New Request</Text>
            </TouchableOpacity>

            {threads.length > 0 && (
              <TouchableOpacity
                className="flex-1 bg-purple-600/20 border border-purple-500/30 rounded-lg py-2"
                onPress={() => {
                  if (threads.length > 0) {
                    loadThread(threads[0].thread_id);
                  }
                }}
              >
                <Text className="text-purple-300 text-xs font-medium text-center">Last Thread</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
