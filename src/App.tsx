import React, { useState, useEffect } from 'react';
import { FarmerProfile, Language } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { FarmerAuthModal } from './components/FarmerAuthModal.tsx';
import { WeatherMandiBar } from './components/WeatherMandiBar.tsx';
import { CropHealthChecker } from './components/CropHealthChecker.tsx';
import { SchemesWelfareEngine } from './components/SchemesWelfareEngine.tsx';
import { CommunityHelpdesk } from './components/CommunityHelpdesk.tsx';
import { MandiMarketTracker } from './components/MandiMarketTracker.tsx';
import { DroneMissionControl } from './components/DroneMissionControl.tsx';
import { RythuAIChat } from './components/RythuAIChat.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [language, setLanguage] = useState<Language>('te'); // Default to Telugu (native for Visakhapatnam) with English fallback
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Pre-selected parameters when routing from Crop Health to Drone Spraying
  const [droneChemical, setDroneChemical] = useState<string>('Eco-Neem Bio-Pesticide (1500 ppm)');
  const [droneCondition, setDroneCondition] = useState<string>('Rice Blast');

  // Load saved farmer profile on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agritech_vzg_farmer');
      if (saved) {
        setFarmer(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read saved farmer profile');
    }
  }, []);

  // Handle Login success
  const handleLoginSuccess = (profile: FarmerProfile) => {
    setFarmer(profile);
    try {
      localStorage.setItem('agritech_vzg_farmer', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not persist farmer profile');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setFarmer(null);
    try {
      localStorage.removeItem('agritech_vzg_farmer');
    } catch (e) {
      console.warn('Could not remove farmer profile');
    }
  };

  // Route to drone section with pre-filled diagnosis
  const handleBookDroneFromDiagnosis = (disease: string, chemical: string) => {
    setDroneCondition(disease);
    setDroneChemical(chemical);

    const el = document.getElementById('drone-sim');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Global search navigation
  const handleGlobalSearchSelect = (type: 'crop' | 'scheme' | 'community' | 'drone', query: string) => {
    let targetId = 'crop-health';
    if (type === 'scheme') targetId = 'schemes';
    if (type === 'community') targetId = 'community';
    if (type === 'drone') targetId = 'drone-sim';

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05140d] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Header with Global Search Bar, Language switcher, and Farmer Login Protocol */}
      <Header
        farmer={farmer}
        language={language}
        onLanguageChange={setLanguage}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsAuthModalOpen(true)}
        onGlobalSearchSelect={handleGlobalSearchSelect}
      />

      {/* Main Content Area */}
      <main className="flex-1 space-y-6 pb-12">
        {/* 2. Weather & Live Mandi Bar */}
        <WeatherMandiBar language={language} />

        {/* 3. Theme 1 (Highlighted): AI Crop Health Checker & Leaf Inspector */}
        <CropHealthChecker
          language={language}
          onBookDroneWithDiagnosis={handleBookDroneFromDiagnosis}
        />

        {/* 4. Theme 2 (Highlighted): Subsidies, Welfare Schemes & MNC Direct Benefits */}
        <SchemesWelfareEngine
          farmer={farmer}
          language={language}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onBookDroneDirect={() => {
            const el = document.getElementById('drone-sim');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. Theme 3 (Highlighted): Crowdsourced Community Helpdesk & Resource Sharing */}
        <CommunityHelpdesk
          farmer={farmer}
          language={language}
          onOpenLogin={() => setIsAuthModalOpen(true)}
        />

        {/* 6. Theme 4 (Highlighted): APMC Mandi Commodity Intelligence & Market Tracker */}
        <MandiMarketTracker language={language} />

        {/* 7. Theme 5 (AT THE VERY END): Autonomous Aerial Precision Drone Presentation & Mission Control */}
        <DroneMissionControl
          farmer={farmer}
          language={language}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          preselectedChemical={droneChemical}
          preselectedCondition={droneCondition}
        />
      </main>

      {/* Farmer Authentication Protocol Modal (Name + Mobile + OTP Verification) */}
      <FarmerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        farmer={farmer}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        language={language}
      />

      {/* 24/7 Working AI Chatbot: Rythu AI Mitra */}
      <RythuAIChat farmer={farmer} language={language} />

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}
