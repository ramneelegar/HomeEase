export type UserRole = 'customer' | 'provider' | 'admin';

export interface Review {
  id: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'provider';
  category: string;
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  pricing: number;
  pricingType: string; // e.g. 'hr', 'job'
  verified: boolean;
  completedJobs: number;
  bio: string;
  availability: string[];
  joinedDate: string;
  portfolio: string[];
  reviews: Review[];
  password?: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  password?: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  service: string;
  amount: number;
  date: string;
  time: string;
  address: string;
  status: 'requested' | 'accepted' | 'completed' | 'rejected';
  notes?: string;
  reviewed?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string; // ISO string
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'booking_requested' | 'booking_accepted' | 'booking_rejected' | 'booking_completed' | 'new_message';
  text: string;
  time: string; // ISO string
  read: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  category?: string; // for provider
  location?: string; // for provider
  pricing?: number; // for provider
  pricingType?: string; // for provider
  bio?: string; // for provider
  address?: string; // for customer
  portfolio?: string[]; // for provider
  password?: string;
  avatar?: string;
}
