import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, Users, CheckCircle, Calendar, DollarSign, Hammer, 
  X, RefreshCw, Sliders, Settings, UserCheck, AlertCircle, 
  TrendingUp, Search, Trash2, Filter, Sparkles, Check, AlertTriangle
} from 'lucide-react';

export function AdminPage() {
  const { 
    providers, setProviders, 
    customers, setCustomers,
    bookings, setBookings, 
    triggerRefresh 
  } = useApp();

  // Search, filter & tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'bookings' | 'settings'>('overview');
  const [providerSearch, setProviderSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'requested' | 'accepted' | 'completed' | 'rejected'>('all');
  
  // Custom interactive systems state
  const [platformCommission, setPlatformCommission] = useState(15); // Percentage
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  
  // Interactive Live Event Ticker Logs
  const [logs, setLogs] = useState<Array<{ id: string; time: string; type: 'info' | 'success' | 'alert'; text: string }>>([
    { id: 'l1', time: '06:18 AM', type: 'success', text: 'System diagnostics clean. Supabase state synchronized.' },
    { id: 'l2', time: '06:12 AM', type: 'info', text: 'Daily database background validation of 12 provider licenses passed.' },
    { id: 'l3', time: '06:01 AM', type: 'alert', text: 'Incoming system routing integrity verified.' }
  ]);
  const [newEventText, setNewEventText] = useState('');

  // 1. Stats Metrics
  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    const averageRating = providers.length > 0
      ? (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
      : '0.0';
    const verifiedProviders = providers.filter(p => p.verified).length;

    return {
      totalBookings,
      totalRevenue,
      averageRating,
      verifiedProviders,
      totalCustomers: customers.length,
      totalProviders: providers.length
    };
  }, [bookings, providers, customers]);

  // 2. Verified Toggle
  const toggleProviderVerification = (id: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.verified;
        // Seed log text
        addLiveLog('success', `Specialist ${p.name}'s official verification status is now ${nextState ? 'VERIFIED ✓' : 'UNVERIFIED ✕'}`);
        return { ...p, verified: nextState };
      }
      return p;
    }));
  };

  // 3. Delete Provider
  const removeProvider = (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to suspend/remove provider "${name}" from the active workspace?`)) {
      setProviders(prev => prev.filter(p => p.id !== id));
      addLiveLog('alert', `Provider profile "${name}" has been administratively suspended.`);
    }
  };

  // 4. Update Booking status dynamically
  const changeBookingStatus = (bookingId: string, nextStatus: 'requested' | 'accepted' | 'completed' | 'rejected') => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        addLiveLog('info', `Booking #${bookingId} status manually updated to ${nextStatus.toUpperCase()} by Administrator.`);
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  // 5. Add custom simulated log event
  const addLiveLog = (type: 'info' | 'success' | 'alert', text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      { id: 'log_' + Date.now() + Math.random(), time: timeStr, type, text },
      ...prev.slice(0, 19) // Limit to 20 logs
    ]);
  };

  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventText.trim()) return;
    addLiveLog('info', newEventText.trim());
    setNewEventText('');
  };

  // Filter lists
  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(providerSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => 
    bookingFilter === 'all' ? true : b.status === bookingFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-[#2c2621]">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-indigo-950 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl border border-stone-850">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 text-2xl shadow-inner">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">System Admin Panel</h1>
                <span className="bg-indigo-505 bg-indigo-600 text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-black text-white">
                  Oversight
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-xl">
                Real-time marketplace oversight controls: verify operational credentials, coordinate active booking states, adjust global fee sliders, and simulate live events.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              addLiveLog('success', 'Triggered full Supabase synchronization reload.');
              triggerRefresh?.();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 active:bg-white/5 border border-white/20 hover:border-white/30 text-xs font-semibold rounded-xl tracking-wide transition-all select-none cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4 text-indigo-300" />
            <span>Trigger DB Sync</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-200 pb-3">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Sparkles },
          { id: 'providers', label: `Manage Providers (${providers.length})`, icon: Hammer },
          { id: 'bookings', label: `Platform Bookings (${bookings.length})`, icon: Calendar },
          { id: 'settings', label: 'Platform Configuration', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                active 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'bg-white hover:bg-stone-105 border border-stone-220 text-stone-600 hover:text-stone-900 border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ADMIN TABS ROUTER */}

      {/* 1. OVERVIEW SCREEN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main stats block */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Volume</span>
                  <DollarSign className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div className="text-xl font-bold text-stone-900">₹{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>Interactive gross amount booked</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Providers</span>
                  <Hammer className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div className="text-xl font-semibold text-stone-900">
                  {stats.verifiedProviders} <span className="text-stone-400 text-sm font-medium">/ {stats.totalProviders}</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-1">Verified specialist profile count</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Clients</span>
                  <Users className="w-4.5 h-4.5 text-indigo-500" />
                </div>
                <div className="text-xl font-semibold text-stone-900">{stats.totalCustomers}</div>
                <div className="text-[10px] text-stone-400 mt-1">Customers registered in database</div>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 block">🛠️ Quick Platform Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const nextMode = !maintenanceMode;
                    setMaintenanceMode(nextMode);
                    addLiveLog('alert', `Simulated global maintenance lock turned ${nextMode ? 'ON' : 'OFF'}.`);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${
                    maintenanceMode 
                      ? 'bg-amber-50 border-amber-300 text-amber-800' 
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    <span>Simulate Maintenance Lock</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${maintenanceMode ? 'bg-amber-200' : 'bg-stone-200/80'}`}>
                    {maintenanceMode ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setProviders(prev => prev.map(p => ({ ...p, verified: true })));
                    addLiveLog('success', 'Mass administrative verified sweep executed! All active provider credentials approved.');
                  }}
                  className="w-full px-4 py-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-left text-stone-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verify All Registered Providers</span>
                </button>
              </div>
            </div>

            {/* System configuration variables summary */}
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200/50">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-2">
                <Sliders className="w-4.5 h-4.5 text-indigo-600" />
                <span>Global Financial Split Constants</span>
              </div>
              <p className="text-xs text-indigo-700 leading-relaxed mb-4">
                Administrators set the official platform commission constants applied to services. Interactive custom commission rate set at: <strong>{platformCommission}%</strong>.
              </p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  value={platformCommission}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPlatformCommission(val);
                    addLiveLog('info', `Platform global commission rate altered to ${val}%.`);
                  }}
                  className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <span className="text-xs font-extrabold text-indigo-950 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shrink-0">
                  {platformCommission}%
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Event Logger & Simulate Section */}
          <div className="space-y-6">
            <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-stone-400">Live Workspace Event Ticker</h3>
                </div>
                <button 
                  onClick={() => {
                    setLogs([
                      { id: 'l_manual', time: 'SYSTEM', type: 'info', text: 'Logs cleared' }
                    ]);
                  }}
                  className="text-[10px] text-stone-500 hover:text-stone-300 transition-all font-bold"
                >
                  Clear Feed
                </button>
              </div>

              {/* Event input trigger */}
              <form onSubmit={handleCreateCustomEvent} className="mb-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Simulate a custom platform log event..."
                    value={newEventText}
                    onChange={(e) => setNewEventText(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-500 rounded-xl focus:outline-none focus:border-stone-500 font-mono"
                  />
                  <button 
                    type="submit" 
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-xl transition-all select-none cursor-pointer shrink-0"
                  >
                    Simulate
                  </button>
                </div>
              </form>

              {/* Log stream ticker */}
              <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-6 text-stone-600 font-mono text-xs">No administrative actions logged yet...</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="text-[11px] font-mono leading-relaxed border-b border-stone-850 pb-2">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] font-bold text-stone-500">{log.time}</span>
                        <span className={`text-[9px] uppercase font-black px-1.5 rounded ${
                          log.type === 'success' ? 'bg-emerald-900/40 text-emerald-450 text-emerald-400' :
                          log.type === 'alert' ? 'bg-rose-900/40 text-rose-450 text-rose-400' : 'bg-indigo-900/40 text-indigo-400'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <p className="text-stone-300">{log.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Demo Database State Info Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
              <h4 className="text-xs font-bold text-stone-700 mb-2">💡 Interactive Admin Guide</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                As the main Platform Overseer, you are running inside a secure sandbox role. Toggling statuses and approvals here will cascade immediately through the other customers and providers databases seamlessly in your local runtime memory!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 2. PROVIDERS TAB */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          
          {/* List Search Banner */}
          <div className="p-5 border-b border-stone-150 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-800">Master Service Providers</h3>
              <p className="text-xs text-stone-400">Total registered freelancers in Bengaluru hub</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search name, Category specialty..."
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-stone-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-150 text-[10px] font-bold text-stone-400 uppercase tracking-wider select-none">
                  <th className="py-3 px-6">Name & Speciality</th>
                  <th className="py-3 px-5">Operational Area</th>
                  <th className="py-3 px-5">Base Rate (₹)</th>
                  <th className="py-3 px-5 text-center">Rating</th>
                  <th className="py-3 px-5 text-center">Verification Badge</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 font-medium text-stone-400 italic">No service providers found mapping your search...</td>
                  </tr>
                ) : (
                  filteredProviders.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/40 transition-all font-medium">
                      
                      {/* Name specialty */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9.5 h-9.5 rounded-xl bg-indigo-50/80 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.verified && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 rounded-sm uppercase tracking-wide">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-400 select-none uppercase tracking-wide font-semibold mt-0.5 mt-0.5">
                              ⚡ {p.category} Speciality
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location operational */}
                      <td className="py-4 px-5 text-stone-605 text-stone-700">
                        {p.location}
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-5">
                        <span className="font-bold text-stone-900">₹{p.pricing}</span>
                        <span className="text-stone-405 text-stone-500 font-normal"> / {p.pricingType === 'hr' ? 'hr' : 'job'}</span>
                      </td>

                      {/* rating */}
                      <td className="py-4 px-5 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/50 text-amber-705 text-amber-805 px-2 py-0.5 rounded-lg text-[11px] font-black">
                          ⭐️ {p.rating.toFixed(1)}
                        </div>
                        <div className="text-[9px] text-stone-400 mt-0.5">{p.reviewCount} total reviews</div>
                      </td>

                      {/* verified */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => toggleProviderVerification(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-wide select-none cursor-pointer transition-all ${
                            p.verified 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                              : 'bg-stone-50 border-stone-200 text-stone-450 hover:bg-stone-100'
                          }`}
                        >
                          <Check className={`w-3 h-3 ${p.verified ? 'opacity-100 text-emerald-500' : 'opacity-40'}`} />
                          <span>{p.verified ? 'Verified Active' : 'Mark Verified'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProvider(p);
                              addLiveLog('info', `Opened profile audit viewer for provider ${p.name}.`);
                            }}
                            className="bg-stone-50 border border-stone-200 text-stone-600 hover:text-indigo-600 hover:bg-indigo-50/50 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Audit Profile
                          </button>
                          
                          <button
                            onClick={() => removeProvider(p.id, p.name)}
                            title="Suspend provider"
                            className="text-stone-300 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Audit Drawer Modal */}
          {selectedProvider && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
              <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-300 shadow-2xl relative overflow-hidden text-left p-6">
                
                {/* banner style */}
                <div className="absolute top-0 inset-x-0 h-2 bg-indigo-600"></div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-indigo-600" />
                    <h3 className="font-extrabold text-[#7c3aed] text-sm">Professional Verification Audit</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedProvider(null)}
                    className="p-1 rounded-full text-stone-450 hover:bg-stone-100 text-stone-505 transition-all cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs text-stone-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-lg select-none">
                      {selectedProvider.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-950 text-sm">{selectedProvider.name}</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{selectedProvider.category} &bull; Joined {selectedProvider.joinedDate}</p>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl space-y-1.5 border border-stone-150">
                    <div><strong>Email:</strong> <span className="font-mono text-[11px]">{selectedProvider.email}</span></div>
                    <div><strong>Phone:</strong> {selectedProvider.phone}</div>
                    <div><strong>Experience:</strong> {selectedProvider.experience} years active</div>
                    <div><strong>Pricing:</strong> ₹{selectedProvider.pricing} / {selectedProvider.pricingType}</div>
                    <div><strong>Verification Badge:</strong> {selectedProvider.verified ? 'APPROVED (VALIDIDATED)' : 'PENDING'}</div>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-stone-900 text-xs mb-1">Professional Bio</h5>
                    <p className="p-3 bg-stone-50/50 rounded-xl leading-relaxed italic border border-stone-100">{selectedProvider.bio || "No professional overview bio provided."}</p>
                  </div>

                  {/* Verifiable Action buttons */}
                  <div className="flex gap-2.5 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => {
                        toggleProviderVerification(selectedProvider.id);
                        setSelectedProvider(prev => (prev ? { ...prev, verified: !prev.verified } : null));
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-bold tracking-wide text-xs transition-all cursor-pointer ${
                        selectedProvider.verified 
                          ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-205'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10'
                      }`}
                    >
                      {selectedProvider.verified ? 'Revoke Verification' : 'Verify Credentials Now'}
                    </button>
                    
                    <button
                      onClick={() => setSelectedProvider(null)}
                      className="px-5 py-2.5 bg-stone-100 hover:bg-stone-150 text-stone-700 rounded-xl font-bold text-xs cursor-pointer transition-all"
                    >
                      Close Audit
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. BOOKINGS OVERVIEW TAB */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          
          {/* List Search Banner */}
          <div className="p-5 border-b border-stone-150 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-800">Operational Platform Bookings</h3>
              <p className="text-xs text-stone-400 font-medium">All real-time customer and job booking request transactions</p>
            </div>

            {/* Filter statuses */}
            <div className="flex gap-1.5 bg-stone-100/80 p-1 rounded-xl border border-stone-200/20 max-w-sm w-full sm:max-w-auto">
              {['all', 'requested', 'accepted', 'completed', 'rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st as any)}
                  className={`flex-1 px-2 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                    bookingFilter === st 
                      ? 'bg-white text-indigo-600 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left font-medium border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-150 text-[10px] font-bold text-stone-404 text-stone-400 uppercase tracking-wider select-none">
                  <th className="py-3 px-6">ID & Date</th>
                  <th className="py-3 px-5">Client Info</th>
                  <th className="py-3 px-5">Provider speciality</th>
                  <th className="py-3 px-5">Job Rate Total</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-6 text-right">Oversight state action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 font-bold text-stone-430 text-stone-400 italic">No corresponding bookings exist for selected status filter...</td>
                  </tr>
                ) : (
                  filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50/30 transition-all">
                      
                      <td className="py-4 px-6 text-stone-600 font-bold text-xs val-middle">
                        <div className="font-bold text-indigo-700">#{b.id}</div>
                        <div className="text-[10px] text-stone-400 mt-1 font-mono font-medium">
                          📅 {b.date} &bull; {b.time}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-bold text-stone-900">
                          {customers.find(c => c.id === b.customerId)?.name || `Client (#${b.customerId.slice(0,4)})`}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate mt-0.5 max-w-[150px]">{b.address}</div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-bold text-stone-900">
                          {providers.find(p => p.id === b.providerId)?.name || `Expert (#${b.providerId.slice(0,4)})`}
                        </div>
                        <div className="text-[10px] text-stone-450 uppercase tracking-widest font-semibold mt-0.5">{b.service}</div>
                      </td>

                      <td className="py-4 px-5 font-bold text-stone-950 text-xs">
                        ₹{b.amount}
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          b.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          b.status === 'accepted' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                          b.status === 'rejected' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                          'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                          <button
                            onClick={() => changeBookingStatus(b.id, 'accepted')}
                            title="Accept booking"
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer ${
                              b.status === 'accepted' 
                                ? 'bg-indigo-600 text-white shadow-xs' 
                                : 'hover:bg-stone-200 text-stone-600'
                            }`}
                          >
                            Accept
                          </button>
                          
                          <button
                            onClick={() => changeBookingStatus(b.id, 'completed')}
                            title="Complete booking"
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer ${
                              b.status === 'completed' 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : 'hover:bg-stone-200 text-stone-600'
                            }`}
                          >
                            Complete
                          </button>

                          <button
                            onClick={() => changeBookingStatus(b.id, 'rejected')}
                            title="Reject/Cancel booking"
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer ${
                              b.status === 'rejected' 
                                ? 'bg-rose-600 text-white shadow-xs' 
                                : 'hover:bg-stone-200 text-stone-600'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 4. SETTINGS CONFIGTAB */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* General platform rules setup */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 mb-3">System Operating Thresholds</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                Configure operational criteria for the platform algorithm constraints. Note these are simulated inputs for live mock runtime calculations.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-550 uppercase tracking-wider mb-1.5 text-stone-500">Global Base Platform Commission ({platformCommission}%)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="5" 
                    value={platformCommission}
                    onChange={e => {
                      setPlatformCommission(Number(e.target.value));
                      addLiveLog('info', `Platform threshold split updated to ${e.target.value}%.`);
                    }}
                    max="40" 
                    className="flex-1 accent-indigo-600 h-1 rounded bg-stone-100 appearance-none cursor-pointer" 
                  />
                  <span className="font-bold bg-stone-50 px-3 py-1.5 border border-stone-200 rounded-lg text-xs">{platformCommission}%</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-550 uppercase tracking-wider mb-1.5 text-stone-500">Live Support System Simulated SLA (Minutes)</label>
                <select className="w-full text-xs px-3.5 py-2 border border-stone-200 rounded-xl bg-white text-stone-900 focus:outline-none">
                  <option value="5">🟢 High Priority Tier (Under 5 mins)</option>
                  <option value="15">🟡 Standard Priority Tier (15 mins)</option>
                  <option value="60">🔴 Extended Queue (1 Hr+ SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-550 uppercase tracking-wider mb-1.5 text-stone-500">Simulate Global Service Lockdown Mode</label>
                <div className="flex items-center justify-between p-3.5 bg-rose-50/50 border border-rose-200/50 rounded-xl">
                  <div>
                    <span className="font-bold text-rose-950 block text-xs">Simulate Lockdown Protection</span>
                    <span className="text-[10px] text-rose-700">Throws simulated system errors for checkout queries.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode}
                    onChange={(e) => {
                      const nextVal = e.target.checked;
                      setMaintenanceMode(nextVal);
                      addLiveLog('alert', `Simulated Maintenance lock dynamically toggled ${nextVal ? 'ON' : 'OFF'}.`);
                    }}
                    className="h-4.5 w-4.5 accent-rose-600 cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seed reset logs and system data flush */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 mb-3">Developer Operations Sandbox</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                Flush memory storage and reset states here. Simulates operational triggers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3.5">
                <span className="font-bold text-xs text-stone-900 block">⚡ Sandbox Memory Synchronization Actions:</span>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      addLiveLog('alert', 'Cleared client-side localStorage. Session parameters purged.');
                      alert('Cleared application local cache state!');
                    }}
                    className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-[10px] font-bold text-stone-700 uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Prune Local Cache
                  </button>
                  
                  <button
                    onClick={() => {
                      addLiveLog('success', 'Reset app states successfully and initialized system default seeds.');
                    }}
                    className="flex-1 py-2 px-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Simulate System Re-Seed
                  </button>
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <strong>Oversight Protection Code of Conduct:</strong> Modifying transactional database entries operates under pre-configured sandbox constraints. Always handle provider verification carefully to maintain high quality.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
