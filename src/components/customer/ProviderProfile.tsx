import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { StarRating, Avatar } from '../shared/Shared';
import { Provider } from '../../types';
import { ArrowLeft, Check, Award, Calendar, CircleDollarSign, Plus, Eye, MessageSquareCode } from 'lucide-react';

interface BookingModalProps {
  provider: Provider;
  onClose: () => void;
  onBook: (formData: { date: string; time: string; address: string; notes: string }) => void;
}

function BookingModal({ provider, onClose, onBook }: BookingModalProps) {
  const { currentUser } = useApp();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const times = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', 
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];
  
  // Safe date select
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Preferred date is mandatory.');
      return;
    }
    if (!address.trim()) {
      setError('Service delivery address is mandatory.');
      return;
    }
    onBook({ date, time, address: address.trim(), notes: notes.trim() });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200/40 w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-fade-in relative">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-stone-950">Book Schedule</h3>
            <p className="text-[11px] text-stone-400 font-semibold">{provider.name} • {SERVICE_CATEGORIES.find(c=>c.id===provider.category)?.label}</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200 cursor-pointer text-xs font-bold font-mono text-stone-500"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 text-rose-700 text-xs font-medium p-2.5 rounded-xl border border-rose-200">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">When do you need help? *</label>
            <input 
              type="date" 
              min={today} 
              value={date} 
              onChange={e => { setDate(e.target.value); setError(''); }} 
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-stone-900"
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Preferred Slot Hour *</label>
            <select 
              value={time} 
              onChange={e => setTime(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none"
            >
              {times.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Service Address *</label>
            <input 
              type="text"
              placeholder="Flat No, Sector, Landmark, Location Pin" 
              value={address} 
              onChange={e => { setAddress(e.target.value); setError(''); }} 
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Additional job notes / details</label>
            <textarea 
              rows={2} 
              placeholder="e.g. Please bring extra screws, AC makes a clicking sound..." 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-indigo-500 text-stone-900"
            />
          </div>

          {/* Pricing total preview */}
          <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4 font-semibold text-xs text-stone-700">
            <h4 className="font-bold text-stone-950 mb-2">Billing Breakdown</h4>
            <div className="flex justify-between mb-1.5 text-stone-500">
              <span>Service Estimate Rate</span>
              <span>₹{provider.pricing} / {provider.pricingType}</span>
            </div>
            <div className="flex justify-between mb-2 pb-2 border-b border-indigo-100/50 text-stone-500">
              <span>Platform Service Surcharge</span>
              <span className="text-emerald-600 font-bold">FREE (Demo)</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-stone-950">
              <span>Payable Rate</span>
              <span className="text-indigo-600">₹{provider.pricing}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-stone-500 hover:text-stone-800 text-xs font-bold bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              📋 Confirm Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ReviewModalProps {
  onClose: () => void;
  onSubmit: (reviewData: { rating: number; text: string }) => void;
}

function ReviewModal({ onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please click a star to give a rating score.');
      return;
    }
    if (!text.trim()) {
      setError('Please express write-up details about your experience.');
      return;
    }
    onSubmit({ rating, text: text.trim() });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-stone-200/40 w-full max-w-sm p-6 shadow-xl animate-fade-in relative text-[#2c2621]">
        <h3 className="font-extrabold text-stone-900 text-base mb-1">Write your Experience Feedback</h3>
        <p className="text-[11px] text-stone-400 font-semibold mb-4">Your rating scores directly refine the service provider\'s overall verification weight.</p>
        
        {error && (
          <div className="mb-3 p-2 bg-rose-50 text-rose-700 text-xs font-medium rounded-xl border border-rose-200">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Rating Score (1-5 Stars) *</label>
            <div className="flex items-center gap-2 text-2xl select-none">
              {[1, 2, 3, 4, 5].map(i => (
                <span 
                  key={i} 
                  className="cursor-pointer transition-all hover:scale-110 active:scale-95" 
                  style={{ color: i <= (hover || rating) ? '#F59E0B' : '#D1D5DB' }}
                  onMouseEnter={() => setHover(i)} 
                  onMouseLeave={() => setHover(0)} 
                  onClick={() => { setRating(i); setError(''); }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Written Review *</label>
            <textarea 
              rows={3} 
              placeholder="What specifically did you appreciate? Explain their professionalism, equipment, and cleanliness..." 
              value={text} 
              onChange={e => { setText(e.target.value); setError(''); }} 
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
              required
            />
          </div>

          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Broadcast Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProviderProfileView() {
  const { id } = useParams();
  const { providers, currentUser, createBooking, addReview, bookings } = useApp();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [booked, setBooked] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const provider = providers.find(p => p.id === id);
  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#2c2621]">
        <div className="text-3xl mb-2">😕</div>
        <h3 className="font-extrabold text-stone-950">Expert Service Provider profile not located</h3>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl">
          ← Return to Directory
        </button>
      </div>
    );
  }

  const cat = SERVICE_CATEGORIES.find(c => c.id === provider.category);
  
  // Safe completed jobs verification for review creation
  const hasCompletedBooking = bookings.some(
    b => b.customerId === currentUser?.id && b.providerId === id && b.status === 'completed'
  );
  
  const convId = currentUser?.id && provider.id ? `${currentUser.id}-${provider.id}` : null;

  const handleBook = (formData: any) => {
    createBooking({ 
      customerId: currentUser.id, 
      providerId: id, 
      service: provider.category, 
      amount: provider.pricing, 
      ...formData 
    });
    setShowBooking(false);
    setBooked(true);
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  const handleReview = (reviewData: any) => {
    addReview(id, { 
      id: `r${Date.now()}`, 
      customer: currentUser.name, 
      ...reviewData, 
      date: new Date().toISOString().split('T')[0] 
    });
    setShowReview(false);
  };

  return (
    <div className="animate-fade-in text-[#2c2621] max-w-4xl mx-auto px-4 py-8">
      
      {/* Return link */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-all cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Service Providers</span>
      </button>

      {/* Main Hero Header Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 relative">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-indigo-600 rounded-t-3xl" style={{ backgroundColor: cat?.color }}></div>
        
        <div className="text-6xl p-5 rounded-2xl shrink-0 select-none" style={{ background: `${cat?.color}15` }}>
          {cat?.icon}
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-stone-900 leading-tight">{provider.name}</h1>
            {provider.verified && (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold tracking-wider px-2 py-0.5 border border-emerald-200 rounded-md">
                ✓ VERIFIED
              </span>
            )}
          </div>
          
          <p className="text-xs font-semibold text-stone-500 mt-1">
            {cat?.label} Service Provider &bull; {provider.experience} Years Active Work Experience
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
            <div className="flex items-center gap-1">
              <StarRating rating={provider.rating} size={12} />
              <span className="text-xs font-bold text-stone-800">{provider.rating}</span>
              <span className="text-[11px] text-stone-400">({provider.reviewCount} Reviews)</span>
            </div>
            
            <span className="text-xs text-stone-400 font-bold font-mono">
              📍 {provider.location.split(',')[0]}
            </span>
            
            <span className="text-xs text-stone-400 font-bold font-mono">
              💼 {provider.completedJobs} Jobs Accomplished
            </span>
          </div>
        </div>

        {/* Pricing tag & book controls */}
        <div className="text-center sm:text-right shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-100 w-full sm:w-auto">
          <div className="mb-3.5">
            <span className="text-xs font-semibold text-stone-400">Estimate Pricing: </span>
            <span className="text-2xl font-black text-indigo-600 block sm:inline">₹{provider.pricing}</span>
            <span className="text-xs text-stone-400">/{provider.pricingType}</span>
          </div>

          {currentUser?.role === 'customer' ? (
            <div className="flex sm:flex-col gap-2 justify-center">
              {convId && (
                <button 
                  onClick={() => navigate(`/chat/${convId}/${provider.id}`)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-1 shrink-0"
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Chat with Service Provider</span>
                </button>
              )}
              <button 
                onClick={() => setShowBooking(true)}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                📋 Book and Schedule
              </button>
            </div>
          ) : !currentUser ? (
            <button 
              onClick={() => navigate('/login')}
              className="w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Sign In to Schedule
            </button>
          ) : (
            <span className="text-xs text-stone-400 font-bold block bg-stone-100 px-3 py-1.5 rounded-lg border">
              Provider Mode Enabled
            </span>
          )}
        </div>
      </div>

      {booked && (
        <div className="mb-6 bg-emerald-600 text-white p-3.5 rounded-2xl font-bold text-xs text-center shadow-md animate-pulse">
          🎉 Booking request successfully submitted! Syncing profile to schedule queue...
        </div>
      )}

      {/* Profile Detail Navigation tabs */}
      <div className="flex border-b border-stone-200/80 mb-6 gap-2">
        {(['about', 'portfolio', 'reviews'] as const).map(tabName => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`py-2.5 px-4 font-bold text-xs tracking-wider uppercase transition-all whitespace-nowrap border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === tabName
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-450 hover:text-stone-800'
            }`}
          >
            {tabName === 'about' ? '👤 Professional Bio' : tabName === 'portfolio' ? '🖼️ Work Portfolio' : `⭐ Reviews (${provider.reviews.length})`}
          </button>
        ))}
      </div>

      {/* Tab Panels */}

      {/* ABOUT */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6">
              <h3 className="font-extrabold text-stone-900 text-sm mb-3">About Service Provider</h3>
              <p className="text-xs text-stone-605 leading-relaxed font-medium">
                {provider.bio || 'This executive expert has years of stellar references, demonstrating high efficiency, complete service cleanliness, and professional standard billing operations.'}
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6">
              <h3 className="font-extrabold text-[#2c1d11] text-sm mb-3">Active availability</h3>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const available = provider.availability?.includes(day);
                  return (
                    <span 
                      key={day} 
                      className={`text-[10.5px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        available 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold' 
                          : 'bg-stone-50 text-stone-300 border-stone-150/40'
                      }`}
                    >
                      {day} {available ? '✓' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5">
              <h4 className="font-extrabold text-[#1a1410] text-xs mb-3 uppercase tracking-wider">Background Summary</h4>
              {[
                { label: 'Platform Tenure', val: `Joined ${provider.joinedDate?.split('-')[0] || '2021'}` },
                { label: 'Accomplished", list', val: `${provider.completedJobs} bookings` },
                { label: 'Star Rating', val: `${provider.rating} / 5.0 Star` },
                { label: 'Locality Base', val: provider.location.split(',')[0] },
              ].map((s, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-stone-150/55 last:border-b-0 text-xs font-semibold">
                  <span className="text-stone-400">{idx === 1 ? 'Jobs completed' : s.label}</span>
                  <span className="text-stone-850">{s.val}</span>
                </div>
              ))}
            </div>

            {hasCompletedBooking && (
              <button 
                onClick={() => setShowReview(true)}
                className="w-full py-3 text-xs bg-stone-100 border border-indigo-200 hover:border-indigo-500 text-indigo-600 hover:text-indigo-800 font-bold rounded-2xl hover:bg-indigo-50/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <span>⭐ Write Profile Review</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="animate-fade-in bg-white border border-stone-200 rounded-3xl p-6">
          <h3 className="font-extrabold text-stone-900 text-sm mb-4">Past job documentation photo portfolio</h3>
          
          {provider.portfolio && provider.portfolio.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {provider.portfolio.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setLightbox(img)}
                  className="rounded-2xl overflow-hidden cursor-pointer relative group aspect-4/3 border"
                >
                  <img 
                    src={img} 
                    alt={`Work layout reference ${idx+1}`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <span className="p-2 bg-white rounded-full text-stone-800 shadow shadow-stone-950/20">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-400 text-xs">
              🖼 No historical photos uploaded to this profile yet.
            </div>
          )}
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6">
            <h3 className="font-extrabold text-stone-900 text-sm mb-1">Customer Reviews ({provider.reviews.length})</h3>
            <p className="text-[11px] text-stone-400 font-semibold">Genuine customer verification history.</p>
          </div>

          {provider.reviews.length === 0 ? (
            <div className="py-12 text-center bg-white border border-stone-200 rounded-2xl text-stone-400 text-xs font-medium">
              ⭐ Be the first customer to log a completed service review for this service provider!
            </div>
          ) : (
            <div className="space-y-4">
              {provider.reviews.map(r => (
                <div key={r.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-inner/5 transition-all hover:border-stone-250">
                  <div className="flex items-center gap-3 mb-2.5">
                    <Avatar name={r.customer} size={32} />
                    <div>
                      <h5 className="text-xs font-bold text-stone-950">{r.customer}</h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={r.rating} size={10} />
                        <span className="text-[10px] text-stone-400 font-mono">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Portfolio Large Lightbox */}
      {lightbox && (
        <div 
          className="fixed inset-0 bg-stone-955/85 backdrop-blur-xs flex items-center justify-center z-50 p-4" 
          onClick={() => setLightbox(null)}
        >
          <img 
            src={lightbox} 
            alt="Work portfolio item detail" 
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-stone-200/10" 
          />
        </div>
      )}

      {showBooking && (
        <BookingModal 
          provider={provider} 
          onClose={() => setShowBooking(false)} 
          onBook={handleBook} 
        />
      )}
      {showReview && (
        <ReviewModal 
          onClose={() => setShowReview(false)} 
          onSubmit={handleReview} 
        />
      )}

    </div>
  );
}
