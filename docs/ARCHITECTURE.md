**Project:** HELIOS (Heuristic Event-driven Loop for Infrastructure & Operational Safety)  
**Context:** GMD (Geomagnetic Disturbance) Mitigation Level 5  
**Version:** 2.1-Optimized

## 1\. System Overview

HELIOS is an autonomous agent system designed to protect critical power grid infrastructure (specifically High-Voltage Transformers) from geomagnetically induced currents (GIC) caused by Carrington-class solar events.

Unlike standard SCADA automation, HELIOS prioritizes **asset preservation** over **service continuity** during extreme events ($Kp > 8$).

## 2\. Threat Model

  * **Vector:** Coronal Mass Ejection (CME) leading to magnetosphere compression.
  * **Physical Impact:** Quasi-DC currents saturate transformer cores $\rightarrow$ Harmonic generation $\rightarrow$ Overheating/Vibration $\rightarrow$ Catastrophic Failure.
  * **Operational Constraint:** Human operators may be overwhelmed by alarm floods. HELIOS acts as a filter and a safety interlock.

## 3\. Architecture & Data Flow

The system utilizes a **Reactive Agent Pattern**:

1.  **Ingest:** `SpaceWeatherWatcher` streams NOAA JSON feeds via WebSocket.
2.  **Process:** `SafetyCoordinator` calculates the System Severity Index (SSI).
3.  **State:** If SSI exceeds thresholds, Global Posture updates (`NORMAL` $\rightarrow$ `DEFENSIVE`).
4.  **Plan:** `MitigationPlanner` queries the Asset Database for high-GIC-risk nodes (long transmission lines, specific geologic conductivity) and generates a candidate `ActionList`.
5.  **Filter:** `PolicyGate` removes actions violating current safety rules.
6.  **Execute:** `Executor` sends DNP3/Modbus commands to substation RTUs.

## 4\. Safety Constraints (The Three Laws of HELIOS)

1.  **Do No Harm:** In `NORMAL` state, the system represents `Read-Only` authority. It cannot act.
2.  **Fail Safe:** In the event of sensor loss or telemetry timeout, the system maintains the *last known safe configuration* and alerts operators. It does *not* auto-trigger protective trips on stale data.
3.  **Human Supremacy:** Any automated action scheduled for `MINIMAL_SURVIVAL` mode that involves load shedding \> 50MW requires cryptographic signing (Human Approval) unless `EmergencyOverride` is active.

## 5\. Black-Start Preservation Strategy

Upon entering `MINIMAL_SURVIVAL`:

  * **Snapshot:** Current SCADA state is serialized to immutable storage (WORM drive).
  * **Isolate:** Non-essential telemetry links are severed to reduce bandwidth congestion.
  * **Prioritize:** Communications are routed strictly to Black-Start Units (BSU).
