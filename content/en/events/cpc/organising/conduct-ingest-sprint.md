---
sidebarTitle: Conduct-Ingest Sprint
---

# Conduct-Ingest Sprint Timeframe & Pre-Production Launch Plan (`Milestone 3`)

This document sets the operational schedule for transitioning from Milestone 2 (Desk Research) to Milestone 3 (`Phase 3: Primary Fieldwork and Deep Dives, Weeks 7-12 — 22,000.00 ADA`), charting the pre-production launch gates (`Nov 14-20, 2026`) and the three fieldwork waves (`Nov 21 - Dec 30, 2026`) across the **Buenos Aires Hub**, **Lagos Hub**, **Nairobi Hub**, and **Barcelona Benchmark**.

---

## 1. Pre-Production Launch Gates (`Days 1-7: 14 Nov - 20 Nov 2026`)

No real stakeholder interview enters the system until the five pre-production readiness gates below are completed and verified on the production server:

| Gate | Target Date | Scope & Verification Standard | Lead Owners |
| :-: | :--- | :--- | :--- |
| **Gate 1: Consent Lock (`D30`) & Security Hardening** | **14-15 Nov 2026** | 1. **Lock `D30` (`PR #51`):** Finalise the 4 consent choices (`1. Private` [default], `2. Research`, `3. Anonymous public`, `4. Public, named`) + separate `AI model training` toggle (`Default: No`), pre-recording consent logging, unique **Withdrawal Reference Number**, 12-month retention limit, and Hub Lead read-aloud scripts.<br/>2. **`enrol` Production Auth Fix:** Restrict unauthenticated applicant read/delete endpoints and reject empty webhook secrets.<br/>3. **Vault Hardening:** Refuse startup without auth, drop revoked sessions immediately (`0s` delay), catch disguised contact details in the local identifier filter, and block `Anonymous` approval while any detected identifier remains unredacted.<br/>4. **AppView, `D31` (`#56`) & `dids`:** Clean up wallet history on link deletion, hide unverified wallet claims in research view, apply `D31` rotation-key 3-layer protections + strict CSP on `enrol`, and lock the open IPFS Pinata pinning endpoint on `dids`. | **Doko, Paul, Tabs & Abdulbasit** *(Security verification)* |
| **Gate 2: Hub & Team Enrolment Window Open** | **15-17 Nov 2026** | Deploy the finalised [Hub & Local Team Enrolment Requirements](/en/events/cpc/organising/enrolment/form-guidance/participants) across Prisma's `enrol` (`role: "hub"`) and Hub `enrol` (`role: "team"`). Onboard the 3 Priority Hubs (**Buenos Aires**, **Lagos**, **Nairobi**) + **Barcelona** and their 9 Local Project Teams (`3 teams per priority hub`) using **dedicated CIP-30 operational wallets** (`Eternl`, never personal or treasury wallets). | **Alfred, Tabs & Paul** + **Hub Leads** |
| **Gate 3: "Smooth as Silk" Local Actor UX Test** | **17-18 Nov 2026** | Run the single guided local-actor flow (`Sign in with dedicated wallet -> Get repo -> Add team -> Record`) with a cold tester who was not involved in building the software. Target: **under 5 minutes end-to-end with zero technical jargon**. | **Doko, Paul & Abdulbasit** *(Hub Lead UX proxy)* |
| **Gate 4: Server Ingest Path Verification** | **18-19 Nov 2026** | Verify the full server ingest pipeline on production hardware using synthetic test audio: `Telegram or web recording -> Encrypted Hub Vault -> Local Whisper transcription -> Local LLM identifier filter -> Human reviewer session -> Consent applied (Private default) -> Record published to Team Repo on Hub PDS -> Relay -> Tap -> AppView`. | **Doko, Paul & Abdulbasit** |
| **Gate 5: First Real End-to-End Production Interview** | **20 Nov 2026** | Conduct, transcribe, filter, review, and publish the **first real stakeholder interview** (with explicit pre-recording consent under `D30`) from one Local Team of our closest Hub, verifying the signed record (`strongRef` URI + CID) on the live server. | **Alfred, Doko, Paul & Lead Hub Team** |

---

## 2. Six-Week Conduct-Ingest Sprint Schedule (`Weeks 7-12: 21 Nov - 30 Dec 2026`)

Following Gate 5 (`20 Nov 2026`), the three Priority Hubs and the Barcelona Benchmark execute the **Conduct-Ingest Sprint** in three two-week waves to deliver the contractual minimum of **`30-45` interviews** (**`42-52` target**):

| Sprint Wave | Dates (`2026`) | Primary Counterparty Targets & Activities | Target Verified Ingests | Milestone / CPC Checkpoint |
| :--- | :--- | :--- | :-: | :--- |
| **Wave 1: Warm Access Cohort & Anchor Institutions** | **Weeks 7-8**<br/>(`21 Nov - 4 Dec`) | Convert the **`18 Warm Access`** counterparties across cooperative federations (`FACTTIC`), universities (`UNILAG`, `ABU Zaria`, `Strathmore`), export associations (`KTDA`, `KCCE`), payment sandboxes, and `Decidim` Barcelona. Enforce the **48-hour Conduct-to-Vault-Review SLA** and **72-hour Cross-Hub Verification SLA**. | **`16 - 18` verified records**<br/>*(Cumulative: `16-18`)* | **Week 8 Checkpoint (`4 Dec`):** *Stakeholder Access Check* — surface any non-responsive targets and trigger warm referral substitutions. |
| **Wave 2: Referred Counterparties, Regulators & Local Counsel** | **Weeks 9-10**<br/>(`5 Dec - 18 Dec`) | Execute **`18 Referred`** and priority **`Desk-Identified`** interviews with central bank/VASP regulatory specialists (`CNV`, `SEC Nigeria`, `CMA/CBK`, `BoG`), payment operators (`PSAVs`, `Yellow Card`, `Kotani Pay`), local legal counsel verification (`LC-01` to `LC-08`), and the `1-2` diagnostic land-registry calls (`H3`) in Lagos/Abuja. | **`16 - 20` verified records**<br/>*(Cumulative: `32-38` — passes `30` contractual floor)* | **Week 10 Checkpoint (`18 Dec`):** *Regulatory & Infrastructure Review* — lock legal counsel answers (`LC-01` to `LC-10`) and 8-category prerequisite ratings. |
| **Wave 3: Quota Completion, Contradiction Audits & M3 Freeze** | **Weeks 11-12**<br/>(`19 Dec - 30 Dec`) | Complete final **`10-14` interviews** to close any category gaps, finish 100% of cross-hub peer verification (`Step 5` of the verification checklist), resolve cross-respondent contradictions, update `H1-H15` dispositions (`Confirmed / Revised / Rejected`), and compile the **Milestone 3 Fieldwork Synthesis Report**. | **`10 - 14` verified records**<br/>*(Cumulative Final Total: **`42 - 52` verified records**)* | **Week 12 Checkpoint (`30 Dec`):** *Interim Findings Review & Milestone 3 Submission (`22,000.00 ADA`)*. |

---

## 3. Regional Hub & Team Quota Allocation (`42-52 Target`)

| Regional Hub & Cluster | Enrolled Teams |Tested Hypothesis Plays | Target Interviews (`Min-Max`) | Minimum Non-Cardano Independent Share | Minimum Respondent Categories Covered |Weekly Ingest Cadence (`Weeks 7-12`) |
| :--- | :-: | :--- | :-: | :-: | :-: | :-: |
| **Buenos Aires Hub** (`Southern Cone: AR, UY, PY`) | `3 Local Teams` | **`H6`** (B2B Cooperative USD Escrow)<br/>**`H7`** (`QuarkID` / W3C DID-VC Portability) | **`12 - 16`** | `>= 75%` (`>= 9-12` calls) | `>= 4 of 7` packs | `2 - 3` verified records / week |
| **Lagos Hub** (`West Africa: NG, GH, SN`) | `3 Local Teams` | **`H1`** (Wholesale B2B/MTO Corridors)<br/>**`H2`** (Academic & Guild Credentials)<br/>**`H3`** (`1-2` Call Land Registry Diagnostic) | **`14 - 18`** | `>= 75%` (`>= 11-14` calls) | `>= 4 of 7` packs | `2 - 3` verified records / week |
| **Nairobi Hub** (`East Africa: KE, RW, UG`) | `3 Local Teams` | **`H4`** (EAC & NGO Corridor Settlement)<br/>**`H5`** (`EUDR` Ag Export Traceability) | **`12 - 15`** | `>= 75%` (`>= 9-11` calls) | `>= 4 of 7` packs | `2 - 3` verified records / week |
| **Barcelona Benchmark** (`Iberia: ES`) | `1 Benchmark Team` | **`H11`** (`eIDAS 2.0` Cooperative VCs)<br/>**`H12`** (`Decidim` Participatory Audit Logs) | **`3 - 4`** | `>= 67%` (`>= 2-3` calls) | `>= 2 of 7` packs | `1` verified record / bi-weekly |
| **Total Phase 3 Sprint** | **`10 Teams`** (`9 EM + 1 EU`) | **`9 Active Field Plays`** (`H1-H7, H11-H12`) | **`42 - 52`** *(Contract min: `30-45`)* | **`>= 75%` Non-Cardano** (`Cardano Pack <= 25%`) | **All `7` Question Packs** | **`7 - 9` verified records / week** |

---

## 4. Per-Interview 72-Hour SLA (`Conduct -> Vault Filter -> Review -> Publish`)

Every single interview during the 6-week sprint follows a strict **72-hour turnaround SLA**:

1. **Hour 0 (Pre-Call & Conduct):** Team confirms [Pre-Recording Consent (`D30`)](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders), issues the participant's **Withdrawal Reference Number** (`Respondent_ID`), and conducts the 45-60 minute semi-structured interview anchored to the assembled Question Pack.
2. **Hours 0-12 (Encrypted Vault Intake & Local Processing):** Recording or Telegram voice/text intake lands in the **Encrypted Hub Vault** (`Choice 1: Private` by default). Local `Whisper` transcribes the audio on the hub server, and the local language model flags personal names, disguised contacts, and third-party identifiers.
3. **Hours 12-48 (Joint Team + Hub Vault Review):** The Team Interviewer and Designated Hub Vault Reviewer inspect the redacted transcript, map findings to the Decision Gates (`G1-G8`), and verify that **zero detected identifiers remain unredacted**. If the participant selected `Choice 3 (Anonymous public)` or `Choice 4 (Public, named)`, the Hub Reviewer approves and signs the filtered `ingest.json` record into the Team's AT Protocol repository (`D26`). If the participant selected `Choice 1 (Private)` or `Choice 2 (Research)`, the record remains strictly inside the Hub Vault.
4. **Hours 48-72 (Cross-Hub Peer Verification):** A designated verifier from a **second Regional Hub** (or the Project Lead) completes the 6-step verification check, confirming schema validity, non-Cardano quota compliance, and `CASS` / `RARF` evidence calibration.
