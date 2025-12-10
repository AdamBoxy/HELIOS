import { SafetyPosture, SpaceWeatherTelemetry } from '../types';

export class RiskEngine {
  // Configurable thresholds for GIC induction
  private readonly DBDT_SATURATION = 2000; 

  public calculateSeverity(telemetry: SpaceWeatherTelemetry): number {
    // Normalized Kp (0-1)
    const kpFactor = Math.min(1.0, telemetry.kpIndex / 9.0);
    
    // Logarithmic scaling for dB/dt to dampen sensor noise vs real spikes
    const dbdtFactor = Math.min(
      1.0, 
      Math.log10(Math.abs(telemetry.dBdt_nT_min) + 1) / Math.log10(this.DBDT_SATURATION)
    );

    // Weighted risk score (dB/dt is dominant driver of GIC)
    return (kpFactor * 0.3) + (dbdtFactor * 0.7);
  }

  public determinePosture(severity: number): SafetyPosture {
    if (severity > 0.90) return SafetyPosture.MINIMAL_SURVIVAL;
    if (severity > 0.75) return SafetyPosture.DEFENSIVE;
    if (severity > 0.40) return SafetyPosture.PRECAUTIONARY;
    return SafetyPosture.NORMAL;
  }
}
