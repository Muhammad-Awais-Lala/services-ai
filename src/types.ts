export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: 'customer' | 'provider';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: 'text' | 'booking';
  bookingData?: BookingData;
  timestamp: Date;
}

export interface BookingData {
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface BookingRequest extends BookingData {
  id: string;
  customerName: string;
}

export interface Provider {
  id: string;
  fullName: string;
  category: string;
  avatar?: string;
  online?: boolean;
}
