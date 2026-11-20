---
sidebarTitle: "Module 4: Server Ingest & Vault Review"
---

# Module 4: Vault Intake, Redaction and the 48-Hour Review

Once an interview finishes in the **Lagos Hub**, **Nairobi Hub** or **Buenos Aires Hub**, the recording and notes move into the hub's encrypted vault. Within 48 hours of the call, the interviewer and the hub's vault reviewer turn the raw conversation into a checked, privacy-safe research record ([Layer 2: Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest)).

---

## 1. Step by step through the 48-hour review

1. **Hours 0 to 6: signing in and uploading to the encrypted Hub Vault.**
   - The Local Project Team signs in to the **Hub Vault Web Form** with its dedicated wallet and uploads the audio recording and structured notes (or forwards notes via the hub's Telegram intake bot).
   - Every new file is stored as **Private** by default ("zero raw data leaves the hub vault"). Original audio and video recordings stay inside the hub vault and are never published to the web. During the initial Wave 1 launch from 21 November, all real interview uploads stay strictly **Private** inside the vault until the consent specification and pilot server filter step are locked.
2. **Hours 6 to 24: local transcription and name flagging.**
   - Once the filter step is active on the hub's own server, Whisper transcribes the recording into text in memory.
   - Fixed regex rules and a local language model running on the same server scan the transcript and highlight personal names, job titles, organisation names, third parties mentioned in conversation, and contact details (including disguised formats such as spaced phone digits or spelled-out email addresses).
3. **Hours 24 to 48: joint review by the interviewer and vault reviewer.**
   - The interviewer and the hub's designated vault reviewer open the transcript together in the vault review screen (`/review`):
     - They remove all flagged names and contact details if the record is anonymous. The review screen will not let an anonymous record pass while any flagged name or contact detail remains unredacted.
     - They fill in the structured findings across the eight research decision gates: whether the tested hypothesis was confirmed, revised, rejected or left inconclusive, how any adoption signal is rated, which laws or circulars were cited, and how the eight infrastructure prerequisites are rated.
     - They apply the participant's pre-recorded [Consent Choice](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders). Reviewers can keep the participant's chosen visibility or make it stricter, never more public.
4. **Keeping the record in the vault or publishing to the team repository.**
   - If the participant chose **Private** or **Research** (maps to M1 Confidential Synthesis), the reviewed record stays permanently inside the encrypted hub vault and is never written to an [AT Protocol](/en/processes/process-infrastructuring/publishing/atproto) repository. Records marked Research can be read only by the Cardano Product Committee and authorised project researchers through the vault's authenticated login.
   - Once the consent and filter gates are locked, if the participant chose **Anonymous public** (maps to M1 Role-Only Anonymised, `consentScope: "anonymous"`) or **Public named** (maps to M1 Full Attribution, `consentScope: "public"`), the vault reviewer signs the redacted record (together with a cryptographic SHA-256 fingerprint of the vault file) into the Local Team's repository on the hub server (`events.prisma.evidence.interview`, pending final `eventId` namespace lock). From there, the record is indexed for [Timelining](/en/processes/process-infrastructuring/publishing/timelining) and [Case Study](/en/patterns/case-study) synthesis, with `CIP-0020` batch anchoring following after the first verified ingest wave.
