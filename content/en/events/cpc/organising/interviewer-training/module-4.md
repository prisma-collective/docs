---
sidebarTitle: "Module 4: Server Ingest & Vault Review"
---

# Module 4: Encrypted Vault Intake, Local Filtering & 48-Hour Review (`D22`, `D26`)

## 1. Objective
Ensure every completed stakeholder interaction is captured in the **Encrypted Hub Vault**, transcribed locally via `Whisper`, scanned by the local language-model identifier filter, and reviewed by a human reviewer within **48 hours** of the call.

## 2. The Production Server Ingest Pipeline (`48-Hour SLA`)
1. **Encrypted Vault Intake (`Hours 0-6` - Default `1. Private`):**
   - The Local Team uploads the recording or submits voice/text notes via the authenticated Hub Vault intake (or Telegram intake bot).
   - The raw file is encrypted inside the Hub Vault (`D15`, `D22`) with `1. Private` set as the safe default (`D30`). Raw audio/video never leaves the Hub Vault.
2. **Local Whisper Transcription & Identifier Filtering (`Hours 6-24`):**
   - On the hub server, local `Whisper` transcribes the audio and the local language model flags personal names, institutional titles, third-party names, and contact details (including disguised formats such as spaced digits or spelled-out email addresses).
3. **Joint Team + Hub Reviewer Session (`Hours 24-48`):**
   - The Local Team Interviewer and Designated Hub Vault Reviewer log into the authenticated Vault review screen to:
     - Redact all flagged identifiers and third-party names (the Vault blocks `Anonymous` approval while any detected identifier remains unredacted).
     - Complete the structured `ingest.json` v2.0 fields across Decision Gates `G1-G8`, play disposition (`Confirmed / Revised / Rejected / Inconclusive`), `CASS` tier proposal, regulatory certainty, and 8 infrastructure prerequisites.
     - Apply the participant's pre-recorded consent choice (`1. Private`, `2. Research`, `3. Anonymous public`, or `4. Public, named`).
4. **Conditional Repository Publication (`D26`):**
   - If the participant chose **`1. Private`** or **`2. Research`**, the record stays strictly inside the Encrypted Hub Vault and is **never** written to an AT Protocol repository.
   - If the participant chose **`3. Anonymous public`** or **`4. Public, named`**, the Hub Reviewer's authenticated session writes the filtered record (`events.prisma.evidence.interview`) plus the SHA-256 vault fingerprint to the Team's AT Protocol repository on the Hub PDS, which syncs via the Relay and `Tap` to the `AppView`.
