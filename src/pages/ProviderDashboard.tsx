import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, CheckCircle, XCircle, Bell, User, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { BookingRequest } from '../types';
const API_BASE = 'https://services-agent.vercel.app';

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${API_BASE}/bookings/${user.email}`, {
      headers: { 'Authorization': `Bearer ${user.accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Map API data back to BookingRequest format needed by UI
          // API returns: { id, provider_name, service_type, booking_time, status }
          const mapped = data.map(b => ({
            id: b.id.toString(),
            customerName: b.provider_name || 'Customer', // The API seems to just say provider_name but dashboard assumes customer
            category: b.service_type || 'Service',
            description: `Booking for ${b.service_type}`,
            date: b.booking_time || 'N/A',
            time: '',
            location: 'TBD',
            status: b.status
          }));
          setRequests(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const historyRequests = requests.filter(r => r.status !== 'pending');

  const handleAction = (id: string, newStatus: 'accepted' | 'rejected') => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      {/* Mini Sidebar */}
      <div className="w-20 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 space-y-8 z-10 relative shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-4">
          <Sparkles size={24} />
        </div>
        <div className="flex-1 space-y-6">
          <button className="p-3 text-indigo-400 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-inner">
            <Calendar size={22} />
          </button>
          <button className="p-3 text-neutral-500 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">
            <Bell size={22} />
          </button>
          <button className="p-3 text-neutral-500 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">
            <User size={22} />
          </button>
        </div>
        <button 
          onClick={() => logout()}
          className="p-3 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all mt-auto"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">Provider Dashboard</h1>
            <p className="text-sm text-neutral-400 mt-1">Welcome back, {user?.displayName || 'Service Pro'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold shadow-lg shadow-emerald-500/5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Accepting Requests
            </div>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            
            <div className="flex space-x-8 border-b border-white/10 mb-8">
              <button 
                onClick={() => setActiveTab('pending')}
                className={cn(
                  "pb-4 text-sm font-semibold transition-all flex items-center space-x-2 relative",
                  activeTab === 'pending' ? "text-indigo-400" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                <span>Pending Requests</span>
                <span className="bg-indigo-500/20 text-indigo-300 py-0.5 px-2 rounded-full text-[10px]">{pendingRequests.length}</span>
                {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={cn(
                  "pb-4 text-sm font-semibold transition-all relative",
                  activeTab === 'history' ? "text-indigo-400" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                <span>Request History</span>
                {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
              </button>
            </div>

            {activeTab === 'pending' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                  <div className="col-span-full py-24 flex items-center justify-center text-indigo-400">
                    Loading requests...
                  </div>
                ) : pendingRequests.map(req => (
                  <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col group hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{req.customerName}</h3>
                        <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">{req.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{req.date}</p>
                        <p className="text-xs text-neutral-400">{req.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300 mb-6 bg-black/20 p-3 rounded-lg border border-white/5 flex-1">{req.description}</p>
                    <div className="flex items-center text-xs text-neutral-400 mb-6">
                      <span className="text-indigo-400 mr-2">📍</span> {req.location}
                    </div>
                    <div className="flex space-x-3 mt-auto">
                      <button onClick={() => handleAction(req.id, 'rejected')} className="flex-1 py-2.5 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-all">
                        Decline
                      </button>
                      <button onClick={() => handleAction(req.id, 'accepted')} className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && pendingRequests.length === 0 && (
                  <div className="col-span-full py-24 bg-white/5 rounded-3xl border border-dashed border-white/20 flex flex-col items-center justify-center text-neutral-400 backdrop-blur-sm">
                    <CheckCircle size={48} className="mb-4 text-emerald-500/50" />
                    <p className="text-xl font-medium text-white mb-2">All caught up!</p>
                    <p className="text-sm">No pending booking requests at the moment.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                  <div className="py-16 text-center text-indigo-400">Loading history...</div>
                ) : historyRequests.map(req => (
                    <div key={req.id} className="bg-white/5 p-5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between backdrop-blur-sm">
                        <div className="flex items-center space-x-5">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner",
                                req.status === 'accepted' 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" 
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10"
                            )}>
                                {req.status === 'accepted' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{req.customerName}</h4>
                                <p className="text-xs text-neutral-400 mt-1">{req.date} • {req.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border",
                                req.status === 'accepted' 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            )}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                ))}
                {!loading && historyRequests.length === 0 && (
                  <div className="col-span-full py-16 text-center text-neutral-500">
                    No history yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
