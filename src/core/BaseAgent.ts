/**
 * The Abstract Parent for all HELIOS Agents.
 * Enforces standard logging and identity.
 */
export abstract class BaseAgent {
  protected id: string;
  protected name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  /**
   * Standardized logging with timestamps
   */
  protected log(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // Simple time format
    const icon = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️ ' : 'ℹ️ ';
    console.log(`[${timestamp}] [${this.name}] ${icon} ${message}`);
  }
}
