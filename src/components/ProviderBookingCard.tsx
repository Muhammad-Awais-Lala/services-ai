import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { BookingRequest } from '../types';

interface ProviderBookingCardProps {
  request: BookingRequest;
  onAction: (id: string, status: 'accepted' | 'rejected') => void;
}

export default function ProviderBookingCard({ request, onAction }: ProviderBookingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (status: 'accepted' | 'rejected') => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onAction(request.id, status);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">{request.customerName}</h3>
              <p className="text-sm text-blue-600 font-medium">{request.category}</p>
            </div>
          </div>
          <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Pending
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 italic">"{request.description}"</p>
        </div>

        <div className="grid grid-cols-2 gap-y-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={18} className="mr-2 text-gray-400" />
            {request.date}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={18} className="mr-2 text-gray-400" />
            {request.time}
          </div>
          <div className="flex items-center text-sm text-gray-600 col-span-2">
            <MapPin size={18} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            disabled={loading}
            onClick={() => handleStatusChange('accepted')}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Check size={18} className="mr-2" />
            Accept
          </button>
          <button 
            disabled={loading}
            onClick={() => handleStatusChange('rejected')}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold text-sm transition-colors",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <X size={18} className="mr-2" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
