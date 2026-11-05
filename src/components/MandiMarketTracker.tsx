import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Language, MandiCommodity } from '../types/index.ts';
import { translations } from '../utils/translations.ts';

interface MandiMarketTrackerProps {
  language: Language;
}

export const MandiMarketTracker: React.FC<MandiMarketTrackerProps> = ({ language }) => {
  const [searchMandiQuery, setSearchMandiQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('all');

  const commodities: MandiCommodity[] = [
    {
      id: 'paddy-common',
      crop: 'Paddy (Common / Grade A)',
      market: 'Anakapalle AMC Yard',
      variety: 'BPT 5204 (Samba Mahsuri)',
      modalPrice: 2320,
      minPrice: 2280,
      maxPrice: 2380,
      msp: 2300,
      priceTrend: 'up',
      changeAmount: 40,
      unit: '₹ / Quintal',
    },
    {
      id: 'sugarcane-cane',
      crop: 'Sugarcane (Crushing Cane)',
      market: 'Chodavaram Sugar Mills Yard',
      variety: 'Co 86032 Early Maturing',
      modalPrice: 3150,
      minPrice: 3080,
      maxPrice: 3220,
      msp: 3150,
      priceTrend: 'stable',
      changeAmount: 0,
      unit: '₹ / Ton (FRP)',
    },
    {
      id: 'chilli-teja',
      crop: 'Dry Red Chilli (Guntur/Teja)',
      market: 'Visakhapatnam APMC Market',
      variety: 'Teja Grade 1',
      modalPrice: 18500,
      minPrice: 17800,
      maxPrice: 19400,
      msp: 16500,
      priceTrend: 'up',
      changeAmount: 350,
      unit: '₹ / Quintal',
    },
    {
      id: 'maize-hybrid',
      crop: 'Maize (Grain)',
      market: 'Pendurthi Sub-Market',
      variety: 'Yellow Hybrid Dent',
      modalPrice: 2180,
      minPrice: 2120,
      maxPrice: 2250,
      msp: 2090,
      priceTrend: 'up',
      changeAmount: 25,
      unit: '₹ / Quintal',
    },
    {
      id: 'cashew-raw',
      crop: 'Cashew Nut (Raw Shell)',
      market: 'Kasimkota Mandi Yard',
      variety: 'VRI-3 Coastal',
      modalPrice: 11400,
      minPrice: 10800,
      maxPrice: 12100,
      msp: 10500,
      priceTrend: 'down',
      changeAmount: -120,
      unit: '₹ / Quintal',
    },
    {
      id: 'black-gram',
      crop: 'Black Gram (Urad Dal)',
      market: 'Bheemunipatnam Market Yard',
      variety: 'LBG-752',
      modalPrice: 7600,
      minPrice: 7300,
      maxPrice: 7900,
      msp: 7400,
      priceTrend: 'up',
      changeAmount: 110,
      unit: '₹ / Quintal',
    },
  ];

  const filtered = commodities.filter((c) => {
    const matchesMarket =
      selectedMarket === 'all' || c.market.toLowerCase().includes(selectedMarket.toLowerCase());
    const matchesSearch =
      !searchMandiQuery.trim() ||
      c.crop.toLowerCase().includes(searchMandiQuery.toLowerCase()) ||
      c.market.toLowerCase().includes(searchMandiQuery.toLowerCase()) ||
      c.variety.toLowerCase().includes(searchMandiQuery.toLowerCase());
    return matchesMarket && matchesSearch;
  });

  return (
    <section id="mandi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>THEME 4 · APMC MANDI COMMODITY INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Visakhapatnam District Mandi Market Rates
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Live Agricultural Market Committee (AMC) arrivals, modal prices, and Minimum Support Price (MSP) benchmarks across Anakapalle, Pendurthi, Chodavaram and Bheemili.
          </p>
        </div>

        {/* Dedicated Mandi Search Bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchMandiQuery}
              onChange={(e) => setSearchMandiQuery(e.target.value)}
              placeholder="Search crop, variety or mandi yard..."
              className="w-full bg-emerald-950/80 border border-emerald-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Grid of Commodity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const aboveMsp = item.modalPrice >= item.msp;
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-gradient-to-b from-[#092218] to-[#05170f] border border-emerald-800/70 p-4 shadow-xl hover:border-emerald-600/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.market}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    item.priceTrend === 'up'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : item.priceTrend === 'down'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.priceTrend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                    {item.priceTrend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                    {item.priceTrend === 'up' ? `+₹${item.changeAmount}` : item.priceTrend === 'down' ? `-₹${Math.abs(item.changeAmount)}` : 'Stable'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {item.crop}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Variety: {item.variety}
                </p>

                {/* Modal Price */}
                <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Modal Price</span>
                    <span className="text-2xl font-black text-white font-mono">
                      ₹{item.modalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">
                    {item.unit}
                  </span>
                </div>

                {/* Range & MSP Comparison */}
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/60">
                    <span className="text-slate-400 block text-[10px]">Day Range:</span>
                    <span className="font-mono text-slate-200">
                      ₹{item.minPrice} - ₹{item.maxPrice}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/60">
                    <span className="text-slate-400 block text-[10px]">Govt MSP:</span>
                    <span className="font-mono text-emerald-300 font-semibold">
                      ₹{item.msp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advisory footer */}
              <div className="mt-3 pt-2.5 border-t border-emerald-900/60 flex items-center justify-between text-[11px]">
                <span className={`flex items-center gap-1 font-semibold ${
                  aboveMsp ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {aboveMsp ? 'Trading Above Govt MSP' : 'Near MSP Support Floor'}
                </span>
                <span className="text-slate-400 text-[10px]">
                  Direct AMC Weighment
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
