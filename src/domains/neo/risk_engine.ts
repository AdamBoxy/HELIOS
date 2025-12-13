// src/domains/neo/risk_engine.ts
import { NeoObject, NeoEphemerisSnapshot, NeoRiskAssessment, RiskCategory } from './models';

export class NeoRiskEngine {
  
  public assess(neo: NeoObject, eph: NeoEphemerisSnapshot): NeoRiskAssessment {
    // Use updated values if available, otherwise fallback to baseline
    const torino = eph.updatedTorinoScale ?? neo.baselineTorinoScale;
    const impactProb = eph.updatedImpactProbability ?? neo.baselineImpactProbability;
    const warningTimeYears = eph.timeToImpactYears;

    const riskCategory = this.categorize(torino, impactProb);
    const mitigations = this.planMitigations(neo, riskCategory, warningTimeYears);

    return {
      neoId: neo.id,
      riskCategory,
      torinoScale: torino,
      impactProbability: impactProb,
      warningTimeYears,
      recommendedMitigations: mitigations
    };
  }

  private categorize(torino: number, impactProb: number): RiskCategory {
    if (torino === 0 || impactProb < 1e-6) return 'NO_RISK';
    if (torino <= 2) return 'MONITOR'; // Green/Yellow zone
    if (torino <= 5) return 'ELEVATED'; // Orange zone (Threatening)
    return 'EMERGENCY'; // Red zone (Certain/High Prob Collision)
  }

  private planMitigations(
    neo: NeoObject, 
    category: RiskCategory, 
    yearsRemaining: number
  ): string[] {
    const actions: string[] = [];

    // 1. Observation Phase
    if (category === 'MONITOR') {
      actions.push("TASK_OPTICAL: Increase cadence of observatory tracking");
      actions.push("TASK_RADAR: Request Goldstone/Deep Space Network ranging");
    }

    // 2. Coordination Phase
    if (category === 'ELEVATED') {
      actions.push("NOTIFY_IAWN: Alert International Asteroid Warning Network");
      actions.push("SIMULATION: Run kinetic impactor deflection models (DART-style)");
    }

    // 3. Civil Protection Phase (The "Storm" is coming)
    if (category === 'EMERGENCY') {
      if (yearsRemaining > 5) {
        actions.push("MISSION_DESIGN: Assemble mitigation mission (Deflection)");
      } else {
        actions.push("CIVIL_DEFENSE: Trigger regional evacuation protocols");
        actions.push("MISSION_DESIGN: Assemble mitigation mission (Disruption/Nuclear)");
      }
    }

    return actions;
  }
}
