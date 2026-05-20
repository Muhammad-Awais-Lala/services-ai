import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, RefreshCw, LogOut, MessageSquare, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useServiceAgent } from '../hooks/useServiceAgent';
import { cn } from '../lib/utils';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [threads, setThreads] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch threads on mount and when threadId changes (to catch newly created ones)
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, traceEvents]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'processing') return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar (Threads) */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-transform duration-300 shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
              History
            </h2>
          </div>
          <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={() => { resetConversation(); setSidebarOpen(false); }}
            className="w-full flex items-center space-x-3 p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all text-sm font-medium"
          >
            <RefreshCw size={16} />
            <span>New Request</span>
          </button>
          
          <div className="pt-4 pb-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2">Recent Threads</p>
          </div>
          
          {threads.map(t => (
            <button
              key={t.thread_id}
              onClick={() => { loadThread(t.thread_id); setSidebarOpen(false); }}
              className={cn(
                "w-full flex flex-col items-start p-3 rounded-xl transition-all text-left group",
                threadId === t.thread_id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-center space-x-2 text-sm text-neutral-200 font-medium w-full">
                <MessageSquare size={14} className={threadId === t.thread_id ? "text-indigo-400" : "text-neutral-500 group-hover:text-indigo-400"} />
                <span className="truncate flex-1">{t.title || 'Conversation'}</span>
              </div>
              <span className="text-[10px] text-neutral-500 ml-6 mt-1">
                {new Date(t.created_at).toLocaleDateString()}
              </span>
            </button>
          ))}
          {threads.length === 0 && (
            <div className="text-center py-6 text-sm text-neutral-600">No recent conversations.</div>
          )}
        </div>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-3 text-neutral-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Logout ({user?.email})</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10 w-full bg-black/20 backdrop-blur-sm">
        {/* Header */}
        <header className="p-4 md:p-5 border-b border-white/5 flex items-center bg-black/20 backdrop-blur-md sticky top-0 z-20">
          <button className="mr-4 md:hidden text-neutral-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center text-xs text-indigo-400 font-medium px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            Agent Online
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto opacity-80 animate-in fade-in duration-1000">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                <Sparkles size={32} className="text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-neutral-100">How can I help you?</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  I can help you find and book the best service professionals nearby. Try asking for a plumber, electrician, or AC technician.
                </p>
              </div>
              <div className="grid grid-cols-1 w-full gap-3 mt-4">
                {["I need an AC technician in Lahore", "Looking for a plumber urgently", "Need an electrician for wiring"].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="p-3 text-sm text-left text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 group"
                  >
                    <span className="text-indigo-400 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300 ease-out`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-indigo-900/20' 
                      : 'bg-white/10 text-neutral-100 border border-white/10 rounded-tl-sm backdrop-blur-md'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Trace Events (Agent Thinking) */}
          {status === 'processing' && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="max-w-[85%] md:max-w-[70%] bg-black/40 border border-indigo-500/20 rounded-2xl rounded-tl-sm p-4 backdrop-blur-md space-y-3 shadow-lg shadow-indigo-900/10">
                <div className="flex items-center space-x-3 text-indigo-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Agent is thinking...</span>
                </div>
                {traceEvents.length > 0 && (
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-indigo-500/10">
                    {traceEvents.slice(-3).map((e, i) => (
                      <div key={i} className="flex items-start text-xs font-mono text-indigo-300/70">
                        <span className="mr-2 opacity-50">[{e.agent}]</span>
                        <span>{e.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
          {status !== 'idle' && status !== 'processing' && (
            <div className="flex justify-center mb-4">
              <div className={`px-4 py-1.5 rounded-full text-xs font-medium border flex items-center shadow-lg ${
                status === 'completed' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10'
              }`}>
                {status === 'completed' ? '✨ ' : '⚠️ '}
                {STATUS_LABELS[status] ?? status}
              </div>
            </div>
          )}

          <form onSubmit={onSend} className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              placeholder={status === 'processing' ? "Agent is typing..." : "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status === 'processing'}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-[15px] text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || status === 'processing'}
              className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-full transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none flex items-center justify-center"
            >
              {status === 'processing' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
            </button>
          </form>
          <div className="text-center mt-3 hidden md:block">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">AI Service Assistant</p>
          </div>
        </div>
      </main>
    </div>
  );
}
