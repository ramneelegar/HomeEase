import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { Sparkles, Shield, User, Hammer, Check, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Empty by default
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please specify both an email and a password.');
      return;
    }
    const success = loginUser(email.trim(), password.trim());
    if (success) {
      navigate('/');
    } else {
      setError('Incorrect email or password. Try our instant demo accounts below!');
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    if (demoEmail === 'admin@homease.com') {
      setEmail(demoEmail);
      setPassword('');
      setError('Admin email selected. Please enter the confidential administrator password manually to authenticate.');
      return;
    }
    setEmail(demoEmail);
    setPassword('password123'); // Autofill matching demo password
    const success = loginUser(demoEmail, 'password123');
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-[#2c2621]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/60 p-8 relative overflow-hidden animate-fade-in">
        
        {/* Graphic accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl text-indigo-600 mb-3 text-2xl shadow-inner">
            🏠
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Welcome to HomeEase</h2>
          <p className="text-xs text-stone-500 mt-1">Access verified home service providers in Bengaluru</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-250/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input 
                type="email" 
                placeholder="yourname@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full text-sm pl-11 pr-4 py-3 bg-stone-50/60 border border-stone-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-stone-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full text-sm pl-4 pr-11 py-3 bg-stone-50/60 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm tracking-wide transition-all shadow-lg shadow-indigo-600/15 cursor-pointer mt-2"
          >
            Authenticate Profile
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-stone-400">New to our network? </span>
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Register an Account
          </Link>
        </div>

        {/* Demo Quick Accounts Section */}
        <div className="mt-8 pt-6 border-t border-stone-150">
          <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3 text-center">
            ⚡ Quick-Login Interactive Demos:
          </h4>
          
          <div className="space-y-2">
            {[
              { role: 'Customer', name: 'Rakesh (Owner)', email: 'rakeshmtawargeri07@gmail.com', bg: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100/70 border-indigo-200' },
              { role: 'Provider', name: 'Arjun (Plumber)', email: 'arjun.plumbing@gmail.com', bg: 'bg-amber-50 text-amber-700 hover:bg-amber-100/70 border-amber-200' },
              { role: 'Provider', name: 'Rakesh MT (Electrician)', email: 'rakeshmtawargeri0@gmail.com', bg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border-emerald-200' },
              { role: 'Admin', name: 'System Admin Oversight', email: 'admin@homease.com', bg: 'bg-stone-100 text-stone-700 hover:bg-stone-200/75 border-stone-300' }
            ].map(pill => (
              <button
                key={pill.email}
                onClick={() => handleQuickLogin(pill.email)}
                type="button"
                className={`w-full text-left px-3.5 py-2 rounded-xl border text-[11.5px] font-semibold flex items-center justify-between transition-all cursor-pointer ${pill.bg}`}
              >
                <span>{pill.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-wide scale-90 p-0.5 px-2 bg-white/70 rounded-md">
                  {pill.role}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export function SignupPage() {
  const { signupUser } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState<'customer' | 'provider' | 'admin'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Provider details
  const [category, setCategory] = useState('cleaning');
  const [experience, setExperience] = useState('3');
  const [pricing, setPricing] = useState('250');
  const [pricingType, setPricingType] = useState('hr');
  const [location, setLocation] = useState('Koramangala, Bengaluru');
  const [bio, setBio] = useState('');
  
  // Customer details
  const [address, setAddress] = useState('');
  
  // Admin details
  const [adminPasscode, setAdminPasscode] = useState('');

  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Please fill all standard required fields (including password).');
      return;
    }

    if (role === 'admin') {
      if (adminPasscode.trim() !== 'HOMEASE-ADMIN-2026') {
        setError('Verification Failed: Incorrect Admin Authorization Code. Only authorized personnel may register.');
        return;
      }
    }

    const extraDetails = role === 'provider' 
      ? { category, experience, pricing, pricingType, location, bio, password: password.trim() }
      : { address, password: password.trim() };

    const success = signupUser(name.trim(), email.trim(), phone.trim(), role, extraDetails);
    if (success) {
      navigate('/');
    } else {
      setError('Technical error creating profile.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-[#2c2621]">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-200/60 p-8 relative overflow-hidden animate-fade-in">
        
        {/* Top visual graphic line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Create your Profile</h2>
          <p className="text-xs text-stone-500 mt-1">Join Bengaluru's top utility services marketplace</p>
        </div>

        {/* Toggle Role Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-stone-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 px-1 rounded-xl text-[10.5px] font-bold tracking-tight flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'customer' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`py-2 px-1 rounded-xl text-[10.5px] font-bold tracking-tight flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'provider' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Provider</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 px-1 rounded-xl text-[10.5px] font-bold tracking-tight flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'admin' 
                ? 'bg-indigo-600 text-white shadow-sm font-black' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin 🛡️</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200.60 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-905"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Contact Number *</label>
              <input 
                type="tel" 
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Email Address *</label>
            <input 
              type="email" 
              placeholder="yourname@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Password *</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full text-sm pl-4 pr-11 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            
            {/* Show Password explicit option */}
            <div className="flex items-center gap-2 mt-1.5 select-none text-[11.5px] font-semibold text-stone-550 text-stone-500">
              <input 
                type="checkbox" 
                id="show-signup-password-cb"
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
                className="w-3.5 h-3.5 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
              <label htmlFor="show-signup-password-cb" className="cursor-pointer hover:text-stone-700">
                Show Password
              </label>
            </div>
          </div>

          {/* CUSTOMER PROFILE DETAIL */}
          {role === 'customer' && (
            <div className="animate-fade-in">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Delivery & Service Address</label>
              <textarea 
                rows={2}
                placeholder="Flat No, Apartment, Sector, Area Name, Pin Code"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
              />
            </div>
          )}

          {/* SECURITY CLEARANCE PASSCODE (ADMIN CAP) */}
          {role === 'admin' && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl animate-fade-in space-y-3">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Security Clearance Verification Required</span>
              </div>
              <p className="text-[10px] text-indigo-700 leading-normal font-medium">
                Creating an oversight profile requires entering the confidential platform master passcode.
              </p>
              <div>
                <label className="block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1">Confidential Master Passcode *</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={adminPasscode}
                  onChange={e => { setAdminPasscode(e.target.value); setError(''); }}
                  className="w-full text-xs px-4 py-2.5 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-950 font-mono"
                  required
                />
              </div>
            </div>
          )}

          {/* PROVIDER DETAIL */}
          {role === 'provider' && (
            <div className="space-y-4 border-t border-stone-150 pt-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Service Specialty *</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                  >
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Experience (Years) *</label>
                  <input 
                    type="number" 
                    min="0"
                    max="50"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Rate Amount (₹)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={pricing}
                      onChange={e => setPricing(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Split Type</label>
                    <select 
                      value={pricingType}
                      onChange={e => setPricingType(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                    >
                      <option value="hr">per hour</option>
                      <option value="job">fixed job</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Operational Area *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Koramangala, Bengaluru"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Short Professional Bio</label>
                <textarea 
                  rows={2}
                  placeholder="Tell customers about your work style, brands used, etc..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-stone-900"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm tracking-wide transition-all shadow-lg shadow-indigo-600/15 cursor-pointer mt-2"
          >
            Complete Registration
          </button>
        </form>

        <div className="mt-5 text-center text-xs">
          <span className="text-stone-400">Already linked to us? </span>
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}
