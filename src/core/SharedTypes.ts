// src/core/SharedTypes.ts

/**
 * Global Safety Postures
 * These define the operational readiness of ANY system (Grid or Orbit).
 */
export enum SafetyPosture {
  NORMAL = "NORMAL",                     // Business as usual
  PRECAUTIONARY = "PRECAUTIONARY",       // Heightened monitoring, no risky maintenance
  DEFENSIVE = "DEFENSIVE",               // Active risk reduction (load shedding / payload sleep)
  MINIMAL_SURVIVAL = "MINIMAL_SURVIVAL"  // "Phoenix Mode" - protect the hardware at all costs
}

/**
 * A standard wrapper for any risk assessment output.
 */
export interface RiskAssessment {
  assetId: string;
  riskScore: number; // Normalized 0.0 - 1.0
  postureRecommendation: SafetyPosture;
}
