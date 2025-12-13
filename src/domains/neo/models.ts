// src/domains/neo/models.ts

export interface NeoObject {
  id: string;                    // e.g., "2024 YR4"
  name: string;
  diameterMeters: number;        // Physical size
  isPotentiallyHazardous: boolean; // PHA criteria (MOID < 0.05 AU, H < 22.0)
  orbitPeriodYears: number;
  
  // Baseline static risk data
  baselineTorinoScale: number;   
  baselineImpactProbability: number;
}

export interface NeoEphemerisSnapshot {
  neoId: string;
  timestamp: string; // ISO8601
  
  // Refined orbital data from new observations
  observationArcDays: number;
  uncertaintyClass: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Updated risk calculations
  updatedImpactProbability: number;
  updatedTorinoScale: number; // 0-10
  timeToImpactYears: number;
}

export type RiskCategory = 'NO_RISK' | 'MONITOR' | 'ELEVATED' | 'EMERGENCY';

export interface NeoRiskAssessment {
  neoId: string;
  riskCategory: RiskCategory;
  torinoScale: number;
  impactProbability: number;
  warningTimeYears: number;
  recommendedMitigations: string[]; // Descriptions of actions
}
