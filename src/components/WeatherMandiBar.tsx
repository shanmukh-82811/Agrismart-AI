import React from 'react';
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { Language, MandiCommodity } from '../types/index.ts';
import { translations } from '../utils/translations.ts';

interface WeatherMandiBarProps {
  language: Language;
}

export const WeatherMandiBar: React.FC<WeatherMandiBarProps> = ({ language }) => {
  const t = translations[language];

  const mandiPrices: MandiCommodity[] = [
    { id: '1', crop: 'Paddy (Common)', market: 'Anakapalle AMC', variety: 'BPT 5204', modalPrice: 2320, minPrice: 2280, maxPrice: 2360, msp: 2300, priceTrend: 'up', changeAmount: 40, unit: '₹/Quintal' },
    { id: '2', crop: 'Sugarcane', market: 'Chodavaram Sugar Yard', variety: 'Co 86032', modalPrice: 3150, minPrice: 3050, maxPrice: 3200, msp: 3150, priceTrend: 'stable', changeAmount: 0, unit: '₹/Ton' },
    { id: '3', crop: 'Chilli (Teja)', market: 'Visakhapatnam APMC', variety: 'Dry Red', modalPrice: 18500, minPrice: 17800, maxPrice: 19200, msp: 16500, priceTrend: 'up', changeAmount: 350, unit: '₹/Quintal' },
    { id: '4', crop: 'Maize (Hybrid)', market: 'Pendurthi Yard', variety: 'Yellow Dent', modalPrice: 2180, minPrice: 2100, maxPrice: 2240, msp: 2090, priceTrend: 'up', changeAmount: 25, unit: '₹/Quintal' },
    { id: '5', crop: 'Cashew Raw Nut', market: 'Kasimkota Mandi', variety: 'Local Coastal', modalPrice: 11400, minPrice: 10800, maxPrice: 12000, msp: 10500, priceTrend: 'down', changeAmount: -120, unit: '₹/Quintal' },
  ];

  return (
    <section id="weather-mandi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Live Microclimate Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-[#062417] to-teal-950 border border-emerald-800/80 p-5 sm:p-6 shadow-xl ring-1 ring-emerald-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Weather Card */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                {t.vzgRegion}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400/80 font-mono">
                <Clock className="w-3 h-3" />
                Live 10-Min Telemetry
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <div className="flex items-center gap-2">
                <CloudRain className="w-8 h-8 text-teal-400 shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  31°C · Humidity 82%
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              {t.weatherDesc}
            </p>
          </div>

          {/* Three Key Telemetry Metrics */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Pest Risk Index */}
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{t.pestRiskIndex}</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-bold text-amber-300">
                  {t.pestRiskStatus}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Stem Borer & Leaf Blast Alert in Anakapalle
              </p>
            </div>

            {/* Soil Moisture */}
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{t.soilMoisture}</span>
                <Droplets className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">
                  {t.soilMoistureVal}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Field capacity sufficient for root uptake
              </p>
            </div>

            {/* Spraying Window */}
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-teal-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{t.sprayingWindow}</span>
                <Wind className="w-4 h-4 text-teal-400" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-sm font-bold text-teal-300">
                  {t.sprayingWindowVal}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Ideal for low-drift drone misting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Mandi Market Price Marquee / Grid */}
      <div className="rounded-xl bg-[#071d13] border border-emerald-900/70 p-3 shadow-md">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-900/50 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>VISAKHAPATNAM DISTRICT LIVE MANDI COMMODITY RATES</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Updated today: 11:30 AM IST
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {mandiPrices.map((item) => (
            <div 
              key={item.id}
              className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-600/60 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-white truncate">{item.crop}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${
                  item.priceTrend === 'up' ? 'text-emerald-400 bg-emerald-950/80' : item.priceTrend === 'down' ? 'text-rose-400 bg-rose-950/80' : 'text-slate-400'
                }`}>
                  {item.priceTrend === 'up' ? `+₹${item.changeAmount}` : item.priceTrend === 'down' ? `-₹${Math.abs(item.changeAmount)}` : 'Stable'}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-emerald-300 font-mono">₹{item.modalPrice.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">{item.unit}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {item.market}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
