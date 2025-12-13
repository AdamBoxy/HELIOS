// tests/neo_simulation.test.ts
import { NeoRiskEngine } from '../src/domains/neo/risk_engine';
import { PlanetarySafetyCoordinator } from '../src/domains/neo/coordinator';
import { NeoObject, NeoEphemerisSnapshot, RiskCategory } from '../src/domains/neo/models';
import { SafetyPosture } from '../src/core/types';

// Mock Data: The Asteroid "2025 XZ"
const asteroid2025XZ: NeoObject = {
  id: "2025 XZ",
  name: "2025 XZ",
  diameterMeters: 340, // Serious regional damage size (Apophis scale)
  isPotentiallyHazardous: true,
  orbitPeriodYears: 1.2,
  baselineTorinoScale: 0,
  baselineImpactProbability: 1e-7, // 1 in 10 million (Discovery)
};

async function runNeoSimulation() {
  console.log("☄️  Initializing HELIOS Planetary Defense Simulation...");
  console.log("-------------------------------------------------------");

  const riskEngine = new NeoRiskEngine();
  const coordinator = new PlanetarySafetyCoordinator();

  // --- STEP 1: Discovery Phase (Low Risk) ---
  console.log("\n[Day 0] New Object Detected: 2025 XZ");
  
  const initialSnapshot: NeoEphemerisSnapshot = {
    neoId: "2025 XZ",
    timestamp: new Date().toISOString(),
    observationArcDays: 1,
    uncertaintyClass: 'HIGH',
    updatedImpactProbability: 1e-6,
    updatedTorinoScale: 0,
    timeToImpactYears: 12.5
  };

  let assessment = riskEngine.assess(asteroid2025XZ, initialSnapshot);
  let posture = coordinator.determinePosture(assessment);

  console.log(` > Risk Category: ${assessment.riskCategory}`); // NO_RISK
  console.log(` > Posture:       ${posture}`);               // NORMAL

  // --- STEP 2: The "Close Call" Update (Risk Spikes) ---
  console.log("\n[Day 3] Optical & Radar refinement complete. Updating Ephemeris...");
  
  // Simulation: Orbit determination converges on Earth impact
  const refinedSnapshot: NeoEphemerisSnapshot = {
    neoId: "2025 XZ",
    timestamp: new Date(Date.now() + 3 * 86400000).toISOString(), // +3 days
    observationArcDays: 4,
    uncertaintyClass: 'LOW',
    updatedImpactProbability: 0.02, // 2% chance (Very high for space)
    updatedTorinoScale: 4,          // Yellow/Orange Zone
    timeToImpactYears: 12.5
  };

  assessment = riskEngine.assess(asteroid2025XZ, refinedSnapshot);
  posture = coordinator.determinePosture(assessment);

  console.log(`⚠️ CRITICAL UPDATE RECEIVED`);
  console.log(` > Impact Probability: ${(assessment.impactProbability * 100).toFixed(1)}%`);
  console.log(` > Torino Scale:       ${assessment.torinoScale} (Merits attention by public)`);
  console.log(` > Risk Category:      ${assessment.riskCategory}`); // ELEVATED
  console.log(` > HELIOS Posture:     ${posture}`);               // DEFENSIVE

  console.log("\n[Coordinator] Generating Response Actions:");
  assessment.recommendedMitigations.forEach(action => {
    console.log(`   - [EXEC] ${action}`);
  });

  // Assertion logic (simulated)
  if (posture === SafetyPosture.DEFENSIVE && assessment.riskCategory === 'ELEVATED') {
    console.log("\n✅ SUCCESS: HELIOS correctly escalated posture based on orbital mechanics.");
  } else {
    console.error("\n❌ FAILURE: System failed to react to planetary threat.");
  }
  console.log("-------------------------------------------------------");
}

runNeoSimulation();
