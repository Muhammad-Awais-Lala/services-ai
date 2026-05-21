import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'https://services-agent.vercel.app';

export type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };
export type AgentStatus = 'idle' | 'processing' | 'awaiting_clarification' | 'awaiting_confirmation' | 'completed';
export type TraceEvent  = { agent: string; message: string };

export function useServiceAgent() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setStatus('processing');
    setTraceEvents([]);

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/request`);
        xhr.setRequestHeader('Authorization', `Bearer ${user.accessToken}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'text/event-stream');

        let seenBytes = 0;
        let buffer = '';

        const processChunk = (chunk: string) => {
          buffer += chunk;
          const parts = buffer.split('\n\n');
          
          // Keep the last part in buffer if it's incomplete
          buffer = parts.pop() || '';
          
          for (const block of parts) {
            if (!block.startsWith('data: ')) continue;
            
            try {
              const eventStr = block.slice(6);
              const event = JSON.parse(eventStr);
              
              if (event.type === 'agent_start' || event.type === 'log') {
                setTraceEvents(prev => [...prev, { agent: event.agent || 'System', message: event.message }]);
              } else if (event.type === 'done') {
                setThreadId(event.task_id);
                setStatus(event.status);
                if (event.assistant_message) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: event.assistant_message,
                  }]);
                }
              } else if (event.type === 'error') {
                reject(new Error(event.message));
              }
            } catch (e) {
              console.error('Error parsing SSE block', block, e);
            }
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 3 || xhr.readyState === 4) {
            const textResponse = xhr.responseText;
            const chunk = textResponse.slice(seenBytes);
            seenBytes = textResponse.length;

            if (chunk) {
              processChunk(chunk);
            }
          }

          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              if (xhr.status === 401) logout();
              reject(new Error(`HTTP ${xhr.status}`));
            }
          }
        };

        xhr.onerror = (err) => {
          reject(err);
        };

        xhr.send(JSON.stringify({
          text,
          thread_id: threadId || null
        }));
      });
    } catch (err) {
      console.error('Agent error:', err);
      setStatus('idle');
    }
  }, [threadId, user, logout]);

  const loadThread = useCallback(async (selectedThreadId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/threads/${selectedThreadId}/messages`, {
        headers: { 'Authorization': `Bearer ${user.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map((m: any, i: number) => ({
          id: `history_${i}`,
          role: m.role,
          content: m.content
        })));
        setThreadId(selectedThreadId);
        setStatus('idle');
        setTraceEvents([]);
      }
    } catch (err) {
      console.error("Failed to load thread", err);
    }
  }, [user]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    setThreadId(null);
    setTraceEvents([]);
  }, []);

  return { messages, sendMessage, status, threadId, traceEvents, resetConversation, loadThread };
}
