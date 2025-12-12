import { SafetyPosture } from '../../core/SharedTypes';

export enum OrbitClass {
  LEO = "LEO", // Low Earth Orbit (High Drag Risk)
  MEO = "MEO", // GPS/Nav (High Radiation Risk)
  GEO = "GEO", // Comms/Weather (High Charging Risk)
}

export interface SatelliteAsset {
  id: string;
  orbit: OrbitClass;
  shieldingFactor: number; // 0.0 (None) to 1.0 (Bunker)
  hasPropulsion: boolean;
}

export interface SpaceWeatherTelemetry {
  timestamp: string;
  kpIndex: number;          // 0-9 (Drag)
  protonFlux_pfu: number;   // > 10 MeV (Solar Panels/Sensor noise)
  electronFlux_pfu: number; // > 2 MeV (Internal Charging)
}

export interface OrbitMitigationAction {
  id: string;
  satId: string;
  type: 'ENTER_SAFE_MODE' | 'DISABLE_PAYLOAD' | 'ORBIT_RAISE_MANEUVER';
  riskImpact: 'LOW' | 'MEDIUM' | 'HIGH';
}
