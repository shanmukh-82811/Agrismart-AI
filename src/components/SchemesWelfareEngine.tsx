import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  BellRing, 
  FileCheck, 
  Coins, 
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { FarmerProfile, Language, SchemeItem } from '../types/index.ts';
import { translations } from '../utils/translations.ts';
import { checkSchemeEligibility } from '../utils/agriRules.ts';

interface SchemesWelfareEngineProps {
  farmer: FarmerProfile | null;
  language: Language;
  onOpenLogin: () => void;
  onBookDroneDirect: () => void;
}

export const SchemesWelfareEngine: React.FC<SchemesWelfareEngineProps> = ({
  farmer,
  language,
  onOpenLogin,
  onBookDroneDirect,
}) => {
  const t = translations[language];

  const [searchSchemeQuery, setSearchSchemeQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);

  // Application modal state
  const [activeApplyingScheme, setActiveApplyingScheme] = useState<SchemeItem | null>(null);
  const [applicationSuccessId, setApplicationSuccessId] = useState<string | null>(null);

  const schemesList: SchemeItem[] = [
    {
      id: 'ysr-rythu-bharosa',
      title: 'YSR Rythu Bharosa / PM-KISAN Combined Scheme',
      provider: 'AP Agriculture & Farmers Welfare Dept',
      tag: 'AP Govt Scheme',
      badge: 'Active Installment',
      description: 'Annual financial assistance of ₹13,500 deposited directly into farmer bank accounts in three phases for seed, fertilizer, and harvest inputs.',
      financialAid: '₹13,500 / Year',
      deadline: 'Open all season (Kharif/Rabi)',
      eligibilityCriteria: 'Small and marginal farmers owning agricultural land up to 12.5 acres in Andhra Pradesh, including ROFR cultivators.',
      documentsNeeded: ['Aadhaar Card', 'Pattadar Passbook / 1B Document', 'Bank Account Linked to NPCI'],
      appliedCount: 4210,
      category: 'direct_benefit',
    },
    {
      id: 'subsidized-drone-vzg',
      title: '80% Subsidized Drone Spraying & NDVI Imaging',
      provider: 'AP Agritech Mission · Visakhapatnam District',
      tag: 'Agritech VZG Subsidy',
      badge: 'New 2026 Drive',
      description: 'Book autonomous aerial pesticide, bio-fertilizer and micro-nutrient spraying at just ₹150 per acre instead of open market rate ₹750/acre.',
      financialAid: '80% Subsidy (₹150/Acre)',
      deadline: 'Current Crop Stage (Immediate)',
      eligibilityCriteria: 'All smallholder and tenant farmers in Anakapalle, Bheemili, Chodavaram and Pendurthi mandals with verified mobile.',
      documentsNeeded: ['Mobile Number for SMS slot', 'Plot Location Coordinates'],
      appliedCount: 1845,
      category: 'drone_tech',
    },
    {
      id: 'flood-resistant-seeds',
      title: 'High-Yield Flood Resistant Paddy Seeds Drive',
      provider: 'Syngenta & Coromandel MNC CSR Initiative',
      tag: 'MNC CSR Initiative',
      badge: 'Free Distribution',
      description: 'Free certified Swarna Sub-1 & BPT flood-resilient paddy seed kits (25kg bag) to withstand coastal Visakhapatnam cyclones and waterlogging.',
      financialAid: 'Free 25kg Certified Seed Bag',
      deadline: 'Until Stocks Last at Anakapalle Center',
      eligibilityCriteria: 'Registered coastal farmers facing low-lying inundation risks.',
      documentsNeeded: ['Farmer Aadhaar / Mobile', 'Rythu Seva Kendra Token'],
      appliedCount: 2980,
      category: 'seeds_inputs',
    },
    {
      id: 'drip-irrigation-pmksy',
      title: 'PM Krishi Sinchayee Yojana (Drip & Micro-Irrigation)',
      provider: 'Andhra Pradesh Micro Irrigation Project (APMIP)',
      tag: 'Central & State Sponsored',
      badge: '90% Subsidy',
      description: 'Heavy 90% subsidy for small and marginal farmers (<= 5 acres) on precision drip and sprinkler systems for sugarcane, maize, and orchards.',
      financialAid: '90% Equipment Cost Covered',
      deadline: 'Applications open for current quarter',
      eligibilityCriteria: 'Farmers with verified borewell or canal irrigation source.',
      documentsNeeded: ['Land Passbook', 'Water Source Verification', 'Aadhaar Card'],
      appliedCount: 1240,
      category: 'irrigation',
    },
  ];

  // Category filter
  const filteredSchemes = schemesList.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      !searchSchemeQuery.trim() ||
      s.title.toLowerCase().includes(searchSchemeQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchSchemeQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchSchemeQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchSchemeQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle application submission
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const ackId = `AP-AGRI-${Date.now().toString().slice(-6)}`;
    setApplicationSuccessId(ackId);
  };

  return (
    <section id="schemes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>THEME 2 · REAL-TIME WELFARE & SUBSIDY ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            {t.schemesTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {t.schemesDesc}
          </p>
        </div>

        {/* SMS / WhatsApp Notification Toggle */}
        <div className="flex items-center gap-3 bg-emerald-950/70 border border-emerald-800/80 px-4 py-2.5 rounded-xl shadow-md">
          <BellRing className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold text-white">{t.smsAlerts}</div>
            <div className="text-[10px] text-emerald-300/80">
              {farmer ? `Linked to ${farmer.mobile}` : t.smsSub}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={smsAlertsEnabled}
              onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
              className="sr-only peer"
              aria-label="Toggle SMS alerts"
            />
            <div className="w-9 h-5 bg-emerald-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 border border-emerald-700"></div>
          </label>
        </div>
      </div>

      {/* Search and Category Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-[#081e14] p-3 rounded-2xl border border-emerald-900/70">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'direct_benefit', label: 'Direct Cash Benefit (₹13,500)' },
            { id: 'drone_tech', label: 'Drone Subsidies' },
            { id: 'seeds_inputs', label: 'Free Seed Drives' },
            { id: 'irrigation', label: 'Drip & Irrigation' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                  : 'bg-emerald-950/50 text-slate-300 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dedicated Schemes Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchSchemeQuery}
            onChange={(e) => setSearchSchemeQuery(e.target.value)}
            placeholder={t.searchSchemes}
            className="w-full bg-emerald-950/90 border border-emerald-800/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => {
          // Check farmer's eligibility dynamically
          const eligibility = checkSchemeEligibility(
            farmer ? { landHoldingAcres: farmer.landHoldingAcres, mandal: farmer.mandal } : { landHoldingAcres: 3 },
            scheme.title
          );

          return (
            <div
              key={scheme.id}
              className="relative rounded-2xl bg-gradient-to-b from-[#092419] to-[#05170f] border border-emerald-800/70 p-5 shadow-xl hover:border-emerald-500/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    {scheme.tag}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {scheme.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading group-hover:text-emerald-300 transition-colors">
                  {scheme.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Aid & Criteria */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-900/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Benefit Value:</span>
                    <span className="font-bold text-emerald-300 font-mono text-sm">
                      {scheme.financialAid}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Eligibility:</strong> {scheme.eligibilityCriteria}
                  </div>
                </div>

                {/* Dynamic Farmer Eligibility Notice if Logged In */}
                {farmer && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#062014] border border-emerald-700/60 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Status for {farmer.name.split(' ')[0]} ({farmer.landHoldingAcres} ac):
                    </span>
                    <span className="font-mono text-emerald-200 font-bold">
                      {eligibility.eligible ? 'Pre-Approved' : 'Review Required'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-emerald-900/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {scheme.appliedCount.toLocaleString()} farmers applied in VZG
                </span>

                {scheme.category === 'drone_tech' ? (
                  <button
                    onClick={onBookDroneDirect}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Drone Spot (₹150)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!farmer) {
                        onOpenLogin();
                      } else {
                        setActiveApplyingScheme(scheme);
                        setApplicationSuccessId(null);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs shadow-md border border-emerald-600/40 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{farmer ? t.applyNow : 'Sign in to Apply'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Drawer / Modal */}
      {activeApplyingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#071f15] border border-emerald-700 rounded-2xl shadow-2xl p-6 ring-1 ring-emerald-400/30">
            <button
              onClick={() => setActiveApplyingScheme(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50"
              aria-label="Close apply dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {applicationSuccessId ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-300">
                  Your application for <strong>{activeApplyingScheme.title}</strong> has been routed to the Anakapalle / Visakhapatnam Rythu Seva Kendra.
                </p>
                <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl font-mono text-sm font-bold text-emerald-300">
                  Acknowledgement ID: {applicationSuccessId}
                </div>
                <p className="text-[11px] text-slate-400">
                  SMS confirmation dispatched to {farmer?.mobile}. Keep this ID for physical center token verification.
                </p>
                <button
                  onClick={() => setActiveApplyingScheme(null)}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Apply for Scheme
                  </h3>
                </div>

                <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-300">
                    {activeApplyingScheme.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {activeApplyingScheme.provider}
                  </p>
                </div>

                {farmer && (
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-emerald-950/40 rounded border border-emerald-900">
                        <span className="text-slate-400 block text-[10px]">Farmer Name:</span>
                        <span className="font-bold text-white">{farmer.name}</span>
                      </div>
                      <div className="p-2 bg-emerald-950/40 rounded border border-emerald-900">
                        <span className="text-slate-400 block text-[10px]">Mobile:</span>
                        <span className="font-bold text-emerald-300 font-mono">{farmer.mobile}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-emerald-950/40 rounded border border-emerald-900">
                        <span className="text-slate-400 block text-[10px]">Location:</span>
                        <span className="text-slate-200">{farmer.village}, {farmer.mandal}</span>
                      </div>
                      <div className="p-2 bg-emerald-950/40 rounded border border-emerald-900">
                        <span className="text-slate-400 block text-[10px]">Land Holding:</span>
                        <span className="font-bold text-emerald-300">{farmer.landHoldingAcres} Acres</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Aadhaar / Rythu Passbook Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. XXXX-XXXX-4912"
                    defaultValue="5821-9940-1284"
                    className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-[11px] text-slate-300 space-y-1">
                  <span className="font-semibold text-emerald-300 block">Required for verification:</span>
                  {activeApplyingScheme.documentsNeeded.map((doc, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveApplyingScheme(null)}
                    className="px-4 py-2 text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md"
                  >
                    Confirm & Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
