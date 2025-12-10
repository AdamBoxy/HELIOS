// Immutable definitions for system state
export enum SafetyPosture {
  NORMAL = "NORMAL",
  PRECAUTIONARY = "PRECAUTIONARY",
  DEFENSIVE = "DEFENSIVE",
  MINIMAL_SURVIVAL = "MINIMAL_SURVIVAL"
}

export interface SpaceWeatherTelemetry {
  timestamp: string;
  kpIndex: number;      // 0-9
  dBdt_nT_min: number;  // Rate of change
  lat: number;
}

export interface MitigationAction {
  id: string;
  type: 'DE_ENERGIZE' | 'REDUCE_LOAD' | 'ISOLATE_NEUTRAL';
  criticality: 'LOW' | 'HIGH' | 'EXTREME';
}
