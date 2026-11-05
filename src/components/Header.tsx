import React, { useState, useRef, useEffect } from 'react';
import { 
  Sprout, 
  Search, 
  Globe, 
  UserCheck, 
  User, 
  PhoneCall, 
  ShieldCheck, 
  X, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { FarmerProfile, Language } from '../types/index.ts';
import { translations } from '../utils/translations.ts';

interface HeaderProps {
  farmer: FarmerProfile | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onGlobalSearchSelect: (type: 'crop' | 'scheme' | 'community' | 'drone', query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  farmer,
  language,
  onLanguageChange,
  onOpenLogin,
  onOpenProfile,
  onGlobalSearchSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Quick suggestions for global search
  const suggestions = [
    { type: 'crop' as const, label: 'Rice Blast / Paddy Leaf Spot', tag: 'Crop Health' },
    { type: 'scheme' as const, label: '80% Subsidized Drone Spraying', tag: 'Scheme' },
    { type: 'scheme' as const, label: 'YSR Rythu Bharosa / PM-KISAN', tag: 'Welfare' },
    { type: 'community' as const, label: 'Tractor & Rotavator for Rent', tag: 'Equipment' },
    { type: 'crop' as const, label: 'Sugarcane Red Rot Remediation', tag: 'Crop Health' },
    { type: 'drone' as const, label: 'Live Drone Flight Telemetry & Scheduling', tag: 'Drone Tech' },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? suggestions.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    : suggestions.slice(0, 4);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#061810]/95 backdrop-blur-md border-b border-emerald-900/60 shadow-lg shadow-black/30">
      {/* Top micro banner with emergency toll free */}
      <div className="bg-emerald-950/80 px-4 py-1 text-xs text-emerald-300/80 border-b border-emerald-900/40 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Andhra Pradesh AgriTech Command Network · Visakhapatnam District</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-200">
          <span className="flex items-center gap-1 font-mono">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            Toll-Free Kisan Call Center: <strong>1800-180-1551</strong>
          </span>
          <span className="hidden sm:inline-block text-emerald-500/50">|</span>
          <span className="hidden sm:inline-block">Coastal Weather Alert: Moderate Rains Expected</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/30">
            <Sprout className="w-6 h-6 text-emerald-950 fill-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                AGRITECH <span className="text-emerald-400">VZG</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                2026 AI
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wider text-emerald-400/90 uppercase">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search crops, schemes, rentals, remedies, drone..."
              className="w-full bg-emerald-950/60 border border-emerald-800/60 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search suggestions dropdown */}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#082015] border border-emerald-800/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[11px] font-semibold text-emerald-400/80 px-2.5 py-1 uppercase tracking-wider">
                Quick Search Recommendations
              </div>
              <div className="space-y-1 mt-1">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onGlobalSearchSelect(item.type, item.label);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs text-slate-200 hover:bg-emerald-900/50 hover:text-emerald-300 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-3 h-3 text-emerald-500 group-hover:text-emerald-300" />
                      {item.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Anchors */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-300">
          <a
            href="#crop-health"
            className="px-3 py-1.5 rounded-lg hover:text-emerald-300 hover:bg-emerald-900/30 transition-colors"
          >
            {t.navCropHealth}
          </a>
          <a
            href="#schemes"
            className="px-3 py-1.5 rounded-lg hover:text-emerald-300 hover:bg-emerald-900/30 transition-colors"
          >
            {t.navSchemes}
          </a>
          <a
            href="#community"
            className="px-3 py-1.5 rounded-lg hover:text-emerald-300 hover:bg-emerald-900/30 transition-colors"
          >
            {t.navHelpdesk}
          </a>
          <a
            href="#mandi"
            className="px-3 py-1.5 rounded-lg hover:text-emerald-300 hover:bg-emerald-900/30 transition-colors"
          >
            {t.navMandi}
          </a>
          <a
            href="#drone-sim"
            className="px-3 py-1.5 rounded-lg text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {t.navDroneSim}
          </a>
        </nav>

        {/* Right side controls: Language switcher + Farmer Login / Profile */}
        <div className="flex items-center gap-2.5">
          {/* Language selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-emerald-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              aria-label="Select Language"
              className="bg-emerald-950/70 border border-emerald-800/80 rounded-xl pl-8 pr-7 py-1.5 text-xs font-medium text-emerald-100 hover:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="te" className="bg-slate-900 text-slate-100">తెలుగు (Telugu)</option>
              <option value="en" className="bg-slate-900 text-slate-100">English</option>
              <option value="hi" className="bg-slate-900 text-slate-100">हिन्दी (Hindi)</option>
              <option value="ta" className="bg-slate-900 text-slate-100">தமிழ் (Tamil)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Farmer Login Protocol Button or Farmer Profile Badge */}
          {farmer ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 border border-emerald-500/40 text-xs font-semibold text-emerald-100 hover:ring-2 hover:ring-emerald-400/50 transition-all shadow-md"
              title="View Verified Farmer Profile"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left hidden sm:block">
                <div className="leading-tight text-white flex items-center gap-1">
                  {farmer.name.split(' ')[0]}
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-300 font-normal leading-none">
                  {farmer.mandal}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-900/50 hover:shadow-emerald-700/50 transition-all cursor-pointer ring-1 ring-emerald-300/30"
            >
              <User className="w-4 h-4" />
              <span>{t.loginRythu}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
