import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  BatteryCharging, 
  Gauge, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw, 
  Crosshair, 
  Droplet, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Search,
  Check,
  X,
  Compass
} from 'lucide-react';
import { DroneTelemetry, FarmerProfile, Language } from '../types/index.ts';
import { translations } from '../utils/translations.ts';
import { calculateDroneFlightMetrics, calculatePesticideDosage } from '../utils/agriRules.ts';

interface DroneMissionControlProps {
  farmer: FarmerProfile | null;
  language: Language;
  onOpenLogin: () => void;
  preselectedChemical?: string;
  preselectedCondition?: string;
}

export const DroneMissionControl: React.FC<DroneMissionControlProps> = ({
  farmer,
  language,
  onOpenLogin,
  preselectedChemical,
  preselectedCondition,
}) => {
  const t = translations[language];

  // Mission mode: 'inspect' | 'spray' | 'irrigate'
  const [missionMode, setMissionMode] = useState<'inspect' | 'spray' | 'irrigate'>('inspect');
  const [isFlying, setIsFlying] = useState<boolean>(true);
  const [dronePos, setDronePos] = useState<{ x: number; y: number }>({ x: 25, y: 30 });
  const [flightAngle, setFlightAngle] = useState<number>(45);
  const [batteryLevel, setBatteryLevel] = useState<number>(89);
  const [scannedProgress, setScannedProgress] = useState<number>(65);

  // Field block search
  const [blockSearch, setBlockSearch] = useState<string>('');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk-4');

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);
  const [bookingAcres, setBookingAcres] = useState<number>(farmer?.landHoldingAcres || 3.0);
  const [bookingDate, setBookingDate] = useState<string>('Tomorrow, 06:30 AM');
  const [bookingChemical, setBookingChemical] = useState<string>(preselectedChemical || 'Eco-Neem Bio-Pesticide (1500 ppm)');

  // Field Blocks
  const fieldBlocks = [
    { id: 'blk-1', name: 'Anakapalle Block #1 (Paddy Basin)', condition: 'healthy', acres: 2.5, coords: '17.6919° N, 83.0039° E' },
    { id: 'blk-2', name: 'Bheemili East (Sugarcane Belt)', condition: 'dry', acres: 3.2, coords: '17.8920° N, 83.4542° E' },
    { id: 'blk-3', name: 'Chodavaram Canal North (Maize)', condition: 'healthy', acres: 1.8, coords: '17.8340° N, 82.9431° E' },
    { id: 'blk-4', name: 'Anakapalle Block #4 (Stem Borer Spot)', condition: 'pest', acres: 4.2, coords: '17.6890° N, 83.0120° E' },
    { id: 'blk-5', name: 'Pendurthi Terrace (Vegetables)', condition: 'dry', acres: 2.0, coords: '17.8289° N, 83.2001° E' },
  ];

  const filteredBlocks = blockSearch.trim()
    ? fieldBlocks.filter(b => b.name.toLowerCase().includes(blockSearch.toLowerCase()))
    : fieldBlocks;

  const currentBlock = fieldBlocks.find(b => b.id === selectedBlockId) || fieldBlocks[3];

  // Flight simulation loop
  useEffect(() => {
    let animId: number;
    let angle = 0;

    const interval = setInterval(() => {
      if (isFlying) {
        angle += 0.04;
        // Figure-8 or field grid sweep trajectory
        const nx = 50 + 38 * Math.sin(angle);
        const ny = 50 + 25 * Math.sin(angle * 2);
        setDronePos({ x: nx, y: ny });

        // Calculate heading angle
        const deg = (Math.atan2(Math.cos(angle * 2) * 50, Math.cos(angle) * 38) * 180) / Math.PI;
        setFlightAngle(deg + 90);

        // Gradually increment scanned area
        setScannedProgress((prev) => (prev >= 100 ? 25 : prev + 0.15));

        // Battery micro-drain
        setBatteryLevel((prev) => (prev <= 12 ? 95 : prev - 0.02));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isFlying]);

  // Derived metrics from pure domain calculations
  const dosageCalc = calculatePesticideDosage('Paddy', preselectedCondition || 'Stem Borer', bookingAcres);
  const flightCalc = calculateDroneFlightMetrics(currentBlock.acres, missionMode);

  // Submit booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const bookId = `DRONE-VZG-${Date.now().toString().slice(-5)}`;
    setBookingSuccessId(bookId);
  };

  return (
    <section id="drone-sim" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Visual divider emphasizing this is the drone presentation at the last */}
      <div className="w-full flex items-center justify-center gap-4 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-700/60 to-transparent flex-1" />
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950 border border-emerald-600/50 shadow-lg flex items-center gap-2">
          <Plane className="w-3.5 h-3.5 text-emerald-400 rotate-45" />
          FINAL PRESENTATION · AUTONOMOUS AERIAL PRECISION SYSTEM
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-700/60 to-transparent flex-1" />
      </div>

      {/* Presentation Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>VISAKHAPATNAM SMART DRONE MISSION CONTROL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Autonomous Aerial Precision System
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {t.droneDesc} High-accuracy RTK GPS positioning with multi-spectral NDVI sensor arrays and ultra-low-volume precision misting.
          </p>
        </div>

        {/* Mission Mode Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMissionMode('inspect')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              missionMode === 'inspect'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950'
                : 'bg-emerald-950/70 text-slate-300 border border-emerald-800/80 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>{t.inspectHeatmap}</span>
          </button>

          <button
            onClick={() => setMissionMode('spray')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              missionMode === 'spray'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950'
                : 'bg-emerald-950/70 text-slate-300 border border-emerald-800/80 hover:text-white'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>{t.sprayPesticide}</span>
          </button>

          <button
            onClick={() => setMissionMode('irrigate')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              missionMode === 'irrigate'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950'
                : 'bg-emerald-950/70 text-slate-300 border border-emerald-800/80 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.precisionIrrigation}</span>
          </button>
        </div>
      </div>

      {/* Field Block Search & Selector Bar */}
      <div className="mb-5 p-3 rounded-2xl bg-[#081f14] border border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-emerald-400 shrink-0">Field Blocks:</span>
          {fieldBlocks.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBlockId(b.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedBlockId === b.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-emerald-950/60 text-slate-300 hover:bg-emerald-900/60'
              }`}
            >
              {b.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Dedicated Drone Block Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-emerald-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={blockSearch}
            onChange={(e) => setBlockSearch(e.target.value)}
            placeholder="Search block or GPS coords..."
            className="w-full bg-emerald-950/90 border border-emerald-800/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Simulation Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 2D Flight Canvas / Field Map */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl bg-[#04110a] border border-emerald-800/80 overflow-hidden shadow-2xl p-4">
            {/* Top HUD Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="bg-emerald-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-700/60 text-xs font-mono text-emerald-200 flex items-center gap-2 shadow-lg">
                <span className={`w-2 h-2 rounded-full ${isFlying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span>Mission: {missionMode.toUpperCase()}</span>
                <span className="text-slate-400">|</span>
                <span>Alt: 12.4m</span>
              </div>

              <div className="bg-emerald-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-700/60 text-xs font-mono text-emerald-200 flex items-center gap-2 shadow-lg">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>{Math.round(batteryLevel)}%</span>
                <span className="text-slate-400">|</span>
                <span>Speed: 18 km/h</span>
              </div>
            </div>

            {/* Interactive Simulated 2D Field Surface */}
            <div className="relative w-full aspect-square sm:aspect-video rounded-xl bg-gradient-to-br from-[#0c2e1f] via-[#092217] to-[#04130c] border border-emerald-900 overflow-hidden">
              {/* Agricultural Grid & Multi-Spectral Heatmap Zones */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Field Grid lines */}
                <defs>
                  <pattern id="field-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#field-grid)" />

                {/* Heatmap NDVI zones */}
                {/* Zone A: Healthy NDVI (Green) */}
                <ellipse cx="30%" cy="40%" rx="26%" ry="22%" fill="rgba(34, 197, 94, 0.25)" filter="blur(18px)" />
                <ellipse cx="75%" cy="70%" rx="24%" ry="20%" fill="rgba(34, 197, 94, 0.22)" filter="blur(16px)" />

                {/* Zone B: Moisture Stress / Dry (Yellow/Amber) */}
                <ellipse cx="70%" cy="30%" rx="18%" ry="15%" fill="rgba(245, 158, 11, 0.28)" filter="blur(16px)" />

                {/* Zone C: Active Pest Infestation Hotspot (Red / Anakapalle Block #4) */}
                <ellipse cx="45%" cy="65%" rx="16%" ry="14%" fill="rgba(239, 68, 68, 0.35)" filter="blur(14px)" />

                {/* Flight Path Trace */}
                <path
                  d="M 15 30 Q 35 15 50 40 T 80 40 T 70 70 T 35 75 Z"
                  fill="none"
                  stroke={missionMode === 'spray' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(52, 211, 153, 0.4)'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Spray Droplet Particle Trail (when in spray or irrigate mode) */}
                {(missionMode === 'spray' || missionMode === 'irrigate') && isFlying && (
                  <circle
                    cx={`${dronePos.x}%`}
                    cy={`${dronePos.y}%`}
                    r="24"
                    fill={missionMode === 'spray' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(34, 197, 94, 0.25)'}
                    className="animate-ping"
                  />
                )}
              </svg>

              {/* Dynamic Animated Drone Icon with Rotation */}
              <div
                className="absolute z-30 transition-all duration-100 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${dronePos.x}%`,
                  top: `${dronePos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${flightAngle}deg)`,
                }}
              >
                <div className="relative">
                  {/* Rotor blades spinning */}
                  <div className="w-10 h-10 rounded-full border border-emerald-400/50 animate-spin flex items-center justify-center">
                    <Plane className="w-6 h-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  </div>
                  {/* Spray nozzle indicator */}
                  {missionMode === 'spray' && (
                    <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  )}
                </div>
              </div>

              {/* Hotspot Marker for Detected Stem Borer */}
              <div className="absolute left-[45%] top-[65%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/90 border border-red-500/70 text-[10px] text-red-200 font-bold shadow-lg animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>Target: Stem Borer (Block #4)</span>
                </div>
              </div>

              {/* Bottom Flight Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFlying(!isFlying)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    {isFlying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isFlying ? 'Hold Orbit' : 'Resume Flight'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setScannedProgress(10);
                      setBatteryLevel(98);
                    }}
                    className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-slate-300 border border-emerald-800 text-xs cursor-pointer"
                    title="Reset Simulation Orbit"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Heatmap Legend */}
                <div className="hidden sm:flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] text-slate-300 border border-emerald-900/60 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy (NDVI &gt; 0.7)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Dry / Water Need
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> Pest Infestation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Drone Telemetry & Subsidized Booking Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-b from-[#092218] to-[#05170f] border border-emerald-800/80 p-5 shadow-2xl space-y-4">
            {/* Header Telemetry */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  {t.droneTelemetry}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                RTK Fix: ±1.8cm
              </span>
            </div>

            {/* Progress Bar for Area Scanned */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300">{t.areaScanned}:</span>
                <span className="font-mono font-bold text-emerald-300">
                  {Math.round(scannedProgress)}% ({currentBlock.acres} Acres)
                </span>
              </div>
              <div className="w-full h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, scannedProgress)}%` }}
                />
              </div>
            </div>

            {/* Telemetry Data Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <span className="text-slate-400 block text-[11px]">{t.detectedPestSpot}</span>
                <p className="font-bold text-amber-300 text-sm mt-0.5">
                  Anakapalle Block #4 (Stem Borer Infestation)
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  GPS: 17.6890° N, 83.0120° E · Soil Index: 64%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/80">
                  <span className="text-slate-400 block text-[10px]">{t.waterSaved}</span>
                  <p className="font-mono font-bold text-emerald-300 text-sm mt-0.5">
                    1,400 Liters
                  </p>
                  <span className="text-[10px] text-emerald-400">90% vs Backpack</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/80">
                  <span className="text-slate-400 block text-[10px]">{t.estChemical}</span>
                  <p className="font-mono font-bold text-emerald-300 text-sm mt-0.5">
                    450 ml Eco-Neem
                  </p>
                  <span className="text-[10px] text-teal-400">40% Less Chemical</span>
                </div>
              </div>
            </div>

            {/* Auto Scheduler Card & Manual Launch */}
            <div className="p-3.5 rounded-xl bg-[#062015] border border-emerald-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {t.autoScheduler}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                  Tomorrow 06:30 AM
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t.nextScheduled}
              </p>
            </div>

            {/* Subsidized Booking Trigger Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (!farmer) {
                    onOpenLogin();
                  } else {
                    setIsBookingOpen(true);
                    setBookingSuccessId(null);
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer ring-1 ring-emerald-300/40"
              >
                <Plane className="w-4 h-4 rotate-45" />
                <span>Book 80% Subsidized Drone Spraying (₹150/Acre)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subsidized Drone Spray Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#071f15] border border-emerald-700 rounded-2xl shadow-2xl p-6 ring-1 ring-emerald-400/30">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccessId ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Drone Flyover Confirmed!
                </h3>
                <p className="text-xs text-slate-300">
                  Drone Pilot Unit #14 assigned for <strong>{farmer?.name}</strong> at {farmer?.village}, {farmer?.mandal}.
                </p>
                <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl font-mono text-sm font-bold text-emerald-300">
                  Slot Booking ID: {bookingSuccessId}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>🗓️ Date: {bookingDate}</p>
                  <p>🌾 Target Land: {bookingAcres} Acres · Subsidized Fee: ₹{Math.round(bookingAcres * 150)}</p>
                  <p>🌿 Chemical / Bio-agent: {bookingChemical}</p>
                </div>
                <p className="text-[11px] text-slate-400">
                  SMS confirmation sent to {farmer?.mobile}. Pilot will contact 30 mins prior to takeoff.
                </p>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Return to Mission Control
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-5 h-5 text-emerald-400 rotate-45" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Book Precision Drone Spraying
                  </h3>
                </div>

                <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Farmer:</span>
                    <span className="font-bold text-white">{farmer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile:</span>
                    <span className="font-bold text-emerald-300 font-mono">{farmer?.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200">{farmer?.village}, {farmer?.mandal}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Land Area to Spray (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="20"
                    value={bookingAcres}
                    onChange={(e) => setBookingAcres(parseFloat(e.target.value) || 1)}
                    className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>Market Rate: ₹{Math.round(bookingAcres * 750)}</span>
                    <span className="text-emerald-400 font-bold">
                      Subsidized Rate (80% Off): ₹{Math.round(bookingAcres * 150)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Spray Input / Chemical
                  </label>
                  <input
                    type="text"
                    value={bookingChemical}
                    onChange={(e) => setBookingChemical(e.target.value)}
                    className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Scheduled Flyover Window
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Tomorrow, 06:30 AM (Ideal Wind 8km/h)">Tomorrow, 06:30 AM (Ideal Wind 8km/h)</option>
                    <option value="Tomorrow, 08:30 AM">Tomorrow, 08:30 AM</option>
                    <option value="Day After, 06:30 AM">Day After, 06:30 AM</option>
                    <option value="Weekend Special Slot">Weekend Special Slot</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-4 py-2 text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-md"
                  >
                    Confirm Subsidized Booking (₹{Math.round(bookingAcres * 150)})
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
