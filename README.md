# HELIOS ☀️🛡️
**Heuristic Event-driven Loop for Infrastructure & Operational Safety**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Architecture](https://img.shields.io/badge/architecture-multi--domain-orange)

HELIOS is an autonomous agent platform designed to protect critical infrastructure from **Carrington-class Geomagnetic Disturbance (GMD)** events.

Originally designed for **Power Grid** protection, HELIOS has evolved into a multi-domain safety system that simultaneously defends:
1.  **Terrestrial Assets:** High-Voltage Transformers (GIC saturation mitigation).
2.  **Orbital Assets:** LEO/GEO Satellites (Atmospheric drag & dielectric charging mitigation).

---

## 🚀 Mission
In the event of a massive Coronal Mass Ejection (CME), human response time is often too slow to prevent catastrophic damage. HELIOS acts as a **fail-safe automation layer** that:
* **Monitors** real-time space weather (NOAA SWPC feeds).
* **Calculates** domain-specific risk (e.g., Transformer heating vs. Satellite drag).
* **Enforces** a deterministic "Safety Posture" (e.g., `MINIMAL_SURVIVAL`).

---

## 🧠 Architecture
HELIOS utilizes a **Domain-Driven Design (DDD)** approach with a strict Event-Driven Architecture:

### 📂 Core (`src/core`)
The shared "brain" containing mathematical normalization (LogScale, Sigmoid) and the global `SafetyPosture` state machine.

### ⚡ Domain: Grid (`src/domains/grid`)
* **Threat:** Geomagnetically Induced Currents (GIC) caused by $dB/dt$.
* **Defense:** Load shedding, neutral isolation, and transformer de-energization.
* **Logic:** `GridRiskEngine` prioritizes assets based on geology and latitude.

### 🛰️ Domain: Orbit (`src/domains/orbit`)
* **Threat:** * **LEO:** Atmospheric Drag (Heat expansion from $K_p$).
    * **GEO:** Dielectric Charging (High-energy Electron flux).
* **Defense:** "Phoenix Mode" (Safe Mode), payload shutdown, orbit raising.
* **Logic:** `OrbitRiskEngine` distinguishes between orbit classes to apply specific mitigations.

---

## 📦 Installation

```bash
git clone [https://github.com/AdamBoxy/HELIOS.git](https://github.com/AdamBoxy/HELIOS.git)
cd HELIOS
npm install  
``` 

---


## 🛠️ Simulations
HELIOS includes two simulation suites to test system responses under "Carrington Event" conditions.

### Run the Grid Simulation
**Scenario:** A 2500 nT/min magnetic shockwave hits the substation.
```bash
npx ts-node tests/simulation.test.ts
```
### Run the Orbit Simulation
**Scenario:** An S5 Solar Radiation Storm hits a mixed LEO/GEO constellation.
```bash
npx ts-node tests/orbit_simulation.test.ts
```

---

## 🤝 Contribution
This project is an open concept for Safe AI/Human Teaming. We welcome PRs for:

New Domains (e.g., src/domains/aviation).

Real-world Protocol Drivers (DNP3, CCSDS).

License: MIT
