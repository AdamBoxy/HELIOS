import { OrbitRiskEngine } from '../src/domains/orbit/OrbitRiskEngine';
import { SatExecutor } from '../src/domains/orbit/SatExecutor';
import { SpaceWeatherTelemetry, OrbitClass, SatelliteAsset, SafetyPosture } from '../src/domains/orbit/types';

// --- ASSETS ---
const satConstellation: SatelliteAsset[] = [
  { id: "SAT-LEO-01", orbit: OrbitClass.LEO, shieldingFactor: 0.3, hasPropulsion: true },
  { id: "SAT-GEO-99", orbit: OrbitClass.GEO, shieldingFactor: 0.8, hasPropulsion: true }
];

const riskEngine = new OrbitRiskEngine();
const executor = new SatExecutor();

// --- SCENARIO: MASSIVE SOLAR PARTICLE EVENT ---
const scenario: SpaceWeatherTelemetry[] = [
  { timestamp: "T+00", kpIndex: 2, protonFlux_pfu: 10, electronFlux_pfu: 100 },
  { timestamp: "T+10", kpIndex: 4, protonFlux_pfu: 1000, electronFlux_pfu: 500 }, // S2 Storm
  { timestamp: "T+20", kpIndex: 8, protonFlux_pfu: 100000, electronFlux_pfu: 5000 }, // S5 Extreme
];

(async () => {
  console.log("🚀 HELIOS-ORBIT: INITIALIZING TRACKING...");

  for (const telemetry of scenario) {
    console.log(`\n--- T-SEQ: ${telemetry.timestamp} [Protons: ${telemetry.protonFlux_pfu}] ---`);

    for (const sat of satConstellation) {
      const risk = riskEngine.assessAssetRisk(telemetry, sat);
      const posture = riskEngine.determinePosture(risk);

      console.log(` > ${sat.id} Risk: ${risk.toFixed(2)} | Rec Posture: ${posture}`);

      if (posture === SafetyPosture.MINIMAL_SURVIVAL) {
        await executor.execute({ 
          id: "CMD-01", satId: sat.id, type: 'ENTER_SAFE_MODE', riskImpact: 'HIGH' 
        });
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }
})();
