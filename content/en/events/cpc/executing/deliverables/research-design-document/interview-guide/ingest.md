# Layer 2: Post-Interview Vault Filtering & AT Protocol Ingestion

Within **48 hours** of each interaction across the **Buenos Aires Hub**, **Lagos Hub**, **Nairobi Hub**, and **Barcelona Benchmark**, the Local Team and Designated Hub Vault Reviewer process the evidence through the production server ingest path (`D22`, `D26`, `D30`):

1. **Encrypted Vault Intake (`Default = 1. Private`):**
   - The recording or Telegram intake message lands inside the Hub's encrypted **Vault** (`D15`, `D22`), which requires authenticated sign-in on startup and drops revoked sessions immediately (`0s` delay).
   - Every new intake defaults to **`1. Private`**. Raw audio, video, and unredacted transcripts never leave the Hub Vault under any consent choice.
2. **Local On-Server Transcription (`Whisper`) & Identifier Filtering (`Local LLM`):**
   - Local `Whisper` transcribes the recording directly on the hub server.
   - A local language model scans the transcript and flags personal names, institutional titles, contact details (including disguised formats such as spelled-out emails or spaced phone digits), and any third-party names mentioned during the interview.
3. **Human Reviewer Session & Consent Enforcement (`D26`, `D30`):**
   - The Local Team Interviewer and Designated Hub Vault Reviewer inspect the flagged transcript and code the structured findings (`ingest.json` v2.0).
   - **Hard Redaction Gate:** The Vault review screen blocks `Anonymous` approval (`Choices 2 & 3`) if any detected identifier or unconsented third-party name remains unredacted, and reviewers can only keep or tighten the participant's pre-recorded privacy choice.
4. **Storage vs. Repository Publication by Consent Choice (`D30`):**
   - **`Choice 1: Private` & `Choice 2: Research` (`CPC / Authorised Researchers`):** Stored strictly inside the **Encrypted Hub Vault** (never published to an AT Protocol repo). Choice 2 transcripts are served only to the CPC and authorised researchers through the Vault's authenticated read path.
   - **`Choice 3: Anonymous public` & `Choice 4: Public, named`:** The Hub Reviewer's authenticated session writes the consent-filtered `ingest.json` record (`events.prisma.evidence.interview`) plus the SHA-256 fingerprint of the vault file into the Team's AT Protocol repository (`did:plc`) on the Hub PDS. The Relay, `Tap`, and the TypeScript `AppView` index the signed record using the six ingestion rules (`D6`).

---

### Finalised Phase 2-3 Ingestion Schema (`events.prisma.evidence.interview` / `ingest.json` v2.0)

Locked prior to Phase 3 fieldwork (`Milestone 2`), every published interview record conforms to five structured sub-objects:

* **1. Session & Provenance Header:** `schemaVersion` (`2.0.0`), `recordId` (`Respondent_ID`), `hubDid` (`did:plc`), `teamDid` (`did:plc`), `interviewerCardanoDid` (`did:cardano` dedicated wallet), `regionalCluster`, `citySubLocation`, `questionPackId` (`1-7`), `counterpartyRole` (`1-6`), `nonCardanoIndependent` (`boolean`), `consentScope` (`anonymous` or `public`), `aiTrainingAllowed` (`boolean`, default `false`), and `vaultArtifact` (`sha256Fingerprint`, `vaultReceiptId`, `retentionExpiryDate`).
* **2. Tested Play & Hypothesis Disposition:** `playId` (`H1-H7`, `H11-H12`), `preCallStatus`, `postCallDisposition` (`Confirmed / Revised / Rejected / Inconclusive`), `incumbentBaselineConfronted`, `falsificationTriggerTested`, and `summaryFinding`.
* **3. Decision Gate Evidence (`G1-G8`):** Array of structured gate findings mapping `gateId`, `rarfDimensionId` (`D1-D10`), `redactedClaim`, `redactedVerbatimQuote`, and `evidenceConfidence` (`High / Medium / Low`).
* **4. CASS Adoption Signal Block:** `signalId`, `signalDescription`, `evidenceType`, `proposedCassTier` (`Tier 1` to `Tier 4`), `tierRationale`, and `corroborationNeeded` (`boolean`).
* **5. Regulatory, Infrastructure & Cross-RFP Handoff Block:** `regulatoryFindings` (`jurisdiction`, `statuteOrCircularCited`, `certaintyTier`, `localCounselRequired`, `counselQuestionId`), `infrastructurePrerequisites` (`8 categories` rated `Met / Partially Met / Unmet / Unknown / Dependent on Another Workstream`), `referralsGenerated`, and `crossRfpHandoffs` (`RFP 01, 02, 03, 06, 07, 08`).

Full JSON Schema specification and worked example: [Data Ingestion Schema & Fieldwork Verification Protocol](/en/events/cpc/executing/deliverables/phase-2-schema-and-protocol-update).
