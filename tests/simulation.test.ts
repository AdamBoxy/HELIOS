import { SafetyCoordinator } from '../src/agents/SafetyCoordinator';
import { PolicyGate } from '../src/agents/PolicyGate';
import { SpaceWeatherTelemetry, SafetyPosture, MitigationAction } from '../src/types';

// --- SETUP ---
const coordinator = new SafetyCoordinator();
const policyGate = new PolicyGate();

// Mock Actuators
const execute = (action: string) => console.log(`[HARDWARE] ⚡ EXECUTING: ${action}`);

console.log("=================================================");
console.log("   HELIOS SYSTEM: CARRINGTON EVENT SIMULATION    ");
console.log("=================================================\n");

// --- THE SCENARIO DATA STREAM ---
const scenarioEvents: SpaceWeatherTelemetry[] = [
  // T=0: Calm before the storm
  { timestamp: "T+00m", kpIndex: 2, dBdt_nT_min: 10, lat: 45.0 },
  
  // T=15: Sudden Impulse (The shockwave hits)
  { timestamp: "T+15m", kpIndex: 6, dBdt_nT_min: 300, lat: 45.0 },
  
  // T=30: The Main Phase (Geomagnetic Storm)
  { timestamp: "T+30m", kpIndex: 8, dBdt_nT_min: 850, lat: 45.0 },
  
  // T=45: CARRINGTON EVENT PEAK (Extreme GIC risk)
  { timestamp: "T+45m", kpIndex: 9, dBdt_nT_min: 2500, lat: 45.0 },
];

// --- THE LOOP ---
(async () => {
  
  for (const telemetry of scenarioEvents) {
    console.log(`\n--- INGESTING TELEMETRY: ${telemetry.timestamp} ---`);
    console.log(`Data: Kp=${telemetry.kpIndex}, dB/dt=${telemetry.dBdt_nT_min} nT/min`);

    // 1. Ingest Data & Update State
    coordinator.ingest(telemetry);
    const currentPosture = (coordinator as any).posture; // Accessing state for test

    // 2. Mock Agent Logic: "If dangerous, propose action"
    // (In the full repo, the MitigationPlanner agent would do this)
    if (currentPosture === SafetyPosture.MINIMAL_SURVIVAL) {
      const urgentAction: MitigationAction = {
        id: "ACT-99",
        type: 'DE_ENERGIZE',
        criticality: 'EXTREME'
      };

      // 3. Pass through Policy Gate
      const isAllowed = await policyGate.validate(urgentAction, currentPosture);

      // 4. Execute if allowed
      if (isAllowed) {
        execute("OPEN_BREAKER_GSU_TRANSFORMER_01");
      }
    } else if (currentPosture === SafetyPosture.DEFENSIVE) {
        const warningAction: MitigationAction = {
            id: "ACT-50",
            type: 'REDUCE_LOAD',
            criticality: 'HIGH'
        }
        const isAllowed = await policyGate.validate(warningAction, currentPosture);
        if(isAllowed) execute("REDUCE_GENERATOR_OUTPUT_10%");
    }

    // Wait 2 seconds between "minutes" to make the console log readable
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("\n=================================================");
  console.log("           SIMULATION COMPLETE                   ");
  console.log("=================================================");

})();
