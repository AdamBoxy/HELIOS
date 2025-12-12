import { OrbitMitigationAction } from './types';

interface SatCommsInterface {
  uplinkCommand(satId: string, hexCode: string): Promise<boolean>;
}

export class SatExecutor {
  private comms: SatCommsInterface;

  constructor(mockComms?: SatCommsInterface) {
    this.comms = mockComms || new MockGroundStation();
  }

  public async execute(action: OrbitMitigationAction): Promise<boolean> {
    console.log(`[ORBIT_OPS] 📡 UPLINKING: ${action.type} to ${action.satId}`);

    // Mapping high-level intent to specific Hex Codes
    let hexCommand = "";
    switch (action.type) {
      case 'ENTER_SAFE_MODE':
        hexCommand = "0xDEADBEEF"; // Standard "Phoenix" trigger
        break;
      case 'DISABLE_PAYLOAD':
        hexCommand = "0xCAFEBABE";
        break;
      case 'ORBIT_RAISE_MANEUVER':
        hexCommand = "0xB00ST001";
        break;
    }

    try {
      const success = await this.comms.uplinkCommand(action.satId, hexCommand);
      if (success) console.log(`[ORBIT_OPS] ✅ ACK: ${action.satId} confirmed state change.`);
      return success;
    } catch (err) {
      console.error(`[ORBIT_OPS] ❌ LOSS OF SIGNAL: Could not reach ${action.satId}`);
      return false;
    }
  }
}

class MockGroundStation implements SatCommsInterface {
  async uplinkCommand(id: string, code: string): Promise<boolean> {
    return new Promise(r => setTimeout(() => r(true), 1200)); // 1.2s light speed/network delay
  }
}
