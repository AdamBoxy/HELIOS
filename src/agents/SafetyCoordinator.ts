import { EventEmitter } from 'events';
import { RiskEngine } from '../core/RiskEngine';
import { SafetyPosture, SpaceWeatherTelemetry } from '../types';

export class SafetyCoordinator extends EventEmitter {
  private posture: SafetyPosture = SafetyPosture.NORMAL;
  private riskEngine: RiskEngine;

  constructor() {
    super();
    this.riskEngine = new RiskEngine();
  }

  public ingest(telemetry: SpaceWeatherTelemetry) {
    const severity = this.riskEngine.calculateSeverity(telemetry);
    const target = this.riskEngine.determinePosture(severity);

    if (target !== this.posture) {
      this.transition(target, severity);
    }
  }

  private transition(to: SafetyPosture, severity: number) {
    console.log(`[STATE_CHANGE] ${this.posture} -> ${to} (Severity: ${severity.toFixed(2)})`);
    this.posture = to;
    this.emit('POSTURE_UPDATE', this.posture);
  }
}
