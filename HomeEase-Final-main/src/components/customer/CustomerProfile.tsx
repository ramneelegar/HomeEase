import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../shared/Shared';
import { BadgeCheck, ShieldAlert, Phone, Mail, Home, Edit, CheckCircle } from 'lucide-react';

export function CustomerProfile() {
  const { currentUser, setCurrentUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are mandatory account identifiers.');
      return;
    }

    setCurrentUser((prev: any) => ({
      ...prev,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      avatar: avatar.trim()
    }));

    setEditing(false);
    setSaved(true);
    setError('');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[#2c2621] animate-fade-in">
      <div className="pb-6 border-b border-stone-200 mb-8 sm:flex sm:items-center sm:justify-between text-center sm:text-left">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Your Account Credentials</h1>
          <p className="text-xs text-stone-500 font-medium mt-1">Manage contact coordinates, coordinates, and secure location delivery addresses.</p>
        </div>
        {!editing ? (
          <button 
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all focus:outline-none"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile Info</span>
          </button>
        ) : (
          <div className="mt-4 sm:mt-0 flex gap-2 justify-center">
            <button 
              type="button"
              onClick={() => {
                setName(currentUser?.name || '');
                setPhone(currentUser?.phone || '');
                setEmail(currentUser?.email || '');
                setAddress(currentUser?.address || '');
                setAvatar(currentUser?.avatar || '');
                setEditing(false);
                setError('');
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
              Save Account Changes
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-6 bg-emerald-600 text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Account changes successfully synchronized with HomeEase platform!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-rose-50 text-rose-750 py-3 px-4 rounded-2xl text-xs font-semibold border border-rose-200 flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card Left panel */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 text-center shadow-xs md:h-fit">
          <div className="flex justify-center mb-4">
            <Avatar name={currentUser?.name} size={84} url={editing ? avatar : currentUser?.avatar} />
          </div>
          
          <h3 className="font-extrabold text-stone-900 text-base flex justify-center items-center gap-1">
            <span>{currentUser?.name}</span>
            <BadgeCheck className="w-4.5 h-4.5 text-indigo-600 shrink-0 fill-indigo-100" />
          </h3>
          <p className="text-[10px] text-stone-400 font-bold font-mono tracking-wider uppercase mt-0.5">
            Verified {currentUser?.role} account
          </p>

          {editing && (
            <div className="mt-4 pt-4 border-t border-stone-100 text-left">
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 text-center">Customize Profile Photo</label>
              
              {/* Preset selection circles */}
              <div className="flex justify-between gap-1 mb-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
                ].map((pUrl, pi) => (
                  <button
                    key={pi}
                    type="button"
                    onClick={() => setAvatar(pUrl)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                      avatar === pUrl ? 'border-indigo-600 scale-110 shadow-sm' : 'border-stone-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={pUrl} className="w-full h-full object-cover" alt="preset" referrerPolicy="no-referrer" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-[9px] font-bold cursor-pointer transition-all ${
                    !avatar ? 'border-indigo-600 bg-indigo-50 text-indigo-600 scale-110' : 'border-stone-200 bg-stone-50 text-stone-400 hover:text-stone-700'
                  }`}
                  title="Clear to initials"
                >
                  Clear
                </button>
              </div>

              <input 
                type="url" 
                placeholder="Or paste any image link..."
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full text-[10px] px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900 leading-none font-mono"
              />
            </div>
          )}
          
          {currentUser?.address ? (
            <div className="mt-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-150/40 text-[11px] font-semibold text-stone-500 flex items-start gap-1.5 text-left leading-relaxed">
              <Home className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>{currentUser.address}</span>
            </div>
          ) : (
            <span className="text-[10px] text-stone-300 font-bold block mt-4 bg-stone-50 p-2 rounded-xl">
              No delivery address specified.
            </span>
          )}
        </div>

        {/* Form panel Center-Right column */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:col-span-2 shadow-xs">
          <h4 className="font-extrabold text-stone-950 text-sm mb-5 pb-2.5 border-b border-stone-100 uppercase tracking-wide">
            Detailed Coordinates
          </h4>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Profile Identifier Name</label>
                {editing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                  />
                ) : (
                  <div className="py-2.5 px-3.5 bg-stone-50/50 text-xs font-bold text-stone-750 rounded-xl border border-dotted">
                    {currentUser?.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Contact Direct Line</label>
                {editing ? (
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                  />
                ) : (
                  <div className="py-2.5 px-3.5 bg-stone-50/50 text-xs font-bold text-stone-750 rounded-xl border border-dotted flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{currentUser?.phone || '—'}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">E-mail credentials</label>
              {editing ? (
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                />
              ) : (
                <div className="py-2.5 px-3.5 bg-stone-50/50 text-xs font-bold text-stone-750 rounded-xl border border-dotted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser?.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Delivery & Service Location Address</label>
              {editing ? (
                <textarea 
                  rows={3} 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Your full delivery/service coordinate address..."
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-500 text-stone-900"
                />
              ) : (
                <div className="py-2.5 px-3.5 bg-stone-50/50 text-xs font-bold text-stone-750 rounded-xl border border-dotted min-h-[64px] leading-relaxed">
                  {currentUser?.address || 'Click Edit Profile Info to specify your residence address.'}
                </div>
              )}
            </div>

            {editing && (
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all focus:outline-none"
                >
                  Save Account Changes
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
