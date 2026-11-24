import React, { createContext, useContext, useState, useEffect } from 'react';
import { Provider, Customer, Booking, Message, Notification, AppUser, UserRole } from '../types';
import { initialProviders, initialCustomers, initialBookings, initialMessages, initialNotifications } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  providers: Provider[];
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  messages: Record<string, Message[]>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
  notifications: Record<string, Notification[]>;
  setNotifications: React.Dispatch<React.SetStateAction<Record<string, Notification[]>>>;
  searchHistory: string[];
  addSearchHistory: (val: string) => void;
  getRecommendations: (userId: string | undefined, limit: number) => Provider[];
  createBooking: (bookingData: any) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  sendMessage: (convId: string, senderId: string, receiverId: string, text: string) => void;
  markNotificationsRead: (userId: string) => void;
  updateProviderProfile: (providerId: string, updatedForm: any) => void;
  addReview: (providerId: string, newReview: any) => void;
  addBookingReview: (bookingId: string, providerId: string, rating: number, comment: string) => Promise<void>;
  reviewedBookingIds: string[];
  logout: () => void;
  loginUser: (email: string, password?: string) => boolean;
  signupUser: (name: string, email: string, phone: string, role: UserRole, extraDetails?: any) => boolean;
  
  // Supabase live states
  isSupabaseEnabled: boolean;
  dbSchemaError: boolean;
  dbErrorText: string | null;
  isLoadingDb: boolean;
  triggerRefresh: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Safe default start: unauthenticated so that they land on SignUp first as requested
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [notifications, setNotifications] = useState<Record<string, Notification[]>>(initialNotifications);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('reviewedBookingIds');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Supabase states
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [dbSchemaError, setDbSchemaError] = useState(false);
  const [dbErrorText, setDbErrorText] = useState<string | null>(null);

  // Debug help: let people shift roles or verify info
  useEffect(() => {
    console.log("Current User in Context updated:", currentUser);
  }, [currentUser]);

  const addSearchHistory = (val: string) => {
    if (!val.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== val.toLowerCase());
      return [val, ...filtered].slice(0, 5);
    });
  };

  const getRecommendations = (userId: string | undefined, limit: number) => {
    // Basic smart recommendation: Return highest rated verified providers first
    return [...providers]
      .sort((a, b) => {
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return b.rating - a.rating;
      })
      .slice(0, limit);
  };

  const loadAllData = async () => {
    if (!supabase) return;
    try {
      setIsLoadingDb(true);
      setDbSchemaError(false);
      setDbErrorText(null);
      
      const { data: provs, error: e1 } = await supabase.from('providers').select('*');
      if (e1) throw e1;
      
      const { data: custs, error: e2 } = await supabase.from('customers').select('*');
      if (e2) throw e2;

      const { data: bks, error: e3 } = await supabase.from('bookings').select('*');
      if (e3) throw e3;

      const { data: msgs, error: e4 } = await supabase.from('messages').select('*');
      if (e4) throw e4;

      const { data: notifs, error: e5 } = await supabase.from('notifications').select('*');
      if (e5) throw e5;

      // Set States
      if (provs && provs.length > 0) {
        setProviders(provs.map(p => ({
          ...p,
          availability: Array.isArray(p.availability) ? p.availability : (p.availability ? JSON.parse(JSON.stringify(p.availability)) : []),
          portfolio: Array.isArray(p.portfolio) ? p.portfolio : (p.portfolio ? JSON.parse(JSON.stringify(p.portfolio)) : []),
          reviews: Array.isArray(p.reviews) ? p.reviews : (p.reviews ? JSON.parse(JSON.stringify(p.reviews)) : [])
        })));
      }
      if (custs && custs.length > 0) {
        setCustomers(custs);
      }
      if (bks) {
        setBookings(bks);
      }
      
      if (msgs) {
        const groupedMsgs: Record<string, Message[]> = {};
        msgs.forEach((m: any) => {
          const cId = m.convId;
          if (!groupedMsgs[cId]) groupedMsgs[cId] = [];
          groupedMsgs[cId].push({
            id: m.id,
            senderId: m.senderId,
            receiverId: m.receiverId,
            text: m.text,
            timestamp: m.timestamp,
            read: m.read
          });
        });
        setMessages(groupedMsgs);
      }
      
      if (notifs) {
        const groupedNotifs: Record<string, Notification[]> = {};
        notifs.forEach((n: any) => {
          const uId = n.userId;
          if (!groupedNotifs[uId]) groupedNotifs[uId] = [];
          groupedNotifs[uId].push({
            id: n.id,
            type: n.type,
            text: n.text,
            time: n.time,
            read: n.read
          });
        });
        setNotifications(groupedNotifs);
      }
    } catch (err: any) {
      const isFetchError = err.message?.includes('fetch') || String(err).includes('fetch');
      if (isFetchError) {
        console.warn("Supabase network loading failed (using local fallback gracefully):", err.message || err);
      } else {
        console.warn("Supabase data load error:", err.message || err);
      }
      setDbErrorText(err.message || String(err));
      if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
        setDbSchemaError(true);
      }
    } finally {
      setIsLoadingDb(false);
    }
  };

  const seedDatabase = async () => {
    if (!supabase) return;
    try {
      setIsLoadingDb(true);
      setDbErrorText(null);
      // Check if tables are missing
      const { error: checkErr } = await supabase.from('providers').select('id', { count: 'exact', head: true });
      if (checkErr) {
        console.warn("Table verification failed - is the schema initialized?", checkErr);
        if (checkErr.message?.includes('relation') || checkErr.message?.includes('does not exist')) {
          setDbSchemaError(true);
        }
        throw new Error(`Table verification failed: ${checkErr.message}`);
      }
      setDbSchemaError(false);

      // 1. Seed providers (always upsert to guarantee referenced providers exist for foreign keys)
      console.log("Seeding providers...");
      const { error: provErr } = await supabase.from('providers').upsert(initialProviders);
      if (provErr) throw new Error(`Error seeding providers: ${provErr.message}`);

      // 2. Seed customers (always upsert to guarantee referenced customers exist for foreign keys)
      console.log("Seeding customers...");
      const { error: custErr } = await supabase.from('customers').upsert(initialCustomers);
      if (custErr) throw new Error(`Error seeding customers: ${custErr.message}`);

      // 3. Seed bookings
      console.log("Seeding bookings...");
      const { error: bookingErr } = await supabase.from('bookings').upsert(initialBookings);
      if (bookingErr) throw new Error(`Error seeding bookings: ${bookingErr.message}`);

      // 4. Seed messages
      console.log("Seeding messages...");
      const messagesList: any[] = [];
      Object.entries(initialMessages).forEach(([convId, list]) => {
        list.forEach(m => {
          messagesList.push({
            id: m.id,
            convId: convId,
            senderId: m.senderId,
            receiverId: m.receiverId,
            text: m.text,
            timestamp: m.timestamp,
            read: m.read
          });
        });
      });
      if (messagesList.length > 0) {
        const { error: msgErr } = await supabase.from('messages').upsert(messagesList);
        if (msgErr) throw new Error(`Error seeding messages: ${msgErr.message}`);
      }

      // 5. Seed notifications
      console.log("Seeding notifications...");
      const notificationsList: any[] = [];
      Object.entries(initialNotifications).forEach(([userId, list]) => {
        list.forEach(n => {
          notificationsList.push({
            id: n.id,
            userId: userId,
            type: n.type,
            text: n.text,
            time: n.time,
            read: n.read
          });
        });
      });
      if (notificationsList.length > 0) {
        const { error: notifErr } = await supabase.from('notifications').upsert(notificationsList);
        if (notifErr) throw new Error(`Error seeding notifications: ${notifErr.message}`);
      }
      
      console.log("Supabase seeding processed successfully!");
      
      // Load all data
      await loadAllData();
    } catch (err: any) {
      const isFetchError = err.message?.includes('fetch') || String(err).includes('fetch');
      const friendlyMsg = isFetchError 
        ? "Network connection to Supabase failed. Using offline local/state mode gracefully." 
        : (err.message || String(err));
      console.warn("Seeding operation warning (handled gracefully):", friendlyMsg, err);
      setDbErrorText(friendlyMsg);
      if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
        setDbSchemaError(true);
      }
      // Log connection error and fallback, do not re-throw fetch failures during startup
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      seedDatabase();
    }
  }, []);

  // Sync state back logic for Real-time subscription
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('realtime-db-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newB = payload.new as Booking;
            setBookings(prev => {
              if (prev.some(b => b.id === newB.id)) return prev;
              return [newB, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedB = payload.new as Booking;
            setBookings(prev => prev.map(b => b.id === updatedB.id ? updatedB : b));
          } else if (payload.eventType === 'DELETE') {
            const oldB = payload.old as { id: string };
            setBookings(prev => prev.filter(b => b.id !== oldB.id));
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newM = payload.new as any;
            const convId = newM.convId;
            const msgObj: Message = {
              id: newM.id,
              senderId: newM.senderId,
              receiverId: newM.receiverId,
              text: newM.text,
              timestamp: newM.timestamp,
              read: newM.read
            };
            setMessages(prev => {
              const currentList = prev[convId] || [];
              if (currentList.some(m => m.id === msgObj.id)) return prev;
              return {
                ...prev,
                [convId]: [...currentList, msgObj]
              };
            });
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newN = payload.new as any;
            const uId = newN.userId;
            const notifObj: Notification = {
              id: newN.id,
              type: newN.type,
              text: newN.text,
              time: newN.time,
              read: newN.read
            };
            setNotifications(prev => {
              const currentList = prev[uId] || [];
              if (currentList.some(n => n.id === notifObj.id)) return prev;
              return {
                ...prev,
                [uId]: [notifObj, ...currentList]
              };
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedN = payload.new as any;
            const uId = updatedN.userId;
            const notifObj: Notification = {
              id: updatedN.id,
              type: updatedN.type,
              text: updatedN.text,
              time: updatedN.time,
              read: updatedN.read
            };
            setNotifications(prev => {
              const currentList = prev[uId] || [];
              return {
                ...prev,
                [uId]: currentList.map(n => n.id === notifObj.id ? notifObj : n)
              };
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const createBooking = async (bookingData: any) => {
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      customerId: bookingData.customerId,
      providerId: bookingData.providerId,
      service: bookingData.service,
      amount: bookingData.amount,
      date: bookingData.date,
      time: bookingData.time,
      address: bookingData.address,
      status: 'requested',
      notes: bookingData.notes
    };

    setBookings(prev => [newBooking, ...prev]);

    // Push Notification to the provider
    const customer = customers.find(c => c.id === bookingData.customerId);
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      type: 'booking_requested',
      text: `New booking request from ${customer?.name || 'Customer'} for ${bookingData.date} at ${bookingData.time}.`,
      time: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => ({
      ...prev,
      [bookingData.providerId]: [newNotification, ...(prev[bookingData.providerId] || [])]
    }));

    if (supabase) {
      try {
        await supabase.from('bookings').insert({
          id: newBooking.id,
          customerId: newBooking.customerId,
          providerId: newBooking.providerId,
          service: newBooking.service,
          amount: newBooking.amount,
          date: newBooking.date,
          time: newBooking.time,
          address: newBooking.address,
          status: newBooking.status,
          notes: newBooking.notes
        });

        await supabase.from('notifications').insert({
          id: newNotification.id,
          userId: bookingData.providerId,
          type: newNotification.type,
          text: newNotification.text,
          time: newNotification.time,
          read: newNotification.read
        });
      } catch (err) {
        console.error("Error inserting booking/notification in Supabase:", err);
      }
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));

    // Get booking details for notification
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    let pNotifText = '';
    let notificationType: Notification['type'] = 'booking_accepted';

    const provider = providers.find(p => p.id === booking.providerId);

    if (status === 'accepted') {
      pNotifText = `Your service booking with ${provider?.name || 'Provider'} has been accepted!`;
      notificationType = 'booking_accepted';
    } else if (status === 'rejected') {
      pNotifText = `Your booking with ${provider?.name || 'Provider'} was declined.`;
      notificationType = 'booking_rejected';
    } else if (status === 'completed') {
      pNotifText = `${provider?.name || 'Provider'} marked your service as completed. Please write a review!`;
      notificationType = 'booking_completed';
    }

    if (pNotifText) {
      const newNotification: Notification = {
        id: `n${Date.now()}`,
        type: notificationType,
        text: pNotifText,
        time: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => ({
        ...prev,
        [booking.customerId]: [newNotification, ...(prev[booking.customerId] || [])]
      }));

      if (supabase) {
        try {
          await supabase.from('notifications').insert({
            id: newNotification.id,
            userId: booking.customerId,
            type: newNotification.type,
            text: newNotification.text,
            time: newNotification.time,
            read: newNotification.read
          });
        } catch (err) {
          console.error("Error inserting notification in Supabase:", err);
        }
      }
    }

    if (supabase) {
      try {
        await supabase.from('bookings').update({ status }).eq('id', bookingId);
      } catch (err) {
        console.error("Error updating booking status in Supabase:", err);
      }
    }
  };

  const sendMessage = async (convId: string, senderId: string, receiverId: string, text: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMessage]
    }));

    // Notify receiver
    const sender = customers.find(c => c.id === senderId) || providers.find(p => p.id === senderId);
    const newNotif: Notification = {
      id: `n_msg_${Date.now()}`,
      type: 'new_message',
      text: `New chat message from ${sender?.name}: "${text.length > 30 ? text.slice(0, 30) + '...' : text}"`,
      time: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => ({
      ...prev,
      [receiverId]: [newNotif, ...(prev[receiverId] || [])]
    }));

    if (supabase) {
      try {
        await supabase.from('messages').insert({
          id: newMessage.id,
          convId: convId,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          text: newMessage.text,
          timestamp: newMessage.timestamp,
          read: newMessage.read
        });

        await supabase.from('notifications').insert({
          id: newNotif.id,
          userId: receiverId,
          type: newNotif.type,
          text: newNotif.text,
          time: newNotif.time,
          read: newNotif.read
        });
      } catch (err) {
        console.error("Error inserting message in Supabase:", err);
      }
    }
  };

  const markNotificationsRead = async (userId: string) => {
    setNotifications(prev => {
      const userNotifs = prev[userId] || [];
      const updated = userNotifs.map(n => ({ ...n, read: true }));
      return { ...prev, [userId]: updated };
    });

    if (supabase) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('userId', userId).eq('read', false);
      } catch (err) {
        console.error("Error marking notifications read in Supabase:", err);
      }
    }
  };

  const updateProviderProfile = async (providerId: string, updatedForm: any) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, ...updatedForm } : p));
    if (currentUser?.id === providerId) {
      setCurrentUser((prev: any) => ({ ...prev, ...updatedForm }));
    }

    if (supabase) {
      try {
        await supabase.from('providers').update(updatedForm).eq('id', providerId);
      } catch (err) {
        console.error("Error updating provider profile in Supabase:", err);
      }
    }
  };

  const addReview = async (providerId: string, newReview: any) => {
    let updatedReviews: any[] = [];
    let avg = 5.0;

    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        updatedReviews = [newReview, ...p.reviews];
        // Recalculate rating
        const sum = updatedReviews.reduce((s, r) => s + r.rating, 0);
        avg = parseFloat((sum / updatedReviews.length).toFixed(1));
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: avg
        };
      }
      return p;
    }));

    if (supabase) {
      try {
        const { data } = await supabase.from('providers').select('reviews').eq('id', providerId).single();
        const currentReviews = data?.reviews ? (data.reviews as any[]) : [];
        const nextReviews = [newReview, ...currentReviews];
        const sum = nextReviews.reduce((s, r) => s + r.rating, 0);
        const nextAvg = parseFloat((sum / nextReviews.length).toFixed(1));

        await supabase.from('providers').update({
          reviews: nextReviews,
          reviewCount: nextReviews.length,
          rating: nextAvg
        }).eq('id', providerId);
      } catch (err) {
        console.error("Error updating reviews in Supabase:", err);
      }
    }
  };

  const addBookingReview = async (bookingId: string, providerId: string, rating: number, comment: string) => {
    const reviewId = `r${Date.now()}`;
    const newReview = {
      id: reviewId,
      customer: currentUser?.name || 'Customer',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    await addReview(providerId, newReview);

    // Track reviewed bookings
    setReviewedBookingIds(prev => {
      const next = [...prev, bookingId];
      try {
        localStorage.setItem('reviewedBookingIds', JSON.stringify(next));
      } catch (e) {
        console.error("Error saving reviewedBookingIds to localStorage:", e);
      }
      return next;
    });

    // Update bookings state
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, reviewed: true } : b));

    if (supabase) {
      try {
        await supabase.from('bookings').update({ reviewed: true }).eq('id', bookingId);
      } catch (err) {
        console.log("Supabase bookings.reviewed column update skipped or column does not exist:", err);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const loginUser = (email: string, password?: string): boolean => {
    // Check customers
    const matchedCustomer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (matchedCustomer) {
      if (password !== undefined) {
        const savedPassword = matchedCustomer.password || 'password123';
        if (savedPassword !== password) {
          return false;
        }
      }
      setCurrentUser(matchedCustomer);
      return true;
    }

    // Check providers
    const matchedProvider = providers.find(p => p.id === email || p.email.toLowerCase() === email.toLowerCase());
    if (matchedProvider) {
      if (password !== undefined) {
        const savedPassword = matchedProvider.password || 'password123';
        if (savedPassword !== password) {
          return false;
        }
      }
      setCurrentUser({
        ...matchedProvider,
        role: 'provider'
      });
      return true;
    }

    return false;
  };

  const signupUser = (name: string, email: string, phone: string, role: UserRole, extraDetails?: any): boolean => {
    const standardId = `u${Date.now()}`;
    if (role === 'provider') {
      const newProv: Provider = {
        id: standardId,
        name,
        email,
        phone,
        role: 'provider',
        category: extraDetails?.category || 'cleaning',
        experience: Number(extraDetails?.experience) || 2,
        rating: 5.0,
        reviewCount: 0,
        location: extraDetails?.location || 'Bengaluru',
        pricing: Number(extraDetails?.pricing) || 200,
        pricingType: extraDetails?.pricingType || 'hr',
        verified: false,
        completedJobs: 0,
        bio: extraDetails?.bio || 'Professional home utility service expert.',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        joinedDate: new Date().toISOString().split('T')[0],
        portfolio: [],
        reviews: [],
        password: extraDetails?.password
      };
      setProviders(prev => [newProv, ...prev]);
      setCurrentUser(newProv);

      if (supabase) {
        (async () => {
          const { error } = await supabase.from('providers').insert({
            id: newProv.id,
            name: newProv.name,
            email: newProv.email,
            phone: newProv.phone,
            role: newProv.role,
            category: newProv.category,
            experience: newProv.experience,
            rating: newProv.rating,
            reviewCount: newProv.reviewCount,
            location: newProv.location,
            pricing: newProv.pricing,
            pricingType: newProv.pricingType,
            verified: newProv.verified,
            completedJobs: newProv.completedJobs,
            bio: newProv.bio,
            availability: newProv.availability,
            joinedDate: newProv.joinedDate,
            portfolio: newProv.portfolio,
            reviews: newProv.reviews
          });
          if (error) {
            console.error("Error inserting provider in Supabase:", error);
          }
        })();
      }
    } else {
      const newCust: Customer = {
        id: standardId,
        name,
        email,
        phone,
        address: extraDetails?.address || '',
        role: role === 'admin' ? 'admin' : 'customer',
        password: extraDetails?.password
      };
      setCustomers(prev => [newCust, ...prev]);
      setCurrentUser(newCust);

      if (supabase) {
        (async () => {
          const { error } = await supabase.from('customers').insert({
            id: newCust.id,
            name: newCust.name,
            email: newCust.email,
            phone: newCust.phone,
            address: newCust.address,
            role: newCust.role
          });
          if (error) {
            console.error("Error inserting customer/admin in Supabase:", error);
          }
        })();
      }
    }
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      providers, setProviders,
      customers, setCustomers,
      bookings, setBookings,
      messages, setMessages,
      notifications, setNotifications,
      searchHistory, addSearchHistory,
      getRecommendations,
      createBooking,
      updateBookingStatus,
      sendMessage,
      markNotificationsRead,
      updateProviderProfile,
      addReview,
      addBookingReview,
      reviewedBookingIds,
      logout,
      loginUser,
      signupUser,
      
      // Supabase context props
      isSupabaseEnabled: isSupabaseConfigured,
      dbSchemaError,
      dbErrorText,
      isLoadingDb,
      triggerRefresh: seedDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
