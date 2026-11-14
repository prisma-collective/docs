---
sidebarTitle: "Module 4: Server Ingest & Vault Review"
---

# Module 4: Vault Intake, Redaction and the 48-Hour Review

Once an interview finishes in the **Lagos Hub**, **Nairobi Hub** or **Buenos Aires Hub**, the recording and notes move into the hub's encrypted vault. Within 48 hours of the call, the interviewer and the hub's vault reviewer turn the raw conversation into a checked, privacy-safe research record ([Layer 2: Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest)).

---

## 1. Step by step through the 48-hour review

1. **Hours 0 to 6: uploading to the encrypted Hub Vault.**
   - The Local Project Team uploads the audio recording or structured notes through the hub vault's secure intake screen or the hub's Telegram intake bot.
   - Every new file is stored as **Private** by default. Original audio and video recordings stay inside the hub vault and are never published to the web.
2. **Hours 6 to 24: local transcription and name flagging.**
   - On the hub's own server, Whisper transcribes the recording into text.
   - A local language model running on the same server scans the transcript and highlights personal names, job titles, organisation names, third parties mentioned in conversation, and contact details (including disguised formats such as spaced phone digits or spelled-out email addresses).
3. **Hours 24 to 48: joint review by the interviewer and vault reviewer.**
   - The interviewer and the hub's designated vault reviewer open the transcript together in the vault review screen:
     - They remove all flagged names and contact details if the record is anonymous. The review screen will not let an anonymous record pass while any flagged name or contact detail remains unredacted.
     - They fill in the structured findings across the eight research decision gates: whether the tested hypothesis was confirmed, revised, rejected or left inconclusive, how any adoption signal is rated, which laws or circulars were cited, and how the eight infrastructure prerequisites are rated.
     - They apply the participant's pre-recorded [Consent Choice](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders). Reviewers can keep the participant's chosen visibility or make it stricter, never more public.
4. **Keeping the record in the vault or publishing to the team repository.**
   - If the participant chose **Private** or **Research**, the reviewed record stays inside the encrypted hub vault and is never written to an [AT Protocol](/en/processes/process-infrastructuring/publishing/atproto) repository. Records marked Research can be read only by the Cardano Product Committee and authorised project researchers through the vault's authenticated login.
   - If the participant chose **Anonymous public** or **Public, named**, the vault reviewer signs the redacted record (together with a cryptographic SHA-256 fingerprint of the vault file) into the Local Team's repository on the hub server. From there, the record is indexed for [Timelining](/en/processes/process-infrastructuring/publishing/timelining) and [Case Study](/en/patterns/case-study) synthesis.
