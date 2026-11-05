import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  User, 
  MapPin, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  KeyRound,
  LogOut
} from 'lucide-react';
import { FarmerProfile, Language } from '../types/index.ts';
import { validateIndianMobile } from '../utils/agriRules.ts';
import { sendFarmerOtp, verifyFarmerOtp } from '../services/geminiService.ts';

interface FarmerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: FarmerProfile | null;
  onLoginSuccess: (farmer: FarmerProfile) => void;
  onLogout: () => void;
  language: Language;
}

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen,
  onClose,
  farmer,
  onLoginSuccess,
  onLogout,
  language,
}) => {
  // Modal step: 'phone' | 'otp' | 'profile'
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // Step 1 fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mandal, setMandal] = useState('Anakapalle');
  const [village, setVillage] = useState('');
  const [landAcres, setLandAcres] = useState('3.0');
  const [primaryCrop, setPrimaryCrop] = useState('Paddy (Rice)');

  // Step 2 fields
  const [otp, setOtp] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('482910');
  const [resendTimer, setResendTimer] = useState(30);

  // Status & loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const mandalsInVzg = [
    'Anakapalle',
    'Bheemunipatnam (Bheemili)',
    'Chodavaram',
    'Pendurthi',
    'Gajuwaka Rural',
    'Padmanabham',
    'Kasimkota',
    'Narsipatnam',
    'Sabbavaram',
    'Devarapalle',
  ];

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessNotice('');
      if (!farmer) {
        setStep('phone');
      }
    }
  }, [isOpen, farmer]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name as in Rythu Passbook or Aadhaar');
      return;
    }

    const validation = validateIndianMobile(mobile);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendFarmerOtp({
        name: name.trim(),
        mobile: validation.cleanNumber,
        mandal,
        village: village.trim() || `${mandal} Agri Cluster`,
        landHoldingAcres: parseFloat(landAcres) || 2.5,
      });

      if (res.success) {
        setDemoOtpCode(res.demoOtp || '482910');
        setStep('otp');
        setResendTimer(30);
        setSuccessNotice(`Demo OTP sent: ${res.demoOtp || '482910'}`);
      } else {
        setErrorMsg(res.error || 'Failed to send OTP. Please retry.');
      }
    } catch (err: any) {
      setErrorMsg('Connection failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP received via SMS');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyFarmerOtp({
        mobile,
        otp: otp.trim(),
        name: name.trim(),
        village: village.trim() || `${mandal} Agri Cluster`,
        mandal,
        landHoldingAcres: parseFloat(landAcres) || 2.5,
        primaryCrop,
      });

      if (res.success && res.farmer) {
        onLoginSuccess(res.farmer);
        onClose();
      } else {
        setErrorMsg(res.error || 'Invalid OTP code. Please check or use demo code.');
      }
    } catch (err: any) {
      setErrorMsg('Verification failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill demo credentials for effortless testing
  const handleFillDemoFarmer = () => {
    setName('Ramesh Rao');
    setMobile('9848012345');
    setMandal('Anakapalle');
    setVillage('Govada Village');
    setLandAcres('3.5');
    setPrimaryCrop('Sugarcane & Paddy');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#071f15] border border-emerald-800/80 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-emerald-500/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header pattern banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-6 py-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-white font-heading">
                {farmer ? 'Farmer Profile & Credentials' : 'AP Smart Farmer Login Protocol'}
              </h2>
              <p className="text-xs text-emerald-300/80">
                {farmer ? 'Verified Coastal AP Rythu Pass' : 'Step-by-step Name & Mobile OTP Verification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile View (If farmer is already logged in) */}
          {farmer ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{farmer.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Rythu
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    ID: <span className="font-mono text-emerald-200">{farmer.id}</span>
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    📍 {farmer.village}, {farmer.mandal} Mandal, Visakhapatnam
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
                  <span className="text-slate-400">Mobile Number:</span>
                  <p className="font-mono font-semibold text-emerald-300 mt-0.5">{farmer.mobile}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
                  <span className="text-slate-400">Land Holding:</span>
                  <p className="font-semibold text-emerald-300 mt-0.5">{farmer.landHoldingAcres} Acres (Smallholder)</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
                  <span className="text-slate-400">Primary Crops:</span>
                  <p className="font-semibold text-emerald-300 mt-0.5">{farmer.primaryCrop}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
                  <span className="text-slate-400">Drone Subsidy Tier:</span>
                  <p className="font-semibold text-emerald-300 mt-0.5">80% Subsidized (₹150/acre)</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setStep('phone');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 text-red-200 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out / Switch Farmer
                </button>
              </div>
            </div>
          ) : (
            /* Login Protocol Steps */
            <div>
              {/* Step indicator breadcrumb */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 'phone' ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50' : 'bg-emerald-900 text-emerald-300'
                  }`}>
                    1
                  </span>
                  <span className={`text-xs font-semibold ${step === 'phone' ? 'text-emerald-300' : 'text-slate-400'}`}>
                    Farmer Details & Phone
                  </span>
                </div>
                <div className="w-8 h-px bg-emerald-800/80" />
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 'otp' ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50' : 'bg-emerald-950 text-slate-500 border border-emerald-800'
                  }`}>
                    2
                  </span>
                  <span className={`text-xs font-semibold ${step === 'otp' ? 'text-emerald-300' : 'text-slate-500'}`}>
                    OTP Verification
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: Farmer Name, Mobile, Village, Land */}
              {step === 'phone' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Demo auto-fill helper button */}
                  <div className="flex items-center justify-between bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/50">
                    <span className="text-xs text-emerald-300">Quick Test Mode:</span>
                    <button
                      type="button"
                      onClick={handleFillDemoFarmer}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/60 text-emerald-200 text-xs font-medium transition-colors"
                    >
                      Auto-fill Demo Farmer
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Farmer Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Rao / అప్పారావు"
                        className="w-full bg-emerald-950/70 border border-emerald-800/70 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mobile Number (10 digits) <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-emerald-800/70 bg-emerald-950/90 text-xs font-mono text-emerald-300">
                        +91
                      </span>
                      <div className="relative flex-1">
                        <Smartphone className="w-4 h-4 text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          maxLength={12}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="98480 12345"
                          className="w-full bg-emerald-950/70 border border-emerald-800/70 rounded-r-xl pl-9 pr-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      A 6-digit OTP will be dispatched to this mobile for verification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Mandal / Region <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={mandal}
                          onChange={(e) => setMandal(e.target.value)}
                          className="w-full bg-emerald-950/70 border border-emerald-800/70 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          {mandalsInVzg.map((m) => (
                            <option key={m} value={m} className="bg-slate-900 text-slate-100">
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Land Holding (Acres)
                      </label>
                      <div className="relative">
                        <Layers className="w-4 h-4 text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="50"
                          value={landAcres}
                          onChange={(e) => setLandAcres(e.target.value)}
                          className="w-full bg-emerald-950/70 border border-emerald-800/70 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Primary Crop
                    </label>
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full bg-emerald-950/70 border border-emerald-800/70 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="Paddy (Rice)">Paddy (Rice) - ఖరీఫ్/రబీ</option>
                      <option value="Sugarcane">Sugarcane (చెరకు)</option>
                      <option value="Maize / Corn">Maize / Corn (మొక్కజొన్న)</option>
                      <option value="Chilli & Spices">Chilli & Spices (మిరప)</option>
                      <option value="Mango & Cashew">Mango & Cashew (మామిడి/జీడిమామిడి)</option>
                      <option value="Vegetables">Vegetables & Pulses (కూరగాయలు)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Secure OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Request OTP Verification</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: 6-Digit OTP Verification */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Alert banner showing simulated SMS OTP delivery */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-200">
                        📱 SMS Sent to +91 {mobile.replace(/[\s\-]/g, '').slice(-10)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-800/70 text-[10px] text-emerald-200 font-mono">
                        Demo Active
                      </span>
                    </div>
                    <p className="text-slate-300">
                      Your 6-digit Andhra AgriTech verification code is:
                    </p>
                    <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-emerald-800/50">
                      <span className="font-mono text-base font-bold tracking-widest text-emerald-400">
                        {demoOtpCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtp(demoOtpCode)}
                        className="px-2.5 py-1 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors"
                      >
                        Auto-Fill Code
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full bg-emerald-950/80 border border-emerald-700/80 rounded-xl pl-9 pr-3 py-2.5 text-center text-lg font-mono tracking-widest text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-emerald-400 hover:underline"
                    >
                      ← Edit Mobile Number
                    </button>
                    {resendTimer > 0 ? (
                      <span>Resend OTP in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying with AP Rythu Registry...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify & Sign In</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
