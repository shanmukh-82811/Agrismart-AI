export type Language = 'en' | 'te' | 'hi' | 'ta';

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  village: string;
  mandal: string;
  landHoldingAcres: number;
  primaryCrop: string;
  verified: boolean;
  registeredAt: string;
}

export interface CropScanSample {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  imageUrl: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  symptoms: string[];
  chemicalAction: string;
  organicAction: string;
  localAdvice: string;
}

export interface DiagnosisResult {
  condition: string;
  scientificName?: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  symptoms: string[];
  chemicalAction: string;
  organicAction: string;
  localAdvice: string;
  waterSavings: string;
  recommendedDroneSpray?: boolean;
}

export interface SchemeItem {
  id: string;
  title: string;
  provider: string;
  tag: string;
  badge: string;
  description: string;
  financialAid: string;
  deadline: string;
  eligibilityCriteria: string;
  documentsNeeded: string[];
  appliedCount: number;
  category: 'direct_benefit' | 'drone_tech' | 'seeds_inputs' | 'irrigation';
}

export interface CommunityReply {
  id: string;
  author: string;
  village: string;
  role: 'Farmer' | 'Verified Agronomist' | 'Agri-Officer';
  text: string;
  timeAgo: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  village: string;
  mandal: string;
  role: 'Farmer' | 'Verified Agronomist' | 'Agri-Officer';
  tag: string;
  tagType: 'urgent' | 'sharing' | 'tip' | 'general';
  title: string;
  content: string;
  helpfulCount: number;
  replies: CommunityReply[];
  timeAgo: string;
  userLiked?: boolean;
}

export interface DroneTelemetry {
  isFlying: boolean;
  missionMode: 'inspect' | 'spray' | 'irrigate';
  batteryLevel: number;
  altitudeMeters: number;
  speedKmh: number;
  areaCoveredAcres: number;
  totalAcres: number;
  waterSavedLiters: number;
  chemicalDispensedMl: number;
  signalDbm: number;
  rtkStatus: string;
}

export interface MandiCommodity {
  id: string;
  crop: string;
  market: string;
  variety: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  msp: number;
  priceTrend: 'up' | 'down' | 'stable';
  changeAmount: number;
  unit: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
