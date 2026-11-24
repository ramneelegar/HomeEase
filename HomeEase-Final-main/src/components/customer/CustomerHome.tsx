import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { StarRating, Avatar } from '../shared/Shared';
import { Provider } from '../../types';
import { Sparkles, Search, SlidersHorizontal, MapPin } from 'lucide-react';

interface RecommendedCardProps {
  provider: Provider;
  onClick: () => void;
}

export function RecommendedCard({ provider: p, onClick }: RecommendedCardProps) {
  const cat = SERVICE_CATEGORIES.find(c => c.id === p.category);
  
  // Pastel backgrounds for categories
  const bgStyles: Record<string, string> = {
    cleaning: 'bg-[#f4faff] text-[#3b82f6]',
    plumbing: 'bg-[#fef2f2] text-[#ef4444]',
    electrical: 'bg-[#fffbeb] text-[#f59e0b]',
    carpentry: 'bg-[#f5f3ff] text-[#8b5cf6]',
    painting: 'bg-[#ecfdf5] text-[#10b981]',
    appliances: 'bg-[#fdf2f8] text-[#ec4899]'
  };

  const bgStyle = bgStyles[p.category] || 'bg-stone-50';

  return (
    <div 
      className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-0.5"
      onClick={onClick}
    >
      {/* Top Banner Accent */}
      <div className={`h-28 relative flex items-center justify-center text-4xl select-none ${bgStyle}`}>
        <span className="text-5xl opacity-35 transform group-hover:scale-105 transition-transform duration-300">
          {cat?.icon}
        </span>
        
        <span className="absolute top-3 left-3 bg-[#e8f5e9]/95 text-[#2e7d32] font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200/40">
          ✓ Verified
        </span>
        
        <span className="absolute top-3 right-3 bg-[#fffde7]/95 text-[#f57f17] font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-200/40 flex items-center gap-0.5">
          ★ Top Pick
        </span>
      </div>

      {/* Bottom Block */}
      <div className="p-4 flex items-center gap-3 bg-white border-t border-stone-100">
        <Avatar name={p.name} size={36} />
        <div className="min-w-0">
          <h4 className="font-extrabold text-stone-900 group-hover:text-indigo-600 transition-all text-xs leading-tight truncate">
            {p.name}
          </h4>
          <p className="text-[10px] text-stone-400 font-bold mt-0.5 capitalize">
            {cat?.label} • {p.experience} yrs exp
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProviderCardProps {
  provider: Provider;
  onClick: () => void;
}

export function ProviderCard({ provider: p, onClick }: ProviderCardProps) {
  const cat = SERVICE_CATEGORIES.find(c => c.id === p.category);
  return (
    <div 
      className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div 
        className="h-28 relative flex items-center justify-center text-4xl select-none"
        style={{ background: `linear-gradient(135deg, ${cat?.color}10 0%, ${cat?.color}25 100%)` }}
      >
        <span className="text-5xl opacity-40 transform group-hover:scale-105 transition-transform duration-300">
          {cat?.icon}
        </span>
        {p.verified && (
          <span className="absolute top-3 left-3 bg-emerald-600/90 text-white font-bold text-[9px] tracking-wider px-2 py-0.5 rounded-full border border-emerald-200/20">
            ✓ Verified
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <Avatar name={p.name} size={36} />
            <div>
              <h4 className="font-bold text-stone-900 group-hover:text-indigo-600 transition-all text-xs leading-tight truncate">
                {p.name}
              </h4>
              <p className="text-[10px] text-stone-400 font-bold capitalize">
                {cat?.label} • {p.experience} yrs exp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={p.rating} size={10} />
            <span className="text-[11px] font-bold text-stone-850">{p.rating}</span>
            <span className="text-[10px] text-stone-400 font-bold">({p.reviewCount})</span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-0.5 text-[10px] text-stone-500 font-bold">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate max-w-[100px] capitalize">{p.location.split(',')[0]}</span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-indigo-600 text-xs">₹{p.pricing}</span>
            <span className="text-[9px] text-stone-400 font-bold">/{p.pricingType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerHome() {
  const { providers, currentUser, addSearchHistory, getRecommendations } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [filters, setFilters] = useState({ minRating: 0, maxPrice: 9999, location: '' });
  const [showFilters, setShowFilters] = useState(false);

  const recommended = getRecommendations(currentUser?.id, 4);

  const filtered = useMemo(() => {
    let result = providers;
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }
    if (filters.maxPrice < 9999) {
      result = result.filter(p => p.pricing <= filters.maxPrice);
    }
    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    return result.sort((a, b) => b.rating - a.rating);
  }, [providers, search, activeCategory, filters]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.length > 2) {
      addSearchHistory(val);
    }
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId === activeCategory ? '' : catId);
    addSearchHistory(catId);
  };

  // Custom static mapping for exact captions according to screens
  const categoryCaptions: Record<string, string> = {
    cleaning: 'Deep & regular cleans',
    plumbing: 'Leaks, pipes & more',
    electrical: 'Wiring & fixtures',
    carpentry: 'Furniture & woodwork',
    painting: 'Interior & exterior',
    appliances: 'AC, fridge & more'
  };

  return (
    <div className="animate-fade-in text-[#2c2621]">
      
      {/* Hero Banner Area */}
      <div className="bg-[#7c3aed] py-14 px-4 text-center text-white relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight mb-2">
            Find trusted home service pros
          </h1>
          <p className="text-white/80 text-xs sm:text-sm font-medium max-w-xl mx-auto mb-6">
            Verified experts for every home need, right in your neighborhood
          </p>
          
          {/* Circular Oval Search Component */}
          <div className="max-w-lg mx-auto bg-white rounded-full shadow-lg p-1 flex items-center border border-indigo-900/5">
            <div className="pl-4 text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by service, provider name or location..."
              className="flex-1 bg-transparent text-xs py-2 px-2 focus:outline-none text-stone-900 placeholder-stone-400 font-medium"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="p-1 mr-1 text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full text-[9px] font-bold"
              >
                ✕
              </button>
            )}
            <button 
              onClick={() => handleSearch(search)}
              className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer mr-1"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* "Browse by Service" Section */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-stone-900 mb-4 tracking-tight uppercase">
            Browse by Service
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICE_CATEGORIES.map(cat => {
              const active = activeCategory === cat.id;
              const caption = categoryCaptions[cat.id] || cat.desc;
              const nameLabel = cat.id === 'appliances' ? 'Appliance Repair' : cat.label;
              
              return (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{ borderColor: active ? cat.color : undefined }}
                  className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer h-32 ${
                    active 
                      ? 'bg-stone-50 border-2 font-bold' 
                      : 'bg-white border-stone-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <span className="text-3xl select-none">
                    {cat.icon}
                  </span>
                  <div className="mt-2.5">
                    <span 
                      className="text-xs font-bold block leading-tight text-stone-850"
                    >
                      {nameLabel}
                    </span>
                    <p className="text-[9px] text-stone-400 font-semibold block mt-0.5 leading-tight">
                      {caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommended for You block using screens style */}
        {!search && !activeCategory && recommended.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-stone-900 text-sm tracking-tight uppercase">Recommended for You</h3>
              <span className="text-[9px] uppercase font-bold text-[#7c3aed] bg-[#f3e8ff] px-2 py-0.5 rounded-full">
                Smart Pick
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map(p => (
                <RecommendedCard 
                  key={p.id} 
                  provider={p} 
                  onClick={() => navigate(`/provider/${p.id}`)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Filters layout */}
        <div className="flex items-center justify-between mb-5 border-b border-stone-200 pb-3">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
            {filtered.length} service provider{filtered.length !== 1 ? 's' : ''} available
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#7c3aed] hover:text-[#6d28d9] transition-all cursor-pointer bg-[#f3e8ff]/50 px-2.5 py-1 rounded-lg"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {showFilters ? '▲' : '▼'}</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 shadow-sm animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Rating Score</label>
              <select 
                value={filters.minRating} 
                onChange={e => setFilters({...filters, minRating: Number(e.target.value)})}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
              >
                <option value={0}>Show all ratings</option>
                <option value={3}>3.0 ★ and above</option>
                <option value={4}>4.0 ★ and above</option>
                <option value={4.5}>4.5 ★ and above</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Max hourly price (₹)</label>
              <select 
                value={filters.maxPrice} 
                onChange={e => setFilters({...filters, maxPrice: Number(e.target.value)})}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
              >
                <option value={9999}>Any pricing</option>
                <option value={200}>Under ₹200</option>
                <option value={350}>Under ₹350</option>
                <option value={600}>Under ₹600</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Operational Area</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="e.g. Koramangala" 
                  value={filters.location} 
                  onChange={e => setFilters({...filters, location: e.target.value})}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none text-stone-900"
                />
                {filters.location && (
                  <button 
                    onClick={() => setFilters({...filters, location: ''})} 
                    className="absolute right-3 top-3 text-[9px] font-bold text-stone-400 font-mono"
                  >
                    x
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button 
                onClick={() => setFilters({ minRating: 0, maxPrice: 9999, location: '' })}
                className="text-stone-450 hover:text-stone-700 font-semibold text-[10px]"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Main List */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-white border border-stone-200 rounded-3xl">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-extrabold text-stone-900 text-sm">No service providers match your search criteria</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto font-medium">
              Try adjusting your pricing filters or category choice.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(p => (
              <ProviderCard 
                key={p.id} 
                provider={p} 
                onClick={() => navigate(`/provider/${p.id}`)} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
