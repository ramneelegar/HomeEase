import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { StarRating, Avatar, StatusChip } from '../shared/Shared';
import { Booking, Customer, Provider } from '../../types';
import { Check, X, ShieldAlert, DollarSign, Calendar, Clock, MapPin, Sparkles, MessageCircle, Edit } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  customers: Customer[];
  currentUser: any;
}

export function BookingCard({ booking: b, customers, currentUser }: BookingCardProps) {
  const { updateBookingStatus } = useApp();
  const navigate = useNavigate();
  const customer = customers.find(c => c.id === b.customerId);
  const cat = SERVICE_CATEGORIES.find(c => c.id === b.service);
  const convId = `${b.customerId}-${currentUser.id}`;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 animate-fade-in">
      <div className="flex items-start gap-4 flex-1">
        <div className="text-4xl p-3 bg-stone-50 border rounded-2xl select-none shrink-0" style={{ backgroundColor: cat?.color ? `${cat.color}10` : undefined }}>
          {cat?.icon}
        </div>
        
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-stone-950 text-sm">{cat?.label} Job Appointment</span>
            <StatusChip status={b.status} />
          </div>

          {customer && (
            <div className="flex items-center gap-2 py-0.5">
              <Avatar name={customer.name} size={22} />
              <span className="text-xs font-bold text-stone-750">
                {customer.name}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {customer.phone}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-2 border-t border-stone-150/40 text-[11px] font-semibold text-stone-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Requested Day: {b.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Time Slot: {b.time}</span>
            </div>
            <div className="flex items-center gap-1 sm:col-span-2">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate max-w-[280px]">Residence: {b.address}</span>
            </div>
          </div>

          {b.notes && (
            <div className="mt-2 text-xs bg-stone-50 p-2.5 rounded-2xl border border-stone-150/40 text-stone-550 italic font-medium leading-relaxed">
              " {b.notes} "
            </div>
          )}
        </div>
      </div>

      {/* Action triggers depending on Booking conditions */}
      <div className="md:text-right flex md:flex-col justify-between items-center md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
        <div>
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block font-mono">Payout Net</span>
          <span className="text-lg font-black text-indigo-600">₹{b.amount}</span>
        </div>

        <div className="flex gap-2 font-bold text-xs">
          {b.status === 'requested' && (
            <>
              <button 
                onClick={() => updateBookingStatus(b.id, 'rejected')}
                className="px-3.5 py-2 hover:bg-rose-50 text-rose-600 rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline</span>
              </button>
              <button 
                onClick={() => updateBookingStatus(b.id, 'accepted')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow shadow-emerald-400/10 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Job</span>
              </button>
            </>
          )}

          {b.status === 'accepted' && (
            <button 
              onClick={() => updateBookingStatus(b.id, 'completed')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow shadow-indigo-400/15 flex items-center gap-1 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Job Completed</span>
            </button>
          )}

          {(b.status === 'accepted' || b.status === 'completed') && (
            <button 
              onClick={() => navigate(`/chat/${convId}/${b.customerId}`)}
              className="px-3.5 py-2 text-stone-605 bg-stone-50 border hover:bg-stone-100 rounded-xl hover:text-stone-850 transition-all flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-indigo-505" />
              <span>Message</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

export function ProviderDashboard() {
  const { currentUser, bookings, customers, providers } = useApp();
  const navigate = useNavigate();

  const myBookings = bookings.filter(b => b.providerId === currentUser?.id);
  const pending = myBookings.filter(b => b.status === 'requested');
  const active = myBookings.filter(b => b.status === 'accepted');
  const completed = myBookings.filter(b => b.status === "completed");
  const earnings = completed.reduce((sum, b) => sum + (b.amount || 0), 0);

  const provider = providers.find(p => p.id === currentUser?.id);

  const stats = [
    { label: 'Pending Invitations', val: pending.length, icon: '⏳', color: 'text-amber-600 border-amber-200 bg-amber-50' },
    { label: 'Active Jobs', val: active.length, icon: '🔧', color: 'text-indigo-600 border-indigo-200 bg-indigo-50' },
    { label: 'Completed Jobs', val: completed.length, icon: '✅', color: 'text-emerald-600 border-emerald-250 bg-emerald-50' },
    { label: 'Total Earnings', val: `₹${earnings.toLocaleString()}`, icon: '💰', color: 'text-blue-600 border-blue-200 bg-blue-50' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#2c2621]">
      
      {/* Visual Header Welcome block */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-850 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white mb-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <Avatar name={currentUser?.name} size={64} url={currentUser?.avatar} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
              Welcome back, {currentUser?.name?.split(' ')[0]}!
            </h1>
            <p className="text-[12.5px] text-indigo-250 font-medium mt-1">
              Active Category Specialty: <span className="font-bold underline">{SERVICE_CATEGORIES.find(c=>c.id===currentUser?.category)?.label || 'Service Provider'}</span> &bull; {currentUser?.location || 'Bengaluru'}
            </p>
            
            {provider && (
              <div className="flex items-center justify-center sm:justify-start gap-1 py-1 mt-1 font-semibold text-xs text-amber-300">
                <StarRating rating={provider.rating} size={11} />
                <span>Score: {provider.rating}</span>
                <span className="opacity-70">({provider.reviewCount} total scores)</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => navigate('/provider-profile')}
          className="px-4.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/25 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Adjust Profile Rate</span>
        </button>
      </div>

      {/* Grid statistics elements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => {
          const isEarnings = s.label.includes('Earnings');
          return (
            <div key={s.label} className={`border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 bg-white shadow-xs`}>
              <div className="text-2xl p-2 bg-stone-50 rounded-xl select-none shrink-0 border border-stone-100">
                {s.icon}
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider leading-none">
                  {s.label.split(' ')[0] === 'Pending' ? 'Pending' : s.label.split(' ')[0] === 'Completed' ? 'Completed' : s.label.split(' ')[0] === 'Total' ? 'Total' : s.label}
                </span>
                <p className="text-lg font-black font-mono tracking-tight text-stone-900 mt-1 leading-none">
                  {s.val}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* List display structures */}
      <div className="space-y-10">
        
        {/* PENDING requests */}
        <div>
          <h3 className="font-extrabold text-stone-900 text-base mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>⚡ Imminent Request Stream ({pending.length})</span>
          </h3>
          
          {pending.length === 0 ? (
            <div className="py-8 text-center bg-white border border-stone-200 rounded-3xl text-xs text-stone-400 font-medium">
              💡 No active schedulers requesting your help currently. Ensure your hourly pricing is competitive!
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map(b => (
                <BookingCard key={b.id} booking={b} customers={customers} currentUser={currentUser} />
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE accept queues */}
        <div>
          <h3 className="font-extrabold text-stone-900 text-base mb-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
            <span>🔧 Accepted Active Engagements ({active.length})</span>
          </h3>
          
          {active.length === 0 ? (
            <div className="py-8 text-center bg-white border border-stone-200 rounded-3xl text-stone-450 text-xs font-medium">
              All caught up! Accepting new requests populates this field automatically.
            </div>
          ) : (
            <div className="space-y-4">
              {active.map(b => (
                <BookingCard key={b.id} booking={b} customers={customers} currentUser={currentUser} />
              ))}
            </div>
          )}
        </div>

        {/* HISTORIC logs summaries */}
        {completed.length > 0 && (
          <div>
            <h3 className="font-extrabold text-stone-900 text-base mb-4">
              ✅ Recent Satisfied Bookings ({completed.length})
            </h3>
            
            <div className="space-y-4">
              {completed.slice(0, 3).map(b => (
                <BookingCard key={b.id} booking={b} customers={customers} currentUser={currentUser} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export function ProviderProfilePage() {
  const { currentUser, updateProviderProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [category, setCategory] = useState(currentUser?.category || 'cleaning');
  const [location, setLocation] = useState(currentUser?.location || 'Bengaluru');
  const [experience, setExperience] = useState(currentUser?.experience?.toString() || '0');
  const [pricing, setPricing] = useState(currentUser?.pricing?.toString() || '0');
  const [pricingType, setPricingType] = useState(currentUser?.pricingType || 'hr');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category,
      location: location.trim(),
      experience: Number(experience) || 0,
      pricing: Number(pricing) || 0,
      pricingType,
      bio: bio.trim(),
      avatar: avatar.trim()
    };
    
    updateProviderProfile(currentUser.id, updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cat = SERVICE_CATEGORIES.find(c => c.id === currentUser?.category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[#2c2621] animate-fade-in">
      <div className="pb-5 border-b border-stone-250/50 mb-8 sm:flex sm:items-center sm:justify-between text-center sm:text-left">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Your Service Provider Identity Card</h1>
          <p className="text-xs text-stone-500 font-medium mt-1">Refine operational specialties, bio resumes, hourly pricing models, and locations.</p>
        </div>
        {!editing ? (
          <button 
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Customize Resume Profile</span>
          </button>
        ) : (
          <div className="mt-4 sm:mt-0 flex gap-2 justify-center">
            <button 
              type="button"
              onClick={() => {
                setName(currentUser?.name || '');
                setEmail(currentUser?.email || '');
                setPhone(currentUser?.phone || '');
                setCategory(currentUser?.category || 'cleaning');
                setLocation(currentUser?.location || 'Bengaluru');
                setExperience(currentUser?.experience?.toString() || '0');
                setPricing(currentUser?.pricing?.toString() || '0');
                setPricingType(currentUser?.pricingType || 'hr');
                setBio(currentUser?.bio || '');
                setAvatar(currentUser?.avatar || '');
                setEditing(false);
              }}
              className="px-4 py-2 bg-stone-50 text-stone-500 hover:text-stone-800 text-xs font-bold rounded-xl border transition-all"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-6 bg-emerald-600 text-white p-3 rounded-2xl text-xs font-bold shadow-md animate-pulse">
          ✓ Resume profile metrics successfully re-synchronized with active search databases!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        
        {/* Left Form segment Block */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-stone-900 border-b pb-2.5 mb-4 text-xs uppercase tracking-wider">Account Particulars</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Live Profile Photo Showcase / Editor */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-150 mb-4 flex flex-col items-center text-center">
              <div className="mb-3">
                <Avatar name={editing ? name : currentUser?.name} size={72} url={editing ? avatar : currentUser?.avatar} />
              </div>
              
              {!editing ? (
                <div className="text-[11px] font-semibold text-stone-500">
                  Active Service Provider Photo
                </div>
              ) : (
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 text-center">Change Service Provider Photo</label>
                  
                  {/* Preset technician & provider options */}
                  <div className="flex justify-center gap-1.5 mb-3">
                    {[
                      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80', // Handyman/Plumber Pro
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', // Electrician Expert
                      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80', // Support Provider
                      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'  // Design/Consulting Pro
                    ].map((pUrl, pi) => (
                      <button
                        key={pi}
                        type="button"
                        onClick={() => setAvatar(pUrl)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                          avatar === pUrl ? 'border-indigo-600 scale-110 shadow-sm' : 'border-stone-200 opacity-75 hover:opacity-100'
                        }`}
                        title="Service Provider preset"
                      >
                        <img src={pUrl} className="w-full h-full object-cover" alt="preset" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-[9px] font-bold cursor-pointer transition-all ${
                        !avatar ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-110' : 'border-stone-200 bg-stone-50 text-stone-400 hover:text-stone-700'
                      }`}
                      title="Clear to initials"
                    >
                      Clear
                    </button>
                  </div>

                  <input 
                    type="url" 
                    placeholder="Or paste custom image web link..."
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    className="w-full text-[10px] px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900 leading-none font-mono"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 tracking-wider mb-1.5">Official Public Name</label>
              {editing ? (
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                />
              ) : (
                <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-800">{currentUser?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 tracking-wider mb-1.5">Official Email Credentials</label>
              {editing ? (
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                />
              ) : (
                <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-800">{currentUser?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 tracking-wider mb-1.5">Direct Cell Number</label>
              {editing ? (
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                />
              ) : (
                <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-800">{currentUser?.phone || '—'}</p>
              )}
            </div>
          </form>
        </div>

        {/* Right Form segment Block */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-stone-900 border-b pb-2.5 mb-4 text-xs uppercase tracking-wider">Professional Credentials</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 mb-1.5">Active Service Provider Category</label>
              {editing ? (
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                >
                  {SERVICE_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-850">
                  {cat?.icon} {cat?.label} Executive Speciality
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 mb-1.5">Active Operational Area</label>
                {editing ? (
                  <input 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                  />
                ) : (
                  <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-indigo-700">{currentUser?.location}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 mb-1.5">Years of Experience</label>
                {editing ? (
                  <input 
                    type="number" 
                    value={experience} 
                    onChange={e => setExperience(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                  />
                ) : (
                  <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-800">{currentUser?.experience} Years Active</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 mb-1.5">Rate Amount (₹)</label>
                {editing ? (
                  <input 
                    type="number" 
                    value={pricing} 
                    onChange={e => setPricing(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none "
                  />
                ) : (
                  <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-850">₹{currentUser?.pricing}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 mb-1.5">Rate Split Suffix</label>
                {editing ? (
                  <select 
                    value={pricingType} 
                    onChange={e => setPricingType(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                  >
                    <option value="hr">per hour</option>
                    <option value="job">fixed flat job</option>
                  </select>
                ) : (
                  <p className="text-xs font-bold py-2 px-3 bg-stone-50 rounded-xl border border-dotted border-stone-200 text-stone-800">per {currentUser?.pricingType === 'hr' ? 'hour' : 'flat job'}</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Professional BIO text area on bottom */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:col-span-2 shadow-xs">
          <h3 className="font-extrabold text-stone-905 border-b pb-2.5 mb-4 text-xs uppercase tracking-wider">Service Provider Resume Statement / Bio</h3>
          {editing ? (
            <textarea 
              rows={3} 
              value={bio} 
              onChange={e => setBio(e.target.value)}
              placeholder="Tell customers about brands used, safety protocols followed, etc..."
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900 leading-relaxed"
            />
          ) : (
            <p className="text-xs leading-relaxed text-stone-605 font-medium">{currentUser?.bio || 'This executive expert has years of stellar references, demonstrating high efficiency, complete service cleanliness, and professional standard billing operations.'}</p>
          )}
        </div>

        {/* Portfolio gallery section */}
        {currentUser?.portfolio && currentUser.portfolio.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:col-span-2 shadow-xs">
            <h3 className="font-extrabold text-stone-905 mb-4 text-xs uppercase tracking-wider">Portfolio Photo Submissions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentUser.portfolio.map((img: string, idx: number) => (
                <div key={idx} className="rounded-xl overflow-hidden border aspect-4/3">
                  <img src={img} alt={`work index ${idx+1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
