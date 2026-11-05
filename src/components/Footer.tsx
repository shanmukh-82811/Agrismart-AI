import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Language } from '../types/index.ts';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#030d07] border-t border-emerald-900/80 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white font-heading">
                AGRITECH <span className="text-emerald-400">VZG</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              Empowering smallholder and marginal farmers across Visakhapatnam and Coastal Andhra Pradesh with autonomous drone precision spraying, real-time microclimate intelligence, and crowdsourced community support.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400/90 font-mono">
              Powered by Multi-Spectral Drone Imaging, Microclimate Data Nets & Crowdsourced Knowledge Base.
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Smart Agri Hub
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#crop-health" className="hover:text-emerald-300 transition-colors">
                  AI Crop Health & Leaf Inspector
                </a>
              </li>
              <li>
                <a href="#schemes" className="hover:text-emerald-300 transition-colors">
                  Welfare Schemes & Subsidies
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-emerald-300 transition-colors">
                  Crowdsourced Helpdesk & Rentals
                </a>
              </li>
              <li>
                <a href="#mandi" className="hover:text-emerald-300 transition-colors">
                  Anakapalle Mandi Commodity Rates
                </a>
              </li>
              <li>
                <a href="#drone-sim" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  Drone Mission Control (Live Telemetry)
                </a>
              </li>
            </ul>
          </div>

          {/* District Contacts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Rythu Helpdesk Support
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kisan Call Center: <strong>1800-180-1551</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anakapalle Agri Research Station, VZG</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AP Agritech Mission Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            AGRITECH VZG © 2026. All rights reserved. Government of Andhra Pradesh Farmer Tech Network.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Privacy & Terms</span>
            <span className="hover:text-slate-400">Rythu Seva Kendra</span>
            <span className="hover:text-slate-400">Drone Pilot Safety SOP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
