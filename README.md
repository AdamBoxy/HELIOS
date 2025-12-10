# HELIOS ☀️🛡️
**Heuristic Event-driven Loop for Infrastructure & Operational Safety**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Safety Level](https://img.shields.io/badge/safety-SIL4-red)

HELIOS is an autonomous agent framework designed to protect critical power grid infrastructure during **Carrington-class Geomagnetic Disturbance (GMD)** events.

## 🚀 Mission
In the event of a massive Coronal Mass Ejection (CME), human response time (minutes) may be too slow to prevent transformer saturation. HELIOS acts as a **fail-safe automation layer** that:
1. Monitors real-time magnetometer (dB/dt) feeds.
2. Calculates instantaneous risk to Transformer assets.
3. Enforces a **deterministic safety posture** (e.g., shifting to `MINIMAL_SURVIVAL` mode).

## 🧠 Architecture
HELIOS uses a strict **Event-Driven Architecture**:
* **Sensors**: Ingest NOAA SWPC JSON feeds.
* **Risk Engine**: Normalizes `Kp` and `dB/dt` into a scalar `SeverityIndex`.
* **Policy Gate**: A "Human-in-the-loop" circuit breaker that forbids destructive actions unless strict criteria are met.

## 📦 Installation
```bash
git clone [https://github.com/yourusername/helios-gmd.git](https://github.com/yourusername/helios-gmd.git)
cd helios-gmd
npm install
npm start
