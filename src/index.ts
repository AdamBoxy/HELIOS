import { GridRiskEngine } from './domains/grid/GridRiskEngine';
import { OrbitRiskEngine } from './domains/orbit/OrbitRiskEngine';
import { SafetyPosture } from './core/SharedTypes';

// --- MOCK DATA GENERATORS ---
// (In production, these would be API clients to NOAA)
const getGridTelemetry = () => ({ 
  timestamp: new Date().toISOString(), kpIndex: 7, dBdt_nT_min: 400, lat: 50.0 
});

const getSpaceTelemetry = () => ({ 
  timestamp: new Date().toISOString(), kpIndex: 7, protonFlux_pfu: 5000, electronFlux_pfu: 1000 
});

// --- MAIN LOOP ---
async function main() {
  console.log("☀️  HELIOS PLATFORM STARTING... [Multi-Domain Mode]\n");

  const gridEngine = new GridRiskEngine();
  const orbitEngine = new OrbitRiskEngine();

  // Mock Assets
  const myTransformer = { id: "TX-01", lat: 50.0, criticality: 0.9 }; // High value
  const mySatellite = { id: "SAT-LEO-99", orbit: "LEO" as any, shieldingFactor: 0.5, hasPropulsion: true };

  // THE LOOP
  setInterval(() => {
    console.log("------------------------------------------------");
    
    // 1. GRID DOMAIN
    const gridTelem = getGridTelemetry();
    const gridRisk = gridEngine.assessAssetRisk(gridTelem, myTransformer as any); // (Cast as any for quick test)
    const gridPosture = gridEngine.determinePosture(gridRisk);
    console.log(`[GRID]  TX-01 Risk: ${(gridRisk * 100).toFixed(0)}% | Posture: ${gridPosture}`);

    // 2. ORBIT DOMAIN
    const spaceTelem = getSpaceTelemetry();
    const orbitRisk = orbitEngine.assessAssetRisk(spaceTelem, mySatellite);
    const orbitPosture = orbitEngine.determinePosture(orbitRisk);
    console.log(`[ORBIT] SAT-99 Risk: ${(orbitRisk * 100).toFixed(0)}% | Posture: ${orbitPosture}`);

  }, 3000); // Run every 3 seconds
}

main();
