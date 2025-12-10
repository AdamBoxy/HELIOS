export class MathUtils {
  
  /**
   * Restricts a value to be within a specific range.
   * Crucial for normalizing sensor inputs (0.0 - 1.0).
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Logarithmic scaling for huge ranges. 
   * Useful because GMD spikes can range from 10 nT to 5000 nT.
   * This prevents small fluctuations from looking like zero.
   */
  static logScale(value: number, max: number): number {
    if (value <= 0) return 0;
    const logVal = Math.log10(value + 1); // +1 prevents log(0) error
    const logMax = Math.log10(max + 1);
    return this.clamp(logVal / logMax, 0, 1);
  }

  /**
   * A rolling buffer to smooth out noise.
   * Returns the average of the last N samples.
   */
  static calculateMovingAverage(buffer: number[], newValue: number, windowSize: number): number {
    buffer.push(newValue);
    if (buffer.length > windowSize) {
      buffer.shift(); // Remove oldest
    }
    const sum = buffer.reduce((a, b) => a + b, 0);
    return sum / buffer.length;
  }
}
