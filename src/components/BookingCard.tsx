import React from 'react';
import { Calendar, MapPin, Clock, Briefcase, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookingCardProps {
  data: {
    category: string;
    description: string;
    date: string;
    time: string;
    location: string;
  };
  isSender: boolean;
  status?: 'pending' | 'accepted' | 'rejected';
}

export default function BookingCard({ data, isSender, status = 'pending' }: BookingCardProps) {
  return (
    <div className={cn(
      "w-full max-w-sm overflow-hidden rounded-xl border bg-white shadow-md transition-all border-blue-200",
      isSender ? "ring-2 ring-blue-500 ring-offset-2" : ""
    )}>
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center text-blue-700 font-bold">
          <Briefcase size={18} className="mr-2" />
          {data.category} Request
        </div>
        <div className={cn(
          "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
          status === 'pending' ? "bg-yellow-100 text-yellow-700" :
          status === 'accepted' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {status}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed italic border-l-4 border-blue-100 pl-3">
          "{data.description}"
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 text-blue-500" />
            {data.date}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-2 text-blue-500" />
            {data.time}
          </div>
          <div className="flex items-center col-span-2">
            <MapPin size={14} className="mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">{data.location}</span>
          </div>
        </div>

        {status === 'pending' && !isSender && (
          <div className="pt-2 flex gap-2">
            <button className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
              Accept
            </button>
            <button className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Decline
            </button>
          </div>
        )}

        {status === 'accepted' && (
          <div className="pt-2 flex items-center justify-center text-green-600 text-xs font-bold bg-green-50 py-2 rounded-lg border border-green-100">
            <CheckCircle size={14} className="mr-2" />
            Booking Confirmed
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <p className="text-[10px] text-center text-gray-400">
          {isSender ? "Waiting for provider to accept..." : "Respond to this request to schedule"}
        </p>
      </div>
    </div>
  );
}
