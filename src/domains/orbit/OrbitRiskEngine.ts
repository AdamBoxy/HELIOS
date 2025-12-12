import { SpaceWeatherTelemetry, OrbitClass, SatelliteAsset, SafetyPosture } from './types';
import { MathUtils } from '../../core/MathUtils'; // Reuse your math lib!

export class OrbitRiskEngine {
  
  /**
   * Calculates specific risks based on Orbit Type.
   * LEO fears Drag. GEO fears Charging.
   */
  public assessAssetRisk(telemetry: SpaceWeatherTelemetry, asset: SatelliteAsset): number {
    
    // 1. RADIATION RISK (Protons) - Affects everyone, scaled by shielding
    // Log10 scale: S1=10, S5=100,000. We normalize 10^5 to 1.0.
    const solarStormLevel = MathUtils.logScale(telemetry.protonFlux_pfu, 100000);
    const radRisk = solarStormLevel * (1.0 - asset.shieldingFactor);

    // 2. DRAG RISK (Kp Index) - Only affects LEO
    let dragRisk = 0;
    if (asset.orbit === OrbitClass.LEO) {
      // Kp > 5 starts heating the atmosphere significantly
      dragRisk = Math.max(0, (telemetry.kpIndex - 4) / 5.0); 
    }

    // 3. CHARGING RISK (Electrons) - Affects MEO/GEO most
    let chargingRisk = 0;
    if (asset.orbit === OrbitClass.GEO || asset.orbit === OrbitClass.MEO) {
      // Flux > 1000 pfu is dangerous for internal charging
      chargingRisk = MathUtils.logScale(telemetry.electronFlux_pfu, 10000);
    }

    // Weighted Total Risk
    return Math.min(1.0, radRisk + dragRisk + chargingRisk);
  }

  public determinePosture(riskScore: number): SafetyPosture {
    if (riskScore > 0.85) return SafetyPosture.MINIMAL_SURVIVAL; // "Phoenix Mode"
    if (riskScore > 0.60) return SafetyPosture.DEFENSIVE;        // "Instruments Off"
    if (riskScore > 0.30) return SafetyPosture.PRECAUTIONARY;    // "No Updates"
    return SafetyPosture.NORMAL;
  }
}
