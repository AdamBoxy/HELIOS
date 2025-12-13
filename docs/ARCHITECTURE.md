**Project:** HELIOS (Heuristic Event-driven Loop for Infrastructure & Operational Safety)  
**Context:** GMD (Geomagnetic Disturbance) Mitigation Level 5  
**Version:** 2.2-Optimized

# 🏛️ HELIOS System Architecture

HELIOS is a multi-domain resilience framework designed to facilitate AI/Human teaming during extreme space weather events. It operates as a middleware layer between raw telemetry streams and critical infrastructure control interfaces.

## 1. High-Level Design
The system follows a **Hexagonal Architecture (Ports and Adapters)**. The core logic (Safety/Policy Engine) is isolated from the external domains (Power Grid, Satellite Constellations), allowing for distinct simulation drivers for each environment.

### Core Components
* **Sentinel Engine:** The central AI reasoning unit that monitors telemetry for "Carrington-level" anomalies.
* **Policy Registry:** A immutable set of safety constraints (e.g., "Do not disconnect hospitals," "Do not de-orbit without human key-turn").
* **Human-in-the-Loop (HITL) Interface:** A required approval gate for high-stakes actions.

---

## 2. Directory Structure & Domains
The codebase is organized by physical domain, treating Space and Earth as distinct operational contexts.

```text
src/
├── core/                  # Shared AI reasoning & Policy Engine
├── domains/
│   ├── grid/              # Terrestrial Power Systems
│   │   ├── adapters/      # DNP3 / IEC 61850 drivers
│   │   └── models/        # Substation, Transformer
│   ├── orbit/             # Space Systems
│   │   ├── adapters/      # CCSDS / CSP drivers
│   │   └── models/        # Satellite (LEO/GEO)
│   └── neo/               # <--- NEW: Planetary Defense
│       ├── adapters/      # CNEOS / ADES drivers
│       └── models/        # Asteroid, Ephemeris
└── simulations/           # Chaos Engineering Scenarios
```

---

## 3. Supported Domains

### 🌍 A. Terrestrial Grid (Power)
Focuses on GIC (Geomagnetically Induced Currents) management.
* **Input:** Magnetometer readings (nT/min).
* **Assets:** Substations, Transformers.
* **Protocol:** DNP3 (Distributed Network Protocol).
* **Critical Threshold:** > 2000 nT/min (simulated coil saturation).

### 🛰️ B. Orbital Constellation (Space)
Focuses on SEU (Single Event Upsets) and drag analysis during solar events.
* **Input:** Solar Flux (SFU), Proton Density, Kp Index.
* **Assets:** Mixed LEO/GEO Constellations.
* **Protocol:** CCSDS (Consultative Committee for Space Data Systems) Telemetry packets.
* **Critical Threshold:** S5 Radiation Storm (Particle flux > 10⁵ pfu).

### ☄️ C. Planetary Defense (NEO)
Focuses on long-horizon kinetic impact threats from Near-Earth Objects.
* **Input:** Ephemeris Data (Orbital State Vectors), Impact Probability.
* **Assets:** Ground Optical (Pan-STARRS, ATLAS), Space IR (NEO Surveyor), Planetary Radar (Goldstone).
* **Protocol:** ADES (Astronomy Data Exchange Standard) / CNEOS API.
* **Critical Threshold:** Torino Scale ≥ 5 (Threatening) OR Impact Probability > 1% (IAWN Warning Threshold).

Output: Coordination signals for IAWN (International Asteroid Warning Network) and civil protection agencies.
---

## 4. Simulation Engine
The simulation engine injects synthetic telemetry into the adapters to validate system response.

| Scenario | Domain | Trigger | Expected Response |
| :--- | :--- | :--- | :--- |
| **Magnetic Shockwave** | Grid | 2500 nT/min surge | Isolate transformer, reroute load, alert operator. |
| **S5 Radiation Storm** | Orbit | High Energy Proton spike | **Safe Mode:** Power down non-essential payloads, orient solar panels for drag reduction. |
| **2025 XZ Incident** | NEO | Impact Prob > 1% | **Defensive Mode:** Task radar ranging, notify IAWN, simulate kinetic deflection missions. |  

## 5. Data Flow (Orbit Scenario)

1.  **Ingest:** `OrbitAdapter` receives a mock CCSDS packet indicating a sharp rise in battery temperature and logic errors (SEUs).
2.  **Detection:** `Sentinel Engine` correlates internal telemetry with external Space Weather API data (simulated).
3.  **Proposal:** AI proposes "Enter Safe Mode" to prevent permanent latch-up.
4.  **Verification:** The system locks execution until a cryptographically signed Human acknowledgment is received (simulated via CLI).
5.  **Execution:** Command sent via Telecommand (TC) frame.


## Black-Start Preservation Strategy

Upon entering `MINIMAL_SURVIVAL`:

  * **Snapshot:** Current SCADA state is serialized to immutable storage (WORM drive).
  * **Isolate:** Non-essential telemetry links are severed to reduce bandwidth congestion.
  * **Prioritize:** Communications are routed strictly to Black-Start Units (BSU).
