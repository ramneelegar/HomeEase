import { createClient } from '@supabase/supabase-js';

const getSupabaseKeys = () => {
  const metaUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  const metaKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('VITE_SUPABASE_URL') : null;
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('VITE_SUPABASE_ANON_KEY') : null;

  return {
    url: metaUrl || localUrl || '',
    key: metaKey || localKey || ''
  };
};

const keys = getSupabaseKeys();
export const supabaseUrl = keys.url;
export const supabaseAnonKey = keys.key;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Lazy initialization if keys are present
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// SQL Script to create the required tables in Supabase
export const SUPABASE_SETUP_SQL = `-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'provider',
  category TEXT,
  experience INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  "reviewCount" INTEGER DEFAULT 0,
  location TEXT,
  pricing INTEGER,
  "pricingType" TEXT,
  verified BOOLEAN DEFAULT false,
  "completedJobs" INTEGER DEFAULT 0,
  bio TEXT,
  availability JSONB,
  "joinedDate" TEXT,
  portfolio JSONB,
  reviews JSONB
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer'
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  "customerId" TEXT,
  "providerId" TEXT,
  service TEXT,
  amount INTEGER,
  date TEXT,
  time TEXT,
  address TEXT,
  status TEXT,
  notes TEXT
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  "convId" TEXT,
  "senderId" TEXT,
  "receiverId" TEXT,
  text TEXT,
  timestamp TEXT,
  read BOOLEAN DEFAULT false
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  type TEXT,
  text TEXT,
  time TEXT NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Enable real-time replication for tables safely without duplicate member errors
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- 1. Bookings
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;

    -- 2. Messages
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;

    -- 3. Notifications
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END IF;
END $$;

-- Disable Row Level Security (RLS) to allow public access in dev mode
ALTER TABLE providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Fallback: If RLS is forced or re-enabled, ensure permissive policies allow all anonymous/authenticated actions
DROP POLICY IF EXISTS "permissive_all" ON providers;
CREATE POLICY "permissive_all" ON providers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permissive_all" ON customers;
CREATE POLICY "permissive_all" ON customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permissive_all" ON bookings;
CREATE POLICY "permissive_all" ON bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permissive_all" ON messages;
CREATE POLICY "permissive_all" ON messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permissive_all" ON notifications;
CREATE POLICY "permissive_all" ON notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

`;
