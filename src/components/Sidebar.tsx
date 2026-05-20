import React, { useState } from 'react';
import { LogOut, Search, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Provider } from '../types';

interface SidebarProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
  selectedProviderId?: string;
}

export default function Sidebar({ providers, onSelectProvider, selectedProviderId }: SidebarProps) {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50">
      {/* Profile Header */}
      <div className="p-4 border-bottom border-gray-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-900 truncate max-w-[120px]">
              {user?.displayName || 'My Profile'}
            </span>
            <span className="text-xs text-gray-500">Customer</span>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Provider List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Service Providers
        </div>
        <div className="space-y-px">
          {filteredProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onSelectProvider(provider)}
              className={cn(
                "w-full flex items-center p-3 text-left transition-all",
                selectedProviderId === provider.id 
                  ? "bg-white shadow-sm border-l-4 border-blue-600" 
                  : "hover:bg-gray-100 border-l-4 border-transparent"
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                  <User size={28} />
                </div>
                {provider.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 truncate">{provider.fullName}</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <MessageSquare size={12} className="mr-1" />
                  {provider.category}
                </div>
              </div>
            </button>
          ))}
          {filteredProviders.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm italic">
              No providers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
