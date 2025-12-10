import { SafetyPosture, MitigationAction } from '../types';

export class PolicyGate {
  /**
   * The "Veto" function. Returns TRUE if action is safe to execute.
   */
  public async validate(action: MitigationAction, posture: SafetyPosture): Promise<boolean> {
    
    console.log(`[GATE] Reviewing Action: ${action.type} | Current Posture: ${posture}`);

    // LAW 1: Do No Harm (Read-Only in NORMAL)
    if (posture === SafetyPosture.NORMAL) {
      console.log(`[GATE] 🛑 BLOCKED: Cannot execute actions in NORMAL posture.`);
      return false;
    }

    // LAW 2: Fail Safe (No Destructive actions without specific high-threat triggers)
    if (action.criticality === 'EXTREME' && posture !== SafetyPosture.MINIMAL_SURVIVAL) {
      console.log(`[GATE] 🛑 BLOCKED: Extreme action requires MINIMAL_SURVIVAL posture.`);
      return false;
    }

    // LAW 3: Human Supremacy (Simulated)
    // In a real system, this would await an async API call to a Human Operator dashboard.
    if (posture === SafetyPosture.MINIMAL_SURVIVAL && action.type === 'DE_ENERGIZE') {
      console.log(`[GATE] ⚠️  REQUIRES APPROVAL: Creating urgent ticket for Operator...`);
      // Simulating a fast human approval for the test
      const humanApproved = await this.mockHumanApproval(); 
      if (humanApproved) {
        console.log(`[GATE] ✅ APPROVED: Operator signed off.`);
        return true;
      }
      return false;
    }

    // Default: Allow standard defensive maneuvers
    console.log(`[GATE] ✅ AUTO-ALLOWED: Standard defensive maneuver.`);
    return true;
  }

  private mockHumanApproval(): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
}
