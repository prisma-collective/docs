# Layer 2: Vault Review, Redaction and Repository Publishing

Within **48 hours** of an interview in the **Lagos Hub**, **Nairobi Hub** or **Buenos Aires Hub**, the Local Project Team interviewer and the hub's designated Vault Reviewer turn the raw recording or notes into a structured, privacy-checked research record using PRISMA's [Process Infrastructuring](/en/processes/process-infrastructuring) and [AT Protocol Publishing](/en/processes/process-infrastructuring/publishing/atproto) tools.

---

### 1. How the 48-hour ingest works

1. **Into the encrypted Hub Vault (set to Private by default).**
   - The recording or structured note file is uploaded to the hub's encrypted vault, which requires a reviewer sign-in.
   - Every new file starts as **Private**. Original audio, video and unedited transcripts never leave the vault under any [Consent Choice](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders).
2. **On-server transcription and identifier flagging.**
   - Whisper runs directly on the hub server to transcribe the audio.
   - A local language model on the same server highlights personal names, job titles, contact details (including spaced phone digits or spelled-out email addresses) and any third parties mentioned during the conversation.
3. **Joint human review and redaction.**
   - The interviewer and the Hub Vault Reviewer go through the transcript together and fill in the structured findings.
   - **Hard redaction check:** if the participant chose an anonymous option (Research or Anonymous public), the vault review screen will not allow approval while any flagged name, third-party reference or contact detail remains unredacted. Reviewers can keep the participant's pre-recorded visibility choice or make it more private, never more public.
4. **Where the finished record lives.**
   - **Private and Research records:** stay inside the **Encrypted Hub Vault** and are never written to an AT Protocol repository. Research transcripts are available only to the Cardano Product Committee and authorised project researchers through the vault's authenticated login.
   - **Anonymous public and Public, named records:** the Hub Vault Reviewer signs the redacted structured record, together with the SHA-256 fingerprint of the vault file, into the Local Team's repository on the hub server (`at-pds`). The Relay, Tap and the AppView verify the signature and index the record for [Timelining](/en/processes/process-infrastructuring/publishing/timelining) and [Case Study](/en/patterns/case-study) synthesis.

---

### 2. What goes into a published interview record

Every record published from the vault follows the version 2.0 ingestion schema aligned with the [PRISMA Lexicons](https://github.com/prisma-collective/lexicons). It contains five clear sections:

* **1. Provenance and consent header:** the participant's reference code, the hub and team repository identifiers, the interviewer's dedicated project wallet identifier ([Cardano DIDs](/en/processes/enrolment/dids/overview)), the region and city, the Question Pack used, the interviewee's functional role, whether the organisation is independent of Cardano, the chosen consent level (`anonymous` or `public`), the AI training setting (`false` by default), and the cryptographic vault receipt (`sha256Fingerprint`, `vaultReceiptId` and 12-month deletion date).
* **2. Hypothesis test summary:** which regional use case was tested, whether the conversation confirmed, revised, rejected or left the desk hypothesis inconclusive, which local incumbent system was compared, whether the falsification condition was triggered, and a plain-English summary of the outcome.
* **3. Evidence across the eight decision gates:** structured findings linked to the relevant decision gates and Regional Adoption Readiness dimensions, with redacted quotes and a confidence rating (`High`, `Medium` or `Low`).
* **4. Adoption signal rating:** a description of any concrete adoption signal observed, the type of evidence behind it, the proposed Cardano Adoption Signal Standard tier (`Tier 1` to `Tier 4`), and whether independent corroboration is still needed.
* **5. Legal, infrastructure and cross-RFP notes:** any statute or central bank circular cited, whether a local lawyer needs to confirm the point, ratings across the eight infrastructure categories (`Met`, `Partially Met`, `Unmet`, `Unknown` or `Dependent on Another Workstream`), warm introductions offered, and handoffs to other Cardano Product Committee research tracks.

For the full JSON schema and a complete worked example from Lagos, see the [Data Ingestion Schema and Fieldwork Verification Protocol](/en/events/cpc/executing/deliverables/phase-2-schema-and-protocol-update).
