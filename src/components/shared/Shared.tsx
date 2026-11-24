import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { Bell, LogOut, User, Menu, X, ArrowLeft } from 'lucide-react';
import { SUPABASE_SETUP_SQL } from '../../lib/supabase';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export function StarRating({ rating, size = 14 }: StarRatingProps) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center space-x-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map(i => (
        <span 
          key={i} 
          style={{ fontSize: size }}
          className={i <= rounded ? 'font-serif text-amber-500' : 'font-serif text-stone-300'}
        >
          ★
        </span>
      ))}
    </span>
  );
}

interface StatusChipProps {
  status: 'requested' | 'accepted' | 'completed' | 'rejected';
}

export function StatusChip({ status }: StatusChipProps) {
  const configs = {
    requested: { label: '⏳ Requested', cls: 'bg-[#fffbeb] text-[#b45309] border-[#fef3c7]' },
    accepted: { label: '✓ Accepted', cls: 'bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]' },
    completed: { label: '✓ Completed', cls: 'bg-[#ecfdf5] text-[#047857] border-[#d1fae5]' },
    rejected: { label: '✕ Rejected', cls: 'bg-[#fef2f2] text-[#b91c1c] border-[#fee2e2]' }
  };
  
  const current = configs[status] || { label: status, cls: 'bg-stone-50 text-stone-700 border-stone-200' };
  
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold border leading-none ${current.cls}`}>
      {current.label}
    </span>
  );
}

interface SkeletonProps {
  w?: string;
  h?: number | string;
  mb?: number;
}

export function Skeleton({ w = '100%', h = 16, mb = 8 }: SkeletonProps) {
  return (
    <div 
      className="bg-stone-200 animate-pulse rounded-lg" 
      style={{ width: w, height: h, marginBottom: mb }} 
    />
  );
}

interface AvatarProps {
  name?: string;
  size?: number;
  url?: string;
}

export function Avatar({ name = 'User', size = 40, url }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  const colors = [
    'bg-indigo-500',
    'bg-rose-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-purple-500'
  ];
  const charCode = name?.charCodeAt(0) || 0;
  const colorClass = colors[charCode % colors.length] || 'bg-indigo-500';

  if (url) {
    return (
      <img 
        src={url} 
        alt={name} 
        referrerPolicy="no-referrer"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }} 
      />
    );
  }

  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-bold tracking-wider shrink-0 ${colorClass}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

interface NotificationDropdownProps {
  userId: string;
}

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const { notifications, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const userNotifs = notifications[userId] || [];
  const unread = userNotifs.filter(n => !n.read).length;
  
  const icons = { 
    booking_requested: '📋', 
    booking_accepted: '✅', 
    booking_rejected: '❌', 
    booking_completed: '🎉', 
    new_message: '💬' 
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => { 
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); 
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unread > 0) {
      markNotificationsRead(userId);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={handleOpen} 
        className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-all focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in origin-top-right">
          <div className="px-4 py-2 border-b border-stone-100 flex justify-between items-center">
            <span className="font-bold text-stone-900 text-sm">Notifications</span>
            {unread > 0 && (
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {unread} unread
              </span>
            )}
          </div>
          
          <div className="max-h-72 overflow-y-auto">
            {userNotifs.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-stone-400">
                All caught up! No recent alerts.
              </div>
            ) : (
              userNotifs.map(n => (
                <div 
                  key={n.id} 
                  className={`px-4 py-3 border-b border-stone-50 flex gap-3 text-left transition-all ${
                    n.read ? 'bg-white' : 'bg-indigo-50/30'
                  }`}
                >
                  <span className="text-lg shrink-0 select-none">
                    {icons[n.type as keyof typeof icons] || '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-stone-800 text-xs leading-relaxed ${n.read ? 'font-normal' : 'font-semibold'}`}>
                      {n.text}
                    </p>
                    <span className="text-[10px] text-stone-400 font-medium block mt-1">
                      {new Date(n.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { currentUser, logout, isSupabaseEnabled, dbSchemaError, triggerRefresh, isLoadingDb } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { 
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false); 
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
  };

  const handleManualSync = async () => {
    if (!isSupabaseEnabled || isLoadingDb || syncStatus === 'syncing') return;
    try {
      setSyncStatus('syncing');
      setStatusMessage('Syncing keys...');
      await triggerRefresh();
      setSyncStatus('success');
      setStatusMessage('Tables synchronized and seeded!');
      setTimeout(() => {
        setSyncStatus('idle');
        setStatusMessage('');
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setStatusMessage(err.message || 'Error parsing tables');
      setTimeout(() => {
        setSyncStatus('idle');
        setStatusMessage('');
      }, 4000);
    }
  };

  const navLinks = {
    customer: [
      { to: '/home', label: 'Browse' }, 
      { to: '/bookings', label: 'My Bookings' }, 
      { to: '/profile', label: 'Profile' }
    ],
    provider: [
      { to: '/provider-dashboard', label: 'Dashboard' }, 
      { to: '/provider-bookings', label: 'Bookings' }, 
      { to: '/provider-profile', label: 'Profile' }
    ],
    admin: [
      { to: '/admin', label: 'Admin Oversight' }
    ]
  };

  const links = currentUser ? (navLinks[currentUser.role as keyof typeof navLinks] || []) : [];

  const dbStatus = !isSupabaseEnabled 
    ? { text: 'Local DB', dotCls: 'bg-stone-400', pillCls: 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-150' }
    : dbSchemaError
    ? { text: 'Setup DB', dotCls: 'bg-amber-500 animate-pulse', pillCls: 'bg-amber-50 border-amber-200 text-amber-705' }
    : { text: 'Live DB', dotCls: 'bg-emerald-500', pillCls: 'bg-emerald-50 border-emerald-200 text-emerald-700' };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & DB Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link 
              to={currentUser?.role === 'provider' ? '/provider-dashboard' : currentUser?.role === 'admin' ? '/admin' : '/home'} 
              className="flex items-center space-x-2.5 hover:opacity-90 transition-all shrink-0"
            >
              <div className="w-9 h-9 bg-[#7c3aed] rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10 text-white font-bold text-lg select-none">
                🏠
              </div>
              <div>
                <span className="font-extrabold text-[#7c3aed] tracking-tight text-lg">HomeEase</span>
                <span className="text-[9px] text-stone-400 font-bold block -mt-1 uppercase tracking-wider">Expert Help</span>
              </div>
            </Link>

            {/* Supabase status badge */}
            <div className="relative group flex items-center">
              <button 
                onClick={handleManualSync}
                disabled={!isSupabaseEnabled || isLoadingDb || syncStatus === 'syncing'}
                title={isSupabaseEnabled ? "Click to manually seed initial records & re-sync with Supabase tables!" : "Local mock database active"}
                className={`flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wide uppercase leading-none select-none transition-all duration-200 ${dbStatus.pillCls} ${isSupabaseEnabled ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full inline-block ${isLoadingDb || syncStatus === 'syncing' ? 'animate-ping bg-indigo-500' : dbStatus.dotCls}`} />
                <span className="ml-1 hidden xs:inline">
                  {isLoadingDb || syncStatus === 'syncing' ? 'Syncing...' : dbStatus.text}
                </span>
                <span className="ml-1 inline xs:hidden">
                  {isLoadingDb || syncStatus === 'syncing' ? 'Sync' : dbStatus.text.split(' ')[0]}
                </span>
              </button>

              {/* Toast/Status Tooltip */}
              {statusMessage && (
                <div className={`absolute left-0 top-7 z-50 whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-semibold border shadow-lg transition-all transform animate-fade-in ${
                  syncStatus === 'success' ? 'bg-emerald-50 border-emerald-250 text-emerald-800' : 
                  syncStatus === 'error' ? 'bg-rose-50 border-rose-250 text-rose-800' : 'bg-indigo-50 border-indigo-250 text-indigo-800'
                }`}>
                  {statusMessage}
                </div>
              )}
            </div>
          </div>

          {/* Middling Navigation Links */}
          <div className="hidden md:flex space-x-1 bg-stone-50 p-1 rounded-full border border-stone-200/50">
            {links.map(l => {
              const active = location.pathname === l.to;
              const linkLabel = l.label === 'Browse' ? 'Browse' : l.label === 'My Bookings' ? 'My Bookings' : l.label;
              return (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active 
                      ? 'bg-[#f3e8ff] text-[#7c3aed] shadow-xs' 
                      : 'text-stone-500 hover:text-[#7c3aed] hover:bg-stone-100/50'
                  }`}
                >
                  {linkLabel}
                </Link>
              );
            })}
          </div>

          {/* Action buttons & User profile details */}
          <div className="flex items-center space-x-3.5">
            {currentUser ? (
              <>
                <NotificationDropdown userId={currentUser.id} />
                
                {/* Profile menu picker */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    className="flex items-center space-x-2 bg-stone-50 hover:bg-stone-100 p-1.5 rounded-xl border border-stone-200/60 cursor-pointer transition-all focus:outline-none"
                  >
                    <Avatar name={currentUser.name} size={30} url={currentUser.avatar} />
                    <span className="hidden sm:inline text-xs font-bold text-stone-800">
                      {currentUser.name?.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-stone-400 font-semibold select-none">▼</span>
                  </button>
                  
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-fade-in origin-top-right">
                      <div className="px-4 py-2.5 border-b border-stone-100 text-left">
                        <div className="text-xs font-bold text-stone-950 truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mt-0.5">{currentUser.role}</div>
                      </div>
                      
                      {links.map(l => (
                        <Link 
                          key={l.to} 
                          to={l.to} 
                          onClick={() => setMenuOpen(false)} 
                          className="block text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                          {l.label}
                        </Link>
                      ))}
                      
                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-stone-600 hover:text-indigo-600 hover:bg-stone-50 transition-all rounded-xl">
                  Log in
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/15 transition-all">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SupabaseStatusWidget() {
  const { isSupabaseEnabled, dbSchemaError, dbErrorText, isLoadingDb, triggerRefresh } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlInput, setUrlInput] = useState(localStorage.getItem('VITE_SUPABASE_URL') || '');
  const [keyInput, setKeyInput] = useState(localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '');
  const [saveStatus, setSaveStatus] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      setSaveStatus('Please enter both URL and Anon Key.');
      return;
    }
    localStorage.setItem('VITE_SUPABASE_URL', urlInput.trim());
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', keyInput.trim());
    setSaveStatus('Credentials saved! Rebooting connection...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClearKeys = () => {
    localStorage.removeItem('VITE_SUPABASE_URL');
    localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
    setUrlInput('');
    setKeyInput('');
    setSaveStatus('Cleared! Reverting to Local Server Mode...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      {/* Floating Status Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg border text-xs font-bold transition-all cursor-pointer transform hover:scale-105 ${
            !isSupabaseEnabled
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-300'
              : dbSchemaError
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}
        >
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              !isSupabaseEnabled ? 'bg-stone-400' : dbSchemaError ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              !isSupabaseEnabled ? 'bg-stone-500' : dbSchemaError ? 'bg-amber-600' : 'bg-emerald-600'
            }`}></span>
          </span>
          <span>
            {!isSupabaseEnabled
              ? '🔌 Supabase: Local Dev'
              : dbSchemaError
              ? '⚠️ Supabase: Tables Needed'
              : '⚡ Supabase: Live'}
          </span>
        </button>
      </div>

      {/* Setup Backdrop Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            {/* Header */}
            <div className={`p-5 text-white flex items-center justify-between ${
              !isSupabaseEnabled ? 'bg-stone-700' : dbSchemaError ? 'bg-amber-600' : 'bg-[#7c3aed]'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm tracking-tight uppercase">Supabase Integration Panel</h3>
                  <p className="text-[10px] text-white/85 font-medium">Real-Time Database Synchronizer</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/35 transition-all text-white font-bold text-xs w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-stone-850 text-left max-h-[70vh] overflow-y-auto">
              
              {/* STATUS INDICATOR CARD */}
              <div className="p-4 rounded-2xl border bg-stone-50 flex items-start gap-3">
                <span className="text-2xl mt-0.5 select-none">
                  {!isSupabaseEnabled ? '🔌' : dbSchemaError ? '⚠️' : '✅'}
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-stone-900">
                    Current Connection: {' '}
                    <span className="capitalize">
                      {!isSupabaseEnabled ? 'Local SQLite Mode' : dbSchemaError ? 'Tables Missing' : 'Online & Synchronized'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed font-semibold">
                    {!isSupabaseEnabled 
                      ? 'The application is running in default Offline/Local Memory state. To connect your Supabase DB, enter your credentials in the form below or declare VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY variables.'
                      : dbSchemaError
                      ? 'Your credentials are correct, but the PostgreSQL database tables do not exist yet! Paste the initialization SQL script into your Supabase SQL editor to enable database storage.'
                      : 'Connected directly to Supabase with real-time PostgreSQL replication channel! All bookings, reviews, messages, profiles and notifications are synced instantly across screens.'
                    }
                  </p>
                  
                  {dbErrorText && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl font-mono text-[10px] text-red-700 whitespace-pre-wrap select-all">
                      <strong className="block font-bold text-red-800 mb-1">🔌 PostgreSQL Error Signal:</strong>
                      {dbErrorText}
                    </div>
                  )}
                </div>
              </div>

              {/* CONNECTION FORM */}
              <div className="p-4 rounded-2xl border border-stone-200/80 bg-white/50 backdrop-blur-md shadow-xs space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                     API Keys / Credentials Link
                  </h4>
                  {isSupabaseEnabled ? (
                    <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                      Active
                    </span>
                  ) : (
                    <span className="text-[8px] font-extrabold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 uppercase tracking-wide">
                      Offline
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveKeys} className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="text"
                      className="w-full text-[10.5px] px-3 py-2 rounded-xl border border-stone-250 font-mono text-stone-800 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="https://your-project-id.supabase.co"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1">
                      Supabase Anon/Public API Key (JWT)
                    </label>
                    <input
                      type="password"
                      className="w-full text-[10.5px] px-3 py-2 rounded-xl border border-stone-250 font-mono text-stone-800 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="eyJhbGciOi..."
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                    />
                  </div>
                  
                  {saveStatus && (
                    <div className="text-[10px] font-extrabold text-indigo-600 animate-pulse">
                      {saveStatus}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-[10px] font-bold py-2 px-3 rounded-xl transition-all cursor-pointer"
                    >
                      Save & Connect
                    </button>
                    {(localStorage.getItem('VITE_SUPABASE_URL') || localStorage.getItem('VITE_SUPABASE_ANON_KEY')) && (
                      <button
                        type="button"
                        onClick={handleClearKeys}
                        className="bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 text-[10px] font-bold py-2 px-3 rounded-xl border border-rose-200 transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* INSTRUCTIONS */}
              <div>
                <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider mb-2">
                  1. How to Link your Supabase DB
                </h4>
                <ol className="list-decimal list-inside text-[11px] text-stone-605 space-y-1.5 font-bold pl-1">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:underline inline-flex items-center gap-0.5">supabase.com <span className="text-[9px]">↗</span></a> and sign in / compile a new project.</li>
                  <li>Copy your <strong className="text-stone-850">Project API URL</strong> and <strong className="text-stone-850">anon public API Key</strong>.</li>
                  <li>Enter them into the Credentials Link card above to connect instantly! Or optionally, write them to a local <strong className="text-stone-850">.env</strong> file.</li>
                </ol>
              </div>

              {/* SQL SCHEMAS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                    2. Table Initialization SQL Script
                  </h4>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#7c3aed] text-[10px] font-bold rounded-lg border border-[#e9d5ff] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{copied ? '✓ Copied' : '📋 Copy SQL'}</span>
                  </button>
                </div>
                
                <p className="text-[10px] text-stone-400 mb-2 font-medium">
                  Copy and execute this script inside your Supabase <strong className="text-stone-600">SQL Editor</strong> tab to instantiate all tables and enable real-time replication:
                </p>

                <div className="relative font-mono text-[9px] bg-stone-900 text-stone-300 p-3.5 rounded-xl max-h-40 overflow-y-auto select-all leading-normal whitespace-pre-wrap">
                  {SUPABASE_SETUP_SQL}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-150 flex items-center justify-between text-[11px] text-stone-400 font-semibold">
              <span>Status: {isLoadingDb ? 'Loading...' : 'Idle'}</span>
              <button 
                onClick={async () => {
                  await triggerRefresh();
                  setIsOpen(false);
                }}
                className="px-4 py-1.5 bg-[#7c3aed] text-white hover:bg-[#6d28d9] font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
