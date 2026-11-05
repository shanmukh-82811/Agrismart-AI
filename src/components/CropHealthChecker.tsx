import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  FileText, 
  FlaskConical, 
  Leaf, 
  ArrowRight,
  RefreshCw,
  Droplets
} from 'lucide-react';
import { DiagnosisResult, Language } from '../types/index.ts';
import { translations } from '../utils/translations.ts';
import { diagnoseCropLeaf } from '../services/geminiService.ts';

interface CropHealthCheckerProps {
  language: Language;
  onBookDroneWithDiagnosis: (disease: string, chemical: string) => void;
}

export const CropHealthChecker: React.FC<CropHealthCheckerProps> = ({
  language,
  onBookDroneWithDiagnosis,
}) => {
  const t = translations[language];

  // Diagnosis state
  const [selectedSample, setSelectedSample] = useState<string>('paddy-blast');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userCustomImage, setUserCustomImage] = useState<string | null>(null);
  const [searchDiseaseQuery, setSearchDiseaseQuery] = useState<string>('');

  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>({
    condition: 'Rice Blast (Pyricularia oryzae)',
    scientificName: 'Magnaporthe oryzae',
    confidence: 96.4,
    severity: 'high',
    symptoms: [
      'Spindle-shaped or diamond-shaped lesions with grayish centers and brown margins',
      'Leaf necrosis coalescing under high humidity (>85%)',
      'Collar rot near leaf sheath in coastal paddy fields',
    ],
    chemicalAction: 'Apply Tricyclazole 75% WP @ 0.6g/L of water or Isoprothiolane 40% EC @ 1.5ml/L.',
    organicAction: 'Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 10g/L.',
    localAdvice: 'Common in Anakapalle & Chodavaram paddy basins. Drain stagnant water and withhold excessive urea/nitrogen fertilizers.',
    waterSavings: 'Using precision drone spraying saves 150 Liters of water per acre.',
    recommendedDroneSpray: true,
  });

  const sampleScans = [
    { id: 'paddy-blast', label: 'Paddy Leaf Blast', crop: 'Paddy / Rice', icon: '🌾' },
    { id: 'sugarcane-red-rot', label: 'Sugarcane Red Rot', crop: 'Sugarcane', icon: '🎋' },
    { id: 'mango-anthracnose', label: 'Mango Anthracnose', crop: 'Mango', icon: '🥭' },
    { id: 'chilli-curl', label: 'Chilli Leaf Curl', crop: 'Chilli', icon: '🌶️' },
    { id: 'healthy-crop', label: 'Healthy Crop (Optimal)', crop: 'Foliage', icon: '🌱' },
  ];

  // Run diagnosis on preset sample
  const handleSelectSample = async (sampleId: string) => {
    setSelectedSample(sampleId);
    setUserCustomImage(null);
    setIsLoading(true);

    try {
      const result = await diagnoseCropLeaf({ sampleId });
      setDiagnosis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle local user image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUserCustomImage(base64);
      setSelectedSample('custom');
      setIsLoading(true);

      try {
        const result = await diagnoseCropLeaf({
          imageBase64: base64,
          cropName: 'Uploaded Leaf Image',
          symptoms: 'Discoloration and leaf damage',
        });
        setDiagnosis(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Crop Disease Knowledge Base for the search bar
  const diseaseCatalog = [
    { name: 'Rice Blast (Pyricularia oryzae)', crop: 'Paddy', remedy: 'Tricyclazole 75% WP @ 0.6g/L', organic: '5% Neem Seed Kernel Extract' },
    { name: 'Sugarcane Red Rot', crop: 'Sugarcane', remedy: 'Carbendazim 50% WP + Trichoderma', organic: 'Trichoderma viride soil drench' },
    { name: 'Stem Borer (Chilo partellus)', crop: 'Paddy/Maize', remedy: 'Chlorantraniliprole 18.5% SC @ 0.4ml/L', organic: 'Pheromone traps (8/acre)' },
    { name: 'Bacterial Leaf Blight (BLB)', crop: 'Paddy', remedy: 'Streptocycline 100ppm + Copper Oxychloride', organic: 'Fresh cow dung extract foliar spray' },
    { name: 'Chilli Thrips & Mites', crop: 'Chilli', remedy: 'Diafenthiuron 50% WP @ 1.25g/L', organic: 'Neem oil 10,000 ppm @ 2ml/L' },
    { name: 'Powdery Mildew', crop: 'Mango / Vegetables', remedy: 'Wettable Sulphur 80% WP @ 2.5g/L', organic: 'Milk-water foliar mist (1:10)' },
  ];

  const filteredDiseases = searchDiseaseQuery.trim()
    ? diseaseCatalog.filter(d => 
        d.name.toLowerCase().includes(searchDiseaseQuery.toLowerCase()) ||
        d.crop.toLowerCase().includes(searchDiseaseQuery.toLowerCase()) ||
        d.remedy.toLowerCase().includes(searchDiseaseQuery.toLowerCase())
      )
    : [];

  return (
    <section id="crop-health" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header with Accent Glow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>THEME 1 · AI INSTANT DIAGNOSIS ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            {t.cropHealthTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {t.cropHealthDesc}
          </p>
        </div>

        {/* Dedicated Disease Search Bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchDiseaseQuery}
              onChange={(e) => setSearchDiseaseQuery(e.target.value)}
              placeholder={t.searchCropDb}
              className="w-full bg-emerald-950/80 border border-emerald-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Disease Search Results Dropdown (if searching) */}
      {searchDiseaseQuery.trim() && (
        <div className="mb-6 p-4 rounded-xl bg-[#092217] border border-emerald-700/80 shadow-xl animate-in fade-in">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
            Disease Database Matches ({filteredDiseases.length})
          </h4>
          {filteredDiseases.length === 0 ? (
            <p className="text-xs text-slate-400">No matching crop diseases found in database.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDiseases.map((dis, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{dis.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300">
                      {dis.crop}
                    </span>
                  </div>
                  <p className="text-emerald-300 text-[11px] mt-1 font-mono">
                    Rx: {dis.remedy}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    🌿 Organic: {dis.organic}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Upload Inspector Left, Diagnosis Report Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Upload & Sample Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-b from-[#092218] to-[#05170f] border border-emerald-800/70 p-5 shadow-xl">
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              Upload Or Snap Crop Photo
            </label>

            {/* Drag & drop upload area */}
            <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-700/60 rounded-xl hover:border-emerald-400/80 bg-emerald-950/40 cursor-pointer transition-all group overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />

              {userCustomImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-emerald-600/60">
                  <img
                    src={userCustomImage}
                    alt="Uploaded crop leaf"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white bg-emerald-900/90 px-3 py-1.5 rounded-lg border border-emerald-400">
                      Click to choose another photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/50 border border-emerald-600/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {t.dragDropText}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.supportsCrops}
                  </p>
                </div>
              )}
            </label>

            {/* Preset Samples */}
            <div className="mt-4 pt-4 border-t border-emerald-900/60">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                {t.orSample}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sampleScans.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedSample === sample.id
                        ? 'bg-emerald-800/80 border-emerald-400 text-white shadow-md'
                        : 'bg-emerald-950/40 border-emerald-900/70 text-slate-300 hover:bg-emerald-900/40 hover:text-white'
                    }`}
                  >
                    <div className="text-sm">{sample.icon}</div>
                    <div className="text-xs font-bold truncate mt-1">{sample.label}</div>
                    <div className="text-[10px] text-emerald-400/80">{sample.crop}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: AI Diagnosis Report */}
        <div className="lg:col-span-7">
          <div className="h-full rounded-2xl bg-gradient-to-b from-[#092218] to-[#05170f] border border-emerald-800/70 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            {isLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
                <h3 className="text-base font-bold text-white">
                  Running Neural Vision Plant Pathology Engine...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cross-referencing with Visakhapatnam regional agro-climatic pathogen patterns.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white font-heading">
                      {t.analysisReport}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    diagnosis.severity === 'critical' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                      : diagnosis.severity === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Severity: {diagnosis.severity}
                  </span>
                </div>

                {/* Condition & Confidence Score */}
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/50">
                  <div className="text-xs text-slate-400">{t.detectedCondition}</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5 flex flex-wrap items-baseline gap-2">
                    <span>{diagnosis.condition}</span>
                    {diagnosis.scientificName && (
                      <span className="text-xs font-serif italic text-emerald-400/90 font-normal">
                        ({diagnosis.scientificName})
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-300">{t.confidenceScore}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {diagnosis.confidence}% Match
                    </span>
                  </div>
                  <div className="w-full h-2 bg-emerald-950 rounded-full mt-1 overflow-hidden border border-emerald-800">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${diagnosis.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Symptoms bullet list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Observed Pathological Symptoms:
                  </h4>
                  <ul className="space-y-1">
                    {diagnosis.symptoms.map((symp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{symp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions: Chemical vs Organic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#072216] border border-teal-800/60 text-xs">
                    <div className="flex items-center gap-1.5 text-teal-300 font-bold mb-1">
                      <FlaskConical className="w-4 h-4 text-teal-400" />
                      <span>Calibrated Chemical Control</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                      {diagnosis.chemicalAction}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#072216] border border-emerald-800/60 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <span>Natural / Bio-Organic Remedy</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {diagnosis.organicAction}
                    </p>
                  </div>
                </div>

                {/* Localized Advice */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/80 text-xs">
                  <span className="font-bold text-emerald-300">
                    📍 Visakhapatnam Agronomy Advisory:
                  </span>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    {diagnosis.localAdvice}
                  </p>
                </div>

                {/* CTA to book drone with this diagnosis */}
                <div className="pt-2">
                  <button
                    onClick={() => onBookDroneWithDiagnosis(diagnosis.condition, diagnosis.chemicalAction)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/70 transition-all flex items-center justify-center gap-2 cursor-pointer ring-1 ring-emerald-300/40"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Book Subsidized Drone Spray for this Plot (₹150/Acre)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
