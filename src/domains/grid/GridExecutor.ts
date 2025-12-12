import { MitigationAction } from '../types';

/**
 * The standard interface that any hardware driver must satisfy.
 * This allows you to swap "SimulatedGrid" for "SiemensScada" later without breaking code.
 */
interface GridControlInterface {
  sendCommand(assetId: string, command: string): Promise<boolean>;
  checkStatus(assetId: string): Promise<string>;
}

export class Executor {
  // A simple map to track which assets are currently "locked out" or busy
  private busyAssets: Set<string> = new Set();
  
  // Real world: This would be your DNP3 or Modbus connection
  private driver: GridControlInterface;

  constructor(customDriver?: GridControlInterface) {
    // If no real driver is provided, use the Mock (Simulation) driver
    this.driver = customDriver || new MockScadaDriver();
  }

  public async executeAction(action: MitigationAction): Promise<boolean> {
    if (this.busyAssets.has(action.id)) {
      console.log(`[EXECUTOR] ⚠️ SKIPPING: Asset ${action.id} is currently busy.`);
      return false;
    }

    this.busyAssets.add(action.id);
    console.log(`[EXECUTOR] ⚙️ INITIATING: ${action.type} on Asset ${action.id}...`);

    try {
      // 1. Send Command
      const success = await this.driver.sendCommand(action.id, action.type);
      
      // 2. Verify Physical State (Did the breaker actually open?)
      if (success) {
        const status = await this.driver.checkStatus(action.id);
        console.log(`[EXECUTOR] ✅ VERIFIED: Asset ${action.id} is now ${status}`);
        return true;
      } else {
        console.error(`[EXECUTOR] ❌ FAILURE: Hardware refused command.`);
        return false;
      }
    } catch (error) {
      console.error(`[EXECUTOR] 💥 EXCEPTION: SCADA Link Error`, error);
      return false;
    } finally {
      // Cool-down period: Don't allow another command to this asset for 5 seconds
      setTimeout(() => this.busyAssets.delete(action.id), 5000);
    }
  }
}

/**
 * A Mock Driver to simulate the time delay of physical switches
 */
class MockScadaDriver implements GridControlInterface {
  async sendCommand(id: string, cmd: string): Promise<boolean> {
    // Simulate network latency and mechanical delay (e.g., 200ms)
    return new Promise(resolve => setTimeout(() => resolve(true), 200));
  }
  
  async checkStatus(id: string): Promise<string> {
    return Promise.resolve("SAFE_STATE");
  }
}
