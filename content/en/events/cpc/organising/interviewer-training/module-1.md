---
sidebarTitle: "Module 1: Ethics & Consent (D30)"
---

# Module 1: Research Ethics, Pre-Recording Consent (`D30`) & Vault Privacy

## 1. Objective
Equip every Regional Hub Reviewer (**Buenos Aires Hub**, **Lagos Hub**, **Nairobi Hub**, and **Barcelona Benchmark**) and Local Project Team interviewer with the operational rules for administering informed consent **before recording begins**, issuing a **Withdrawal Reference Number**, and keeping all private and research-only material strictly inside the encrypted Hub Vault.

## 2. The Four Consent Choices + Separate AI Question (`D30`)
Before starting any audio/video recorder or structured note capture, the interviewer reads the plain-language [Read-Aloud Scripts](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders) (under 60 seconds) and logs the participant's selection:

1. **`1. Private` (`Safe Default`):** Kept strictly inside the Hub's encrypted Vault for the interviewing team and hub reviewer's internal score calibration only; never quoted or shared outside the hub.
2. **`2. Research` (`CPC & Authorised Researchers`):** Name, contact details, and third-party identifiers are removed; the edited anonymous transcript is accessible only to the Cardano Product Committee (`CPC`) and authorised project researchers via the Hub Vault's authenticated read path, never published on the public internet or any AT Protocol repo. Original audio/video never leaves the Hub Vault.
3. **`3. Anonymous public`:** Name, contact details, and third-party identifiers are stripped; only approved anonymous quotes, structured gate findings, and a SHA-256 vault fingerprint are published to the Team's AT Protocol repository (`events.prisma.evidence.interview`).
4. **`4. Public, named`:** Only participant-approved statements and findings are published alongside the participant's name, title, and organisation in the Team's AT Protocol repository.
5. **Separate AI Model Training Question (`Default = No`):** Explicitly ask whether the participant permits future AI model training (`No` by default). Local on-server `Whisper` transcription and local identifier filtering run privately inside the Hub Vault and never send data to external AI model trainers.

## 3. Mandatory Safeguards
- **`Private` as the Review Default:** Every new recording lands in the Hub Vault as `1. Private` by default. Reviewers can only keep or tighten privacy unless fresh consent is recorded.
- **Unique Withdrawal Reference Number & 12-Month Retention Limit:** Every interviewee receives a simple reference code (`Respondent_ID`, e.g., `SC-BA-PAY-01`, `WA-LOS-REG-02`, `EA-NRB-AGR-01`) so even an anonymous participant can withdraw at any time across all four choices. Withdrawal purges the files from both the Hub Vault and `at-pds` CAR backups, and all raw recordings/transcripts are deleted within 12 months of project completion.
- **Third-Party & Disguised-Contact Redaction:** Names of third parties mentioned during an interview (unless they also consented) and disguised contact details must be redacted. The Vault blocks `Anonymous` approval while any detected identifier remains unredacted.
