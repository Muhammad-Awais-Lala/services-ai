import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, MapPin, User, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import MessageBubble from './MessageBubble';
import BookingCard from './BookingCard';
import { Message, Provider } from '../types';

interface ChatWindowProps {
  provider: Provider;
}

export default function ChatWindow({ provider }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial dummy messages
  useEffect(() => {
    setMessages([
      { 
        id: '1', 
        senderId: provider.id, 
        text: `Hi! I'm ${provider.fullName}. How can I help you today?`, 
        type: 'text', 
        timestamp: new Date(Date.now() - 3600000) 
      }
    ]);
  }, [provider]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.uid,
      text: inputText,
      type: 'text',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleBookingSubmit = (bookingData: any) => {
    if (!user) return;
    const bookingMessage: Message = {
      id: Date.now().toString(),
      senderId: user.uid,
      text: `Service Requested: ${bookingData.category}`,
      type: 'booking',
      bookingData,
      timestamp: new Date()
    };
    setMessages([...messages, bookingMessage]);
    setShowBookingModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 leading-tight">{provider.fullName}</h2>
            <div className="flex items-center text-xs text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Calendar className="mr-2" size={16} />
          Book Service
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
      >
        {messages.map((msg) => (
          msg.type === 'booking' ? (
            <div key={msg.id} className="flex justify-center my-4">
              <BookingCard data={msg.bookingData} isSender={msg.senderId === user?.uid} />
            </div>
          ) : (
            <div key={msg.id}>
              <MessageBubble 
                message={msg} 
                isMe={msg.senderId === user?.uid} 
              />
            </div>
          )
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <button 
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold flex items-center">
                <Calendar className="mr-2" size={20} />
                New Booking Details
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-white hover:text-blue-100">
                &times;
              </button>
            </div>
            <BookingForm onSubmit={handleBookingSubmit} onCancel={() => setShowBookingModal(false)} defaultCategory={provider.category} />
          </div>
        </div>
      )}
    </div>
  );
}

function BookingForm({ onSubmit, onCancel, defaultCategory }: { onSubmit: (data: any) => void; onCancel: () => void; defaultCategory: string }) {
  const [formData, setFormData] = useState({
    category: defaultCategory,
    description: '',
    date: '',
    time: '',
    location: ''
  });

  return (
    <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Service Type</label>
        <input 
          type="text" 
          value={formData.category} 
          disabled
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center">
          <Info size={12} className="mr-1" /> Problem Description
        </label>
        <textarea 
          required
          placeholder="What needs fixing?"
          className="w-full border border-gray-200 rounded-lg p-2.5 text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
          <input 
            type="date" 
            required
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Time</label>
          <input 
            type="time" 
            required
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center">
          <MapPin size={12} className="mr-1" /> Service Location
        </label>
        <input 
          type="text" 
          required
          placeholder="Your address"
          className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200"
        >
          Confirm & Send
        </button>
      </div>
    </form>
  );
}
