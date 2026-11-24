import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { StatusChip, Avatar } from '../shared/Shared';
import { Booking } from '../../types';
import { Calendar, Clock, MapPin, MessageCircle, AlertCircle, ShoppingBag, Star, X } from 'lucide-react';

export function CustomerBookings() {
  const { bookings, currentUser, providers, addBookingReview, reviewedBookingIds } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  // Review System Modal State
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const myBookings = bookings.filter(b => b.customerId === currentUser?.id);
  const filtered = filter === 'all' ? myBookings : myBookings.filter(b => b.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[#2c2621] animate-fade-in">
      <div className="pb-6 border-b border-stone-200 mb-6 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">My Bookings</h1>
        <p className="text-xs text-stone-400 font-semibold mt-1">Track all your service requests</p>
      </div>

      {/* Tabs list filter bar */}
      <div className="flex mb-6 overflow-x-auto scrollbar-hide gap-1.5">
        {[
          { id: 'all', label: 'All' },
          { id: 'requested', label: 'Requested' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'completed', label: 'Completed' },
          { id: 'rejected', label: 'Rejected' }
        ].map(tabs => {
          const active = filter === tabs.id;
          return (
            <button 
              key={tabs.id} 
              onClick={() => setFilter(tabs.id)}
              className={`py-1.5 px-4 font-bold text-xs rounded-full transition-all whitespace-nowrap cursor-pointer border ${
                active 
                  ? 'bg-[#f3e8ff] border-[#f3e8ff] text-[#7c3aed] shadow-xs' 
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-850 hover:bg-stone-50'
              }`}
            >
              {tabs.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center shadow-xs">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-extrabold text-stone-900 text-sm">No bookings match the filters</h3>
          <p className="text-xs text-stone-450 mt-1.5 max-w-xs mx-auto mb-5">
            Book trusted plumbers, cleaners, and appliance service providers instantly under our directory tab!
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Browse Technicians →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b: Booking) => {
            const provider = providers.find(p => p.id === b.providerId);
            const cat = SERVICE_CATEGORIES.find(c => c.id === b.service);
            const convId = `${currentUser.id}-${b.providerId}`;
            const headerLabel = cat?.id === 'appliances' ? 'Appliance Repair' : cat?.label;
            
            return (
              <div 
                key={b.id} 
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:border-indigo-150 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-4xl p-3.5 bg-stone-50 border border-stone-200/50 rounded-2xl select-none shrink-0" style={{ backgroundColor: cat?.color ? `${cat.color}10` : undefined }}>
                    {cat?.icon}
                  </div>
                  
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-stone-950 text-sm">{headerLabel}</span>
                      <StatusChip status={b.status} />
                    </div>
                    
                    {provider && (
                      <div className="flex items-center gap-2 py-0.5">
                        <Avatar name={provider.name} size={18} />
                        <span className="text-xs font-bold text-stone-800 hover:underline cursor-pointer" onClick={() => navigate(`/provider/${provider.id}`)}>
                          {provider.name}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1.5 border-t border-stone-100 text-[11px] font-bold text-stone-500 items-center">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Date: {b.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Time: {b.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[220px]">Location: {b.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-400 font-bold shrink-0">💳</span>
                        <span>Price: ₹{b.amount}</span>
                      </div>
                    </div>
                    
                    {b.notes && (
                      <div className="mt-2 bg-[#f9fafb] p-3 rounded-2xl border border-stone-100 text-xs text-stone-550 font-bold leading-relaxed flex items-center gap-1.5">
                        <span>{cat?.icon}</span>
                        <span>{b.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right buttons edge */}
                <div className="flex md:flex-col gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100 items-end justify-end shrink-0">
                  <div className="flex gap-2.5 font-bold text-xs flex-wrap md:flex-nowrap justify-end">
                    {provider && (
                      <button 
                        onClick={() => navigate(`/provider/${provider.id}`)}
                        className="px-4 py-2 text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-all font-bold cursor-pointer"
                      >
                        View Provider
                      </button>
                    )}
                    {(b.status === 'accepted' || b.status === 'completed') && (
                      <button 
                        onClick={() => navigate(`/chat/${convId}/${b.providerId}`)}
                        className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Chat</span>
                      </button>
                    )}
                    
                    {b.status === 'completed' && (
                      reviewedBookingIds?.includes(b.id) || b.reviewed ? (
                        <div className="px-3.5 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1 select-none">
                          <span>Reviewed</span>
                          <span className="text-emerald-650">★</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setReviewingBooking(b);
                            setRating(5);
                            setComment('');
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>Write Review</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Dialog/Modal System */}
      {reviewingBooking && (() => {
        const provider = providers.find(p => p.id === reviewingBooking.providerId);
        const ratingLabels: Record<number, string> = {
          1: 'Poor service 😞',
          2: 'Fair service 😐',
          3: 'Good service 🙂',
          4: 'Very good service 😀',
          5: 'Excellent service! 🌟'
        };

        return (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
            <div className="bg-white max-w-md w-full rounded-3xl border border-stone-200 overflow-hidden shadow-2xl p-6 relative animate-scale-in">
              <button 
                type="button"
                onClick={() => setReviewingBooking(null)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <h3 className="font-extrabold text-stone-900 text-base">Write a Review</h3>
                <p className="text-xs text-stone-450 mt-1">
                  How was your experience with <span className="font-extrabold text-stone-850">{provider?.name || 'the service provider'}</span>?
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  await addBookingReview(reviewingBooking.id, reviewingBooking.providerId, rating, comment.trim());
                  setReviewingBooking(null);
                } catch (err) {
                  console.error(err);
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-5">
                
                {/* Star Select Area */}
                <div className="text-center p-3.5 bg-stone-50 rounded-2xl border border-stone-105">
                  <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">Your Rating</span>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isActive = rating >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className="transform hover:scale-125 transition-all text-3xl select-none cursor-pointer focus:outline-none focus:scale-125"
                        >
                          <span className={isActive ? 'text-amber-500' : 'text-stone-300'}>★</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs font-bold text-amber-600 mt-2.5">
                    {ratingLabels[rating]}
                  </p>
                </div>

                {/* Comment area */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Share Details</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the job went. Was the technician respectful? Did they fix the issue completely? Anything else to highlight?"
                    className="w-full text-xs px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white text-stone-900 leading-relaxed font-semibold transition-all shadow-inner placeholder-stone-400 block resize-none"
                  />
                </div>

                {/* Cancel / Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewingBooking(null)}
                    className="flex-1 py-3 border border-stone-200 text-stone-605 font-bold text-xs rounded-xl hover:bg-stone-50 hover:text-stone-850 transition-all cursor-pointer block text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all cursor-pointer block text-center"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
