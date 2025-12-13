# 📐 HELIOS Theoretical Framework: Planetary Defense

This document formalizes the decision-making logic used by the HELIOS **Planetary Defense Domain**. These algorithms define how the system transforms raw orbital state vectors into existential risk postures.

## 1. Introduction
The Planetary Defense module operates as a deterministic state machine. It consumes probabilistic data (impact likelihoods, orbital uncertainties) and outputs discrete coordination states (Safety Postures).

---

## 2. Algorithm 1: NEO Risk Assessment
**Goal:** Compute the `RiskCategory` and `MitigationPlan` for a given Near-Earth Object based on dynamic observation data.

**Inputs:**
* **N:** The Static NEO Object (Baseline parameters, Physical properties).
* **E:** The Ephemeris Snapshot (Current orbital uncertainty, Impact probability).
* **T:** Current Time (Epoch).

**Output:**
* **R:** Risk Assessment Structure (Category + Actions).

**Procedure:**

**1. Extract Parameters:**
* `P_impact` = E.updatedImpactProbability
* `S_torino` = E.updatedTorinoScale
* `t_remain` = (E.nextCloseApproach - T) [in Years]

**2. Determine Risk Category (C):**

| Condition | Resulting Category |
| :--- | :--- |
| `S_torino = 0` OR `P_impact < 10^-6` | **NO_RISK** |
| `S_torino` is 1 or 2 | **MONITOR** |
| `S_torino` is 3, 4, or 5 | **ELEVATED** |
| `S_torino` ≥ 6 | **EMERGENCY** |

**3. Derive Mitigation Actions (A):**
* *Initialize A as empty set*
* **IF** `C == MONITOR`:
    * ADD "Task Optical Observatories"
    * ADD "Request DSN Ranging"
* **IF** `C == ELEVATED`:
    * ADD "Notify IAWN"
    * ADD "Simulate Deflection (Kinetic)"
* **IF** `C == EMERGENCY`:
    * **IF** `t_remain > 5 years`:
        * ADD "Design Mission: Deflection"
    * **ELSE**:
        * ADD "Trigger Civil Protection"
        * ADD "Design Mission: Disruption"

**4. Return** `{ neoId: N.id, category: C, actions: A }`

---

## 3. Algorithm 2: Planetary Posture Coordination
**Goal:** Map a specific NEO risk assessment to a global HELIOS system posture.

**Inputs:**
* **R:** The Risk Assessment from Algorithm 1.

**Output:**
* **P:** The System Safety Posture.

**Procedure:**

**1. Evaluate Risk Level:**
We map the Risk Category `C` to the Safety Posture `P` using the following mapping:

| Risk Category (Input) | Safety Posture (Output) | Operational Context |
| :--- | :--- | :--- |
| **NO_RISK** | `NORMAL` | Standard sky survey operations. |
| **MONITOR** | `PRECAUTIONARY` | Heightened computational resource allocation for orbit determination. |
| **ELEVATED** | `DEFENSIVE` | Active mission planning; coordination with international bodies (IAWN). |
| **EMERGENCY** | `MINIMAL_SURVIVAL` | Existential threat mode. Priority shifts to continuity of species. |

**2. Return** `P`
