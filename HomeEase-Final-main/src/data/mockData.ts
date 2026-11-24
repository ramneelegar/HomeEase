import { Provider, Customer, Booking, Message, Notification } from '../types';

export const SERVICE_CATEGORIES = [
  {
    id: 'cleaning',
    icon: '🧹',
    label: 'Cleaning',
    desc: 'Deep cleaning, dusting & mopping',
    color: '#3B82F6', // Blue
  },
  {
    id: 'plumbing',
    icon: '🔧',
    label: 'Plumbing',
    desc: 'Pipe repairs, leaks & fittings',
    color: '#EF4444', // Red
  },
  {
    id: 'electrical',
    icon: '🔌',
    label: 'Electrical',
    desc: 'Wiring, appliances & fixtures',
    color: '#F59E0B', // Amber
  },
  {
    id: 'carpentry',
    icon: '🪚',
    label: 'Carpentry',
    desc: 'Furniture repair & installations',
    color: '#8B5CF6', // Violet
  },
  {
    id: 'painting',
    icon: '🎨',
    label: 'Painting',
    desc: 'Wall staining & house coats',
    color: '#10B981', // Emerald
  },
  {
    id: 'appliances',
    icon: '📺',
    label: 'Appliances',
    desc: 'AC service, TV & fridge repairs',
    color: '#EC4899', // Pink
  }
];

export const initialProviders: Provider[] = [
  {
    id: 'p_rakesh',
    name: 'Rakesh MT',
    email: 'rakeshmtawargeri0@gmail.com',
    phone: '1234567890',
    role: 'provider',
    category: 'electrical',
    experience: 5,
    rating: 4.9,
    reviewCount: 0,
    location: 'beng',
    pricing: 567,
    pricingType: 'hr',
    verified: true,
    completedJobs: 0,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    joinedDate: '2026-01-01',
    bio: 'No bio added yet. Click Edit Profile to add one.',
    portfolio: [],
    reviews: []
  },
  {
    id: 'p_arjun',
    name: 'Arjun Sharma',
    email: 'arjun.plumbing@gmail.com',
    phone: '+91 98765 43210',
    role: 'provider',
    category: 'plumbing',
    experience: 8,
    rating: 4.8,
    reviewCount: 34,
    location: 'Koramangala, Bengaluru',
    pricing: 400,
    pricingType: 'hr',
    verified: true,
    completedJobs: 142,
    bio: 'Expert plumbing technician. Specializes in fixing water leaks, premium bathroom fittings, pressure reduction devices and water line layouts.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    joinedDate: '2021-02-15',
    portfolio: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80'
    ],
    reviews: [
      { id: 'r1', customer: 'Amit Sharma', rating: 5, text: 'Arjun arrived within minutes of booking. Very professional and tidy.', date: '2026-06-10' }
    ]
  },
  {
    id: 'p_kavitha',
    name: 'Kavitha Reddy',
    email: 'kavitha.clean@gmail.com',
    phone: '+91 91234 56789',
    role: 'provider',
    category: 'cleaning',
    experience: 5,
    rating: 4.6,
    reviewCount: 22,
    location: 'Koramangala, Bengaluru',
    pricing: 800,
    pricingType: 'job',
    verified: true,
    completedJobs: 89,
    bio: 'Expert house cleaning provider. Equipped with deep extraction machines and environmentally-safe cleaning supplies to sanitize sofas, bathrooms, kitchens, or whole apartments.',
    availability: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    joinedDate: '2023-08-10',
    portfolio: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80'
    ],
    reviews: [
      { id: 'r3', customer: 'Demo Customer', rating: 5, text: 'Cleaned sofa and carpets perfectly! High standard of work.', date: '2024-03-20' }
    ]
  },
  {
    id: 'p_priya',
    name: 'Priya Menon',
    email: 'priya.paint@gmail.com',
    phone: '+91 90001 20002',
    role: 'provider',
    category: 'painting',
    experience: 7,
    rating: 4.7,
    reviewCount: 1,
    location: 'Koramangala, Bengaluru',
    pricing: 400,
    pricingType: 'hr',
    verified: true,
    completedJobs: 64,
    bio: 'Professional texture wall styles, solid emulsions, and anti-damp coatings. Pristine lines and quick turnaround.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    joinedDate: '2022-04-10',
    portfolio: [],
    reviews: []
  },
  {
    id: 'p_suresh',
    name: 'Suresh Kumar',
    email: 'suresh.carp@yahoo.com',
    phone: '+91 94455 66778',
    role: 'provider',
    category: 'carpentry',
    experience: 6,
    rating: 4.4,
    reviewCount: 18,
    location: 'Jayanagar, Bengaluru',
    pricing: 350,
    pricingType: 'hr',
    verified: false,
    completedJobs: 54,
    bio: 'Lock assemblies, cupboard alignment, and frame repair technician.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'],
    joinedDate: '2022-11-20',
    portfolio: [],
    reviews: []
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Demo Customer',
    email: 'customer@homease.com',
    phone: '9900112233',
    address: 'Koramangala, Bengaluru',
    role: 'customer'
  },
  {
    id: 'c2',
    name: 'Rakesh Tawargeri',
    email: 'rakeshmtawargeri07@gmail.com',
    phone: '+91 99887 76655',
    address: 'Flat 302, Green Glen Layout, Bellandur, Bengaluru, 560103',
    role: 'customer'
  },
  {
    id: 'admin',
    name: 'Platform Overseer (Admin)',
    email: 'admin@homease.com',
    phone: '+91 99999 88888',
    address: 'HomeEase HQ, MG Road, Bengaluru',
    role: 'admin',
    password: 'adminPassword2026'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'b1_demo',
    customerId: 'c1',
    providerId: 'p_kavitha',
    service: 'cleaning',
    amount: 800,
    date: '2024-03-20',
    time: '10:00 AM',
    address: 'Koramangala, Bengaluru',
    status: 'completed',
    notes: 'Full home deep cleaning'
  },
  {
    id: 'b2_demo',
    customerId: 'c1',
    providerId: 'p_rakesh',
    service: 'painting',
    amount: 237,
    date: '2026-05-14',
    time: '10:00 AM',
    address: 'Koramangala, Bengaluru',
    status: 'completed',
    notes: 'Full home wall coats'
  },
  {
    id: 'b3_demo',
    customerId: 'c1',
    providerId: 'p_rakesh',
    service: 'painting',
    amount: 237,
    date: '2026-04-01',
    time: '10:00 AM',
    address: 'Koramangala, Bengaluru',
    status: 'requested'
  }
];

export const initialMessages: Record<string, Message[]> = {
  'c1-p1': [
    {
      id: 'm1',
      senderId: 'c1',
      receiverId: 'p1',
      text: 'Hello Rajesh, I just requested a plumbing inspection for June 15th to fix a leaking valve. Do you have experience with pressure reduction taps?',
      timestamp: '2026-06-13T10:30:00.000Z',
      read: true
    },
    {
      id: 'm2',
      senderId: 'p1',
      receiverId: 'c1',
      text: 'Hello Rakesh! Yes, I have worked with multiple high-pressure systems in Bellandur apartment units. I have accepted your booking request, see you on Monday!',
      timestamp: '2026-06-13T10:45:00.000Z',
      read: false
    }
  ],
  'c1-p3': [
    {
      id: 'm3',
      senderId: 'c1',
      receiverId: 'p3',
      text: 'Thanks for finishing the patio socket job quickly! Safety feels solid now.',
      timestamp: '2026-06-12T15:20:00.000Z',
      read: true
    },
    {
      id: 'm4',
      senderId: 'p3',
      receiverId: 'c1',
      text: 'You are welcome! Always happy to help. Safe plugging ahead!',
      timestamp: '2026-06-12T15:30:00.000Z',
      read: true
    }
  ]
};

export const initialNotifications: Record<string, Notification[]> = {
  'c1': [
    {
      id: 'n1',
      type: 'booking_accepted',
      text: 'Your plumbing booking with Rajesh Kumar has been accepted!',
      time: '2026-06-13T10:45:00.000Z',
      read: false
    },
    {
      id: 'n2',
      type: 'booking_completed',
      text: 'Anil Deshmukh marked your electrical service booking as Completed. Please leave a review!',
      time: '2026-06-12T15:15:00.000Z',
      read: true
    }
  ],
  'p1': [
    {
      id: 'n3',
      type: 'booking_requested',
      text: 'New plumbing request from Rakesh Tawargeri for June 15th.',
      time: '2026-06-13T10:30:00.000Z',
      read: false
    }
  ],
  'p3': []
};
