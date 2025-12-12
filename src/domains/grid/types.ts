import { SafetyPosture } from '../../core/SharedTypes';

export enum GridAssetClass {
  TRANSFORMER_GSU = "TRANSFORMER_GSU", // Generator Step-Up (High Value)
  TRANSFORMER_AUT = "TRANSFORMER_AUT", // Autotransformer
  TRANSMISSION_HV = "TRANSMISSION_HV"
}

/**
 * Real-time data from Ground Magnetometers.
 * Grid operators care about dB/dt (how fast the magnetic field changes).
 */
export interface GridWeatherTelemetry {
  timestamp: string;
  kpIndex: number;      // Planetary K-index (0-9)
  dBdt_nT_min: number;  // Local rate of change (The GIC driver)
  lat: number;          // Latitude (Higher lat = higher risk)
}

/**
 * Actions specific to managing electricity.
 */
export interface GridMitigationAction {
  id: string;
  assetId: string;
  type: 'DE_ENERGIZE' | 'REDUCE_LOAD' | 'ISOLATE_NEUTRAL';
  criticality: 'LOW' | 'HIGH' | 'EXTREME';
}
