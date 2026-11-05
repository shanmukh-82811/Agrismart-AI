import { DiagnosisResult, FarmerProfile, Language } from '../types/index.ts';

export async function askRythuAI(
  message: string,
  language: Language = 'en',
  farmerContext?: FarmerProfile | null
): Promise<{ reply: string; timestamp: string }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, farmerContext }),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return {
      reply: data.reply || 'Apologies, could not process request.',
      timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err: any) {
    console.error('AI chat fetch failed:', err);
    return {
      reply: 'Rythu AI service temporarily in local advisory mode. For immediate emergency agronomist advice, call Visakhapatnam Agri Toll-Free: 1800-425-0302.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

export async function diagnoseCropLeaf(payload: {
  imageBase64?: string;
  cropName?: string;
  symptoms?: string;
  sampleId?: string;
}): Promise<DiagnosisResult> {
  const res = await fetch('/api/diagnose-crop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Crop diagnosis failed');
  }

  const data = await res.json();
  return data.diagnosis;
}

export async function sendFarmerOtp(payload: {
  name: string;
  mobile: string;
  village?: string;
  mandal?: string;
  landHoldingAcres?: number;
}): Promise<{ success: boolean; cleanMobile?: string; formattedMobile?: string; demoOtp?: string; error?: string }> {
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function verifyFarmerOtp(payload: {
  mobile: string;
  otp: string;
  name?: string;
  village?: string;
  mandal?: string;
  landHoldingAcres?: number;
  primaryCrop?: string;
}): Promise<{ success: boolean; farmer?: FarmerProfile; error?: string }> {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
