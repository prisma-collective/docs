---
sidebarTitle: "Schema & Verification Protocol"
---

# Data Ingestion Schema and Fieldwork Verification Protocol

This specification defines the Phase 2-3 interview ingestion schema (`ingest.json` v2.0) and the cross-hub verification workflow that govern primary data collection during Phase 3 fieldwork (Weeks 7-12), extending the Milestone 1 [Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest), [Verify](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/verify), and [Conduct](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/conduct) methodology .

The protocol ensures that every stakeholder interview conducted across the three active emerging-market Regional Hubs (**Buenos Aires Hub**, **Lagos Hub**, and **Nairobi Hub**, operating with `3 Local Project Teams per hub = 9 Local Teams` total) maps directly to the eight research Decision Gates while protecting human-subject privacy under applicable national data protection statutes (`Nigeria NDPA 2023`, `Kenya DPA 2019 s. 40`, `Argentina Law 25.326`, and `EU GDPR`).

---

## 1. Methodological Objectives for Phase 3 Data Governance

Before initiating primary interviews in Week 7, the research team finalized two structural enhancements to the Milestone 1 data ingestion pipeline:

1. **End-to-End Decision-Gate Traceability:** The Milestone 1 base ingestion schema (`ingest.json`) has been expanded so that every verified interview record explicitly captures findings across all eight research Decision Gates (`Gate 1: Regions`, `Gate 2: Use cases`, `Gate 3: Counterparties`, `Gate 4: Regulation`, `Gate 5: Infrastructure`, `Gate 6: Delivery model`, `Gate 7: Adoption`, and `Gate 8: Cross-RFP handoffs`), alongside paired regulatory certainty ratings, local legal counsel triggers, five-tier counterparty access progression, eight-category infrastructure ratings, and four-tier `CASS` adoption signal evaluations.
2. **Uniform Cross-Hub Verification Standards:** A standardized six-step quality-assurance and cryptographic co-signing workflow applies across all three participating regional hubs (**Buenos Aires Hub**, **Lagos Hub**, and **Nairobi Hub**) and their nine Local Project Teams, ensuring consistent role separation, personal-data redaction, and inter-rater calibration throughout Phase 3.

---

## 2. Three-Layer Privacy and Provenance Architecture

The research data infrastructure  separates confidential raw human-subject material, public cryptographic provenance, and self-contained research deliverables into three distinct operational layers:

```mermaid
flowchart TD
    subgraph L1["Layer 1: Encrypted Local Hub Vault (Confidential Raw Layer)"]
        A["Field Interview Audio, Unredacted Transcript & Signed Consent Record"] --> B["Local Hub Private Vault (AES-256-GCM Encrypted at Rest)"]
        B --> C["Compute SHA-256 Content Fingerprint (recordingHash) & Redact Personal Identifiers"]
    end

    subgraph L2["Layer 2: Signed Distributed Research Repository (Public Provenance Layer)"]
        C --> D["Independent Hub Reviewer Audits Redaction & Co-Signs via CIP-0030 Wallet (did:cardano)"]
        D --> E["Hub Node Publishes Consent-Cleared Summary Record (ingest.json v2.0)"]
        E --> F["Relay & Indexing Service Verifies Repository Signature & Aggregates Cross-Hub Telemetry"]
    end

    subgraph L3["Layer 3: Published Research Deliverables (Self-Contained Markdown Reports)"]
        F --> G["Self-Contained Markdown Synthesis Tables + Immutable Content Reference (strongRef: URI + CID)"]
    end
```

### Key Architectural Controls Across the Three Layers

| Architectural Control | Technical Mechanism  | Governance & Privacy Function During Phase 3 Fieldwork (`Weeks 7-12`) |
| :--- | :--- | :--- |
| **1. Standard Repository Synchronization** | Regional hub Personal Data Servers (`PDS`) synchronize signed records through a standard AT Protocol relay and indexing pipeline into a unified research aggregation service (`AppView`). | Ensures that every record mutation is cryptographically verified against the regional hub or field team's Decentralized Identifier (`DID`) signing key prior to indexing . |
| **2. Research Lexicon Schemas (`events.prisma.*` & `eventId` Namespace Evolution)** | Working JSON Lexicon schemas in `at-pds` and `at-tap` today (`events.prisma.hub.profile`, `events.prisma.hub.deployment`, `events.prisma.hub.team`, and the working interview structure `events.prisma.evidence.interview` keyed by the recording's `sha256` fingerprint with `text`, `consentScope`, `topic`, `media`, `recordedAt`, `authorDid`, and `createdAt`). **The final interview record Lexicon namespace is currently being finalised by the Infrastructure Lead (Tobias Fechner) to incorporate `eventId` directly into the namespace**, and extended research analysis fields (`ingest.json` v2.0 Decision-Gate blocks) will be introduced via a dedicated Lexicon pull request once the core `eventId` namespace is locked. | Enforces automated schema validation at repository publishing time while ensuring that unmerged analytical fields are never treated as live wire requirements before their Lexicon pull request lands. |
| **3. Dual Identity Binding (`did:plc` / `did:web` + `did:cardano`)** | Self-certifying `did:cardano:stake1...` identifiers verified via Bech32 stake-address parsing, `Ed25519` public-key extraction from `CIP-0030` / `CIP-0008` `COSE_Sign1` signatures, and `Blake2b-224` key-hash matching. | Binds each regional hub (**Buenos Aires**, **Lagos**, **Nairobi**) and independent reviewer to both a repository `DID` and a verifiable Cardano stake keypair. |
| **4. Hub Vault Web Form Walkthrough & Resilient Connectivity** | Local teams sign in to the **Hub Vault Web Form** with their dedicated project wallet, upload the interview recording and structured notes over HTTPS (`port 443`), the local filter flags personal and third-party identifiers, a Hub Lead or Reviewer inspects and approves on `/review`, and only approved records move forward to publication (with `events-cli` command-line integration documented separately as confirmed by the CLI engineering lead). | Provides a low-friction browser workflow for field researchers in Lagos, Nairobi, and Buenos Aires while preserving strict reviewer sign-off boundaries. |
| **5. Confidential Local Vault & Unified Four-Choice Consent Model (`1:1 M1 Mapping`)** | Private per-team blob storage encrypted at rest (`HKDF-SHA256` per-repo keys) paired with four ready-made consent choices that unify the Milestone 1 research design with the Hub Vault form and codebase:<br/>- **`Private`** *(Vault-only safe default)*: Raw recording and notes stay strictly in the encrypted Hub Vault for internal scoring.<br/>- **`Research`** *(maps to M1 Confidential Synthesis)*: Personal and third-party identifiers redacted; edited transcript accessible only to CPC reviewers and authorised PRISMA synthesis researchers inside the vault; never published to a public repo.<br/>- **`Anonymous public`** *(maps to M1 Role-Only Anonymised)*: Personal and organisation identifiers redacted; approved anonymous findings and role-level quotes published to the repository (`consentScope: "anonymous"`).<br/>- **`Public named`** *(maps to M1 Full Attribution)*: Participant-approved statements published with name, role, and organisation (`consentScope: "public"`).<br/>Includes a separate `AI model training` consent question (`No` by default). | **Zero raw data leaves the Hub Vault.** While teams record consent preferences upfront before recording begins, **all real interviews captured from 21 November onwards remain held strictly as `Private` inside the encrypted Hub Vault until (a) the final four-choice consent specification and its five privacy/redaction safeguards are formally locked, and (b) the local transcription and redaction filter step is live and verified on the pilot server**, because any record published to an AT Protocol repository is public permanently. |
| **6. Deterministic Retraction, Backup Purge & Post-Ingest `CIP-0020` Batch Anchoring** | Every participant receives a withdrawal reference code (`e.g. WA-LOS-REG-02`) before recording begins. Withdrawal removes records from the hub vault, purges `at-pds` CAR backups, and propagates repository tombstones (`uri, cid, rev`), with a mandatory 12-month deletion ceiling on all raw media. **Cardano `CIP-0020` on-chain transaction metadata batching (`label 199675`) is not a prerequisite blocker for starting real interviews on 21 November**; because real interviews captured from 21 November stay private in the Hub Vault until the consent and filter gates lock, `CIP-0020` batch anchoring cleanly follows *after* the first verified ingest and publication wave. | Guarantees compliance with statutory data-suppression and erasure rights under `Nigeria NDPA 2023`, `Kenya DPA 2019`, `Argentina Law 25.326`, and `EU GDPR` without delaying day-one field capture. |

---

## 3. Working Repository Record (`events.prisma.evidence.interview`) and Phase 2-3 Analytical Template (`ingest.json` v2.0)

To keep documentation, forms, and code strictly aligned with live repository state, the Phase 2-3 specification distinguishes between two layers:

1. **The Working Repository Record in `at-pds` and `at-tap` Today (`events.prisma.evidence.interview`):** Currently implemented in code with `text`, `consentScope` (supporting `public` or `anonymous` in code today, and expanding to the full four-choice consent model once the consent specification is locked), `topic`, `media` (`sha256`, `mimeType`, `kind`), `recordedAt`, `authorDid`, and `createdAt`. As noted by the Infrastructure Lead (Tobias Fechner), **the final interview record Lexicon namespace is currently being finalised to incorporate `eventId` directly into the namespace**.
2. **The Phase 2-3 Extended Research Analysis Template (`ingest.json` v2.0):** Captures the structured CPC research fields across all eight Decision Gates (`decision_gates`, `counterparty_lead`, `regulatory_finding`, `infrastructure_assessment`, `adoption_signal`, and `cross_rfp_handoff`). Until a dedicated Lexicon pull request is opened and merged following `eventId` namespace finalization, these structured analytical blocks are stored inside the encrypted Hub Vault draft and formatted into the approved `text` body of the interview record rather than being required as standalone `at-pds` wire fields.

### 3.1 Working Wire-Level Lexicon Record (`events.prisma.evidence.interview` - Pending `eventId` Namespace Finalization)

When a reviewed interview is approved for repository publication (`consentScope: "anonymous"` for **Anonymous public** or `"public"` for **Public named**, once the consent and pilot filter gates are locked), the Hub Vault writes the record using the reviewer's authenticated `at-pds` wallet session, keyed by the vault recording's `sha256` fingerprint:

```json
{
  "$type": "events.prisma.evidence.interview",
  "text": "[Approved redacted interview summary and structured Decision-Gate findings - up to 30,000 chars / 10,000 graphemes]",
  "consentScope": "anonymous | public",
  "topic": "interview",
  "media": {
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "mimeType": "audio/ogg",
    "kind": "voice"
  },
  "recordedAt": "2026-11-24T10:00:00Z",
  "authorDid": "did:cardano:stake1u8examplereviewerstakekeyhash...",
  "createdAt": "2026-11-25T16:30:00Z"
}
```

> **Vault-Only Hold for `Private`, `Research`, and Pre-Lock Wave 1 Captures:** Interviews where the participant selects **`Private`** or **`Research`** *(Milestone 1 Confidential Synthesis)* remain permanently inside the encrypted Hub Vault (`apps/vault`) and are never published to an AT Protocol repository. In addition, during the initial fieldwork launch from **21 November 2026**, all real interviews uploaded via the Hub Vault Web Form are held as **`Private`** inside the vault until the consent specification and pilot server filter step are formally locked.

### 3.2 Extended Research Analysis Template (`ingest.json` v2.0 - Vault Coding & Planned Lexicon PR Structure)

The JSON structure below defines the analytical coding template used across the Milestone 1 [Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest) workflow and the Phase 3 synthesis tables, aligning the consent fields 1:1 between the four Hub Vault choices (`Private`, `Research`, `Anonymous public`, `Public named`) and Milestone 1 (`Confidential Synthesis`, `Role-Only Anonymised`, `Full Attribution`):

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PRISMA Phase 2-3 Interview Analytical Coding Template (ingest.json v2.0 - Pending Final eventId Lexicon PR)",
  "working_lexicon_nsid": "events.prisma.evidence.interview",
  "namespace_status": "Pending finalisation by Infrastructure Lead to incorporate eventId into the interview record namespace",
  "hub_profile_lexicon": "events.prisma.hub.profile",
  "hub_team_lexicon": "events.prisma.hub.team",
  "schema_version": "2.0.0",
  "provenance": {
    "record_strongRef": {
      "uri": "at://did:plc:exampleteamdid/events.prisma.evidence.interview/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "cid": "bafyreig7x4z2m9c22p5q8w3v6n4r8k2j5h7g9f1d3s5a7q9w2e4r6t8y0u"
    },
    "hub_did_plc": "did:plc:examplehubpds",
    "hub_did_cardano": "did:cardano:stake1u9examplecardanostakekeyhash...",
    "team_did_plc": "did:plc:exampleteamdid",
    "authorDid": "did:cardano:stake1u8examplereviewerstakekeyhash...",
    "media": {
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "mimeType": "audio/ogg",
      "kind": "voice | video | file | text"
    },
    "verification_status": "vault_private | pending_review | verified_published | disputed | withdrawn",
    "recordedAt": "2026-11-24T10:00:00Z",
    "createdAt": "2026-11-25T16:30:00Z"
  },
  "conduct": {
    "withdrawal_reference_code": "WA-LOS-PAY-01",
    "play_id": "H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | H9 | H10 | H11 | H12 | H13 | H14 | H15",
    "use_case": "Remittances | Identity_Credentials | Land_Records | Ag_Supply_Chain | Stablecoin_Settlement | Public_Procurement_Audit",
    "question_pack": "public-sector | regulators-policy | humanitarian-ngo | delivery-partners | payment-infrastructure | agricultural-networks | cardano-ecosystem",
    "screener_passed": true,
    "consent_choice": "Private | Research | Anonymous public | Public named",
    "m1_consent_mapping": "Vault-Only Default (Private) | Confidential Synthesis (Research) | Role-Only Anonymised (Anonymous public) | Full Attribution (Public named)",
    "consentScope": "anonymous | public",
    "ai_training_consent": false,
    "recording_mode": "recorded_vault_encrypted | notes_only | text_intake",
    "consent_recorded_before_start": true,
    "anonymous": true,
    "re_contact": false,
    "lead_interviewer_role_separated_from_introducer": true
  },
  "participant": {
    "id": "NG-LAG-001",
    "counterparty_register_id": "CP-WA-03",
    "stakeholder_category": "1_public_sector | 2_regulators_policy | 3_humanitarian_ngo | 4_delivery_partners | 5_payment_infrastructure | 6_agricultural_networks | 7_cardano_ecosystem",
    "functional_role": "R1_Decision_Sponsor | R2_Regulatory_Gatekeeper | R3_Procurement_Budget_Owner | R4_Local_Delivery_Partner | R5_Distribution_Trust_Partner | R6_Technical_Compliance_Enabler",
    "cardano_affiliation": "non_cardano | cardano_adjacent | cardano_insider",
    "ecosystem_relationship_tag": "IND-COLD | PRISMA-HUB | CATS26-WARM | WADA-NET | CARDANO-ECO",
    "coi_flag": false,
    "coi_disclosure": "None - independent SEC ARIP licensed VASP operating on Tron and EVM rails."
  },
  "metadata": {
    "date_time": "2026-11-24T10:00:00Z",
    "country": "Argentina | Uruguay | Paraguay | Nigeria | Ghana | Senegal | Kenya | Rwanda | Uganda | Spain | Brazil | Colombia | Peru | Mexico | Ethiopia",
    "region": "Southern Cone | West Africa | East Africa | Iberia | Brazil | Andean | Mexico | Horn_Ethiopia",
    "hub_anchor": "Buenos Aires Hub | Lagos Hub | Nairobi Hub | Desk Monitor",
    "language": "en | es | fr | sw | pt",
    "stakeholder": "Anonymised Institutional Archetype Label (e.g. SEC Nigeria ARIP-Licensed VASP Settlement Desk)",
    "interviewer": "Hub Team ID (e.g. LAG-TEAM-01)",
    "independent_reviewer": "Hub Reviewer ID (e.g. LAG-REV-01)"
  },
  "decision_gates": {
    "gates_addressed": [
      "Gate 1: Regions",
      "Gate 2: Use cases",
      "Gate 3: Counterparties",
      "Gate 4: Regulation",
      "Gate 5: Infrastructure",
      "Gate 6: Delivery model",
      "Gate 7: Adoption",
      "Gate 8: Cross-RFP handoffs"
    ],
    "primary_gate_findings": {
      "gate_1_regions": "Validates or revises cluster RARF score across D1-D10.",
      "gate_2_use_cases": "Tests specific falsification threshold for play_id (H1-H15).",
      "gate_3_counterparties": "Upgrades counterparty access_basis from Warm/Referred/Desk to Interviewed.",
      "gate_4_regulation": "Verifies LC-01 to LC-10 statutory and compliance questions.",
      "gate_5_infrastructure": "Rates the 8 prerequisite categories (Met / Partially Met / Unmet / Unknown / Dependent).",
      "gate_6_delivery_model": "Evaluates local SI SLA capacity and 6-role partnership completeness.",
      "gate_7_adoption": "Identifies hard falsification or No-Go triggers.",
      "gate_8_cross_rfp_handoffs": "Logs external protocol/liquidity dependencies (HO-M2-01 to HO-M2-05)."
    },
    "play_status_after_call": "confirmed | revised | contested-weak | rejected | inconclusive",
    "rarf_dimensions_tested": ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"]
  },
  "business_value": {
    "use_case": "",
    "adoption": "",
    "commercial": "",
    "market_access": "",
    "deployment": "",
    "incumbent_baseline_named": "e.g. NIBSS NIP + Tron TRC-20 USDT OTC desks",
    "why_cardano_vs_centralised_db_or_competing_chain": "Explicit operational comparison captured from respondent."
  },
  "counterparty_lead": {
    "archetype_or_entity_code": "CP-WA-03",
    "functional_role": "R6_Technical_Compliance_Enabler",
    "access_basis_before_call": "Warm Access | Referred | Desk-Identified | Hypothetical",
    "access_basis_after_call": "Interviewed",
    "reachability_12_24m": "High | Medium | Low",
    "referral_captured": false,
    "referral_permission_granted": false
  },
  "regulatory_finding": {
    "jurisdiction": "Nigeria",
    "local_counsel_trigger_id": "LC-03",
    "competent_authorities": ["SEC Nigeria", "Central Bank of Nigeria (CBN)"],
    "statutory_citations": ["Investments and Securities Act 2025 (ISA 2025)", "CBN Circular FPR/DIR/PUB/CIR/002/003 (2023-12-22)"],
    "regulatory_certainty_paired": "Clear (High Certainty) | Evolving (Medium Certainty) | Uncertain (Low Certainty)",
    "specialist_local_counsel_required": "Yes - Mandatory Before Pilot | Conditional - Required for Licensing/Tender | No - Standard Compliance Only",
    "counsel_trigger_rationale": ""
  },
  "infrastructure_assessment": {
    "stablecoin_liquidity": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "local_off_ramp": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "wallet_ux_abstraction": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "mobile_first_offline_ussd": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "privacy_selective_disclosure": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "identity_kyc_integration": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "local_delivery_capacity": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream",
    "compliance_sla_artifacts": "Met | Partially Met | Unmet | Unknown | Dependent on Another Workstream"
  },
  "adoption_signal": {
    "signal_present": false,
    "cass_signal_id": "CASS-M2-05",
    "signal_description": "",
    "evidence_type": "Primary_Observation | Documentary_Contract | Third_Party_Independent | Unverified_Assertion",
    "proposed_cass_tier": "Tier 1: Verified Adoption Signal | Tier 2: Strong Opportunity Signal | Tier 3: Moderate / Exploratory Signal | Tier 4: Weak / Cosmetic Signal",
    "cass_rationale": "",
    "prior_community_claim_reclassified": false
  },
  "cross_rfp_handoff": {
    "handoff_triggered": true,
    "handoff_id": "HO-M2-01",
    "target_rfp": "RFP-01_Liquidity_Stablecoins | RFP-02_Impact_Framework | RFP-03_Enterprise_Compliance | RFP-06_Developer_Ecosystem | RFP-07_Interoperability | None",
    "blocker_summary": "",
    "requested_receiving_action": ""
  },
  "evidence": {
    "observation": "",
    "counterevidence_or_limitation": "",
    "source": "Primary_Interview | Secondary_Statutory | Secondary_Institutional | Community_Self_Report",
    "confidence": "High (Triangulated Primary) | Medium (Single Primary or Convergent Secondary) | Low (Desk Estimate or Unverified Claim)"
  }
}
```

### Schema-to-Deliverable Traceability Mapping

| `ingest.json` v2.0 Block | Milestone 1 Design Specification | Phase 2 Baseline Deliverable | Downstream Phase 3-5 Analytical Output |
| :--- | :--- | :--- | :--- |
| **`provenance`** (`record_strongRef`, `hub_did_plc`, `hub_did_cardano`, `recordingHash`, `verification_status`) | [Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest) & [Verify](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/verify) | [Data Ingestion Schema and Fieldwork Verification Protocol](/en/events/cpc/executing/deliverables/phase-2-schema-and-protocol-update) | Links each Milestone 3 synthesis table and Milestone 4-5 Playbook recommendation to a content-addressed `at:// URI + CID` and `SHA-256` vault digest. |
| **`decision_gates`** (`gates_addressed`, `primary_gate_findings`, `play_status_after_call`, `rarf_dimensions_tested`) | [Decision Gates](/en/events/cpc/executing/terminology/decision-gates) (`Gates 1-8`) | [Regional Market Prioritisation Matrix](/en/events/cpc/executing/deliverables/market-prioritisation-matrix) & [Use-Case Viability Register](/en/events/cpc/executing/deliverables/desk-research-and-use-case-scan) | Drives post-interview RARF re-scoring (`D1-D10`) and final hypothesis disposition (`confirmed`, `revised`, `rejected`) in Milestones 3 and 4. |
| **`counterparty_lead`** (`archetype_or_entity_code`, `functional_role`, `access_basis_before_call`, `access_basis_after_call`) | [Stakeholder Recruitment Plan](/en/events/cpc/executing/deliverables/research-design-document/stakeholder-recruitment-plan) | [Stakeholder Ecosystem and Counterparty Mapping Report](/en/events/cpc/executing/deliverables/counterparty-access-map) | Tracks progression from `Warm Access`, `Referred`, or `Desk-Identified` to `Tier 1: Interviewed` across all six functional roles (`R1-R6`). |
| **`regulatory_finding`** (`local_counsel_trigger_id`, `regulatory_certainty_paired`, `specialist_local_counsel_required`) | [Regulators Question Pack](/en/events/cpc/organising/question-packs/regulators) | [Preliminary Regulatory and Compliance Scan](/en/events/cpc/executing/deliverables/regulatory-preliminary-scan) (`LC-01` to `LC-10`) | Feeds the Primary-Verified Regulatory and Compliance Matrix in Milestones 4 and 5. |
| **`infrastructure_assessment`** (8 categories rated `Met` / `Partially Met` / `Unmet` / `Unknown` / `Dependent`) | [Adoption Readiness](/en/events/cpc/executing/terminology/adoption-readiness) | [Regional Market Prioritisation Matrix](/en/events/cpc/executing/deliverables/market-prioritisation-matrix) (`Section 5`) | Feeds the Infrastructure Prerequisite and Gap Assessment in Milestones 4 and 5. |
| **`adoption_signal`** (`cass_signal_id`, `proposed_cass_tier`, `prior_community_claim_reclassified`) | [Adoption Signals](/en/events/cpc/executing/terminology/adoption-signals) (`CASS Tiers 1-4`) | [Use-Case Viability Register](/en/events/cpc/executing/deliverables/desk-research-and-use-case-scan) (`Section 6`) | Governs whether a regional signal advances from `Tier 3` to `Tier 2` or `Tier 1` following independent primary verification. |
| **`cross_rfp_handoff`** (`handoff_id`, `target_rfp`, `blocker_summary`, `requested_receiving_action`) | [Decision Gates](/en/events/cpc/executing/terminology/decision-gates) (`Gate 8`) | [Regional Market Prioritisation Matrix](/en/events/cpc/executing/deliverables/market-prioritisation-matrix) (`Section 6`) | Routes validated ecosystem dependencies to portfolio workstreams (`RFP 01`, `RFP 02`, `RFP 03`, `RFP 06`, `RFP 07`, `RFP 08`) in Milestones 4 and 5. |

---

## 4. Six-Step Cross-Hub Fieldwork Verification Checklist

To ensure that every interview conducted in the **Buenos Aires Hub**, **Lagos Hub**, and **Nairobi Hub** (`9 Local Project Teams` total) meets identical evidentiary, privacy, and bias-control standards, field teams execute the six-step verification checklist in Table 2 for each session prior to counting it toward the Phase 3 sample quota.

| Step | Workflow Stage | Operational Requirement Across All Regional Hubs | Technical Verification Mechanism |
| :-: | :--- | :--- | :--- |
| **1** | **Pre-Call `Assemble` & Screener Check** | Prior to each interview, the lead interviewer populates the six-row `Assemble` header (`Cluster`, `Use case`, `Play one-liner`, `Hypothesis status`, `Desk claims to test`, `What would falsify this play`) from the [Use-Case Viability Register](/en/events/cpc/executing/deliverables/desk-research-and-use-case-scan) and confirms that the participant satisfies the Question Pack Screener (`screener_passed: true`). | Recorded in `conduct.play_id`, `conduct.question_pack`, and `conduct.screener_passed`. |
| **2** | **Role Segregation & Blockchain-Agnostic Discovery** | Where a participant was introduced through a regional hub, `Wada`, or `CATS26` contact (`PRISMA-HUB`, `CATS26-WARM`, `WADA-NET`, `CARDANO-ECO`), the person who made the introduction does not serve as sole lead interviewer or final verifier (`lead_interviewer_role_separated_from_introducer: true`). The first `60%` of the session focuses on blockchain-agnostic operational problem and incumbent-system discovery. | Verified through distinct `metadata.interviewer` and `metadata.independent_reviewer` identifiers and `provenance.reviewer_did_cardano`. |
| **3** | **Informed Consent & Hub Vault Web Form Upload (`Within 48h`)** | Consent is confirmed and logged before recording begins (`conduct.consent_recorded_before_start: true`), and the participant receives a withdrawal reference code. The team signs in to the Hub Vault Web Form with its dedicated wallet and uploads the raw audio and structured notes to the encrypted local vault (`apps/vault`, `Private` by default), which computes the `SHA-256` `media.sha256` fingerprint. | The local vault blocks unauthenticated external reads; raw files and `Private` or `Research` interviews never leave the vault. During the initial Wave 1 launch from 21 November, all real interview uploads remain strictly `Private` in the vault until the consent specification and pilot server filter step are locked. |
| **4** | **Personal-Data Redaction & Structured Coding (`Within 48h`)** | Once the local transcription and redaction filter is active on the hub server, Whisper transcribes the recording and local rules and model flag personal names, third-party names, phone numbers, emails, and indirect identifiers. The interviewer and reviewer remove all flagged identifiers (unless the participant chose `Public named` / `consentScope == "public"`) and complete the structured Decision-Gate blocks, including `business_value.incumbent_baseline_named` and `evidence.counterevidence_or_limitation`. | The vault review screen (`/review`) refuses an `anonymous` approval while any detected phone number, email, link, or unredacted identifier remains visible. |
| **5** | **Independent Hub Peer-Review & Gated Repository Publication (`Within 72h`)** | A Hub Lead or designated reviewer compares the encrypted vault draft against the redacted summary to confirm that: (a) all personal data and third-party names are redacted; (b) courtesy statements are not miscoded as `CASS Tier 1` or `Tier 2`; and (c) counterevidence is accurately captured. Once the consent specification and pilot filter gates are locked, for `Anonymous public` (`consentScope: "anonymous"`) and `Public named` (`consentScope: "public"`) records, the reviewer signs in with their `at-pds` wallet session (`authorDid: did:cardano:stake1...`) to write `events.prisma.evidence.interview` (pending final `eventId` namespace lock). | Cryptographic signature verification writes the approved record to the team repository, keyed by `media.sha256`, and generates the immutable `strongRef` (`at:// URI + CID`). `CIP-0020` Cardano batch anchoring follows asynchronously after the first verified ingest/publication wave. |
| **6** | **Aggregation Indexing & Weekly Calibration Audit** | The indexing service (`AppView`) verifies the repository signature and aggregates published records into the cross-hub research view. During weekly calibration reviews in Weeks 7-12, the Principal Investigator and Project Lead / Co-PI audit sample records across all hubs to maintain inter-rater consistency on RARF and CASS ratings. | Idempotent `(uri, cid, rev)` indexing tracks regional quota completion and category balance in real time. |
