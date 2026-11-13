---
sidebarTitle: Stakeholder Consent & Scripts
---

# Stakeholder Enrolment, Consent Choices (`D30`) & Read-Aloud Scripts

This guide sets the operational rules for qualifying external interviewees, recording informed consent **before** any recording begins (`D30`), issuing a unique **Withdrawal Reference Number**, and reading the standardised plain-language consent scripts across all Regional Hubs (**Buenos Aires Hub**, **Lagos Hub**, **Nairobi Hub**, and **Barcelona Benchmark**).

---

## 1. Golden Rules Before Every Interview

1. **Consent First, Recording Second (`Safe Default = 1. Private`):**
   - Consent **must** be explained, chosen by the participant, and logged **before** audio/video recording or structured note capture begins.
   - Inside the Hub Vault review interface, every new intake defaults to **`1. Private`**. A reviewer can only keep the participant's chosen privacy level or make it **more restrictive** (tighter privacy); widening visibility requires fresh documented consent from the participant.
2. **Every Audience Narrower Than the World Lives Strictly in the Vault (`D5`, `D22`, `D30`):**
   - Anything written to an AT Protocol repository (`events.prisma.evidence.interview`) is public and replicated across the relay, `Tap`, and `AppView`.
   - Therefore, raw recordings, unredacted transcripts, contact details, and **all `1. Private` and `2. Research` (`CPC-level`) interviews stay strictly inside the Hub's encrypted Vault** and never enter an AT Protocol repository.
   - Even under `3. Anonymous public` and `4. Public, named`, original audio and video files **never** leave the encrypted Hub Vault.
3. **Unique Withdrawal Reference Number & 12-Month Retention Ceiling:**
   - At the start of every interview, the participant is given a simple **Withdrawal Reference Number** (matching the deterministic `Respondent_ID`, e.g., `SC-BA-PAY-01`, `WA-LOS-REG-02`, `EA-NRB-AGR-01`).
   - Participants can withdraw their consent **at any time across all four choices** using this reference number without needing to reveal their name again.
   - A withdrawal request purges the file from both the **Hub Vault** and **`at-pds` CAR backups** (and issues a repository delete tombstone if a summary was published under Choices 3 or 4). All raw recordings and transcripts are deleted within **12 months** of project completion.
4. **Third-Party Redaction & Disguised-Contact Filter:**
   - Names, phone numbers, emails (including disguised formats such as `"john dot doe at..."` or spaced digits), and identifying details of **third parties** mentioned during an interview must be redacted before any record can be approved for `2. Research` or `3. Anonymous public`.
   - The Vault review screen blocks `Anonymous` approval if any detected identifier remains unredacted.

---

## 2. The Four Consent Choices + Separate AI Question (`D30`)

Instead of overwhelming interviewees with technical protocol questions, interviewers offer **four clear choices** plus **one separate Yes/No question on AI model training**:

| Choice | Identity | Audience (`Who Can See It`) | Form (`What Is Shared`) | Where the Data Lives | Withdrawal & Retention Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`1. Private` *(Safe Default)*** | Named *(inside vault only)* | **The interviewing team and hub reviewer only** | Original recording & working notes (used only for internal score calibration; zero quotes or transcripts shared outside the hub) | **Encrypted Hub Vault Only** *(Never enters a PDS repo)* | Immediate complete deletion from Hub Vault upon request; auto-deleted within 12 months. |
| **`2. Research` *(CPC / Authorised Researchers)*** | **Anonymous** *(PII & third-party names stripped)* | **Cardano Product Committee (`CPC`) & authorised researchers only** | **Edited anonymous transcript & structured findings** *(Original audio/video never leaves the Hub Vault)* | **Encrypted Hub Vault Only** *(Served via authenticated read path; never enters a public PDS repo)* | Immediate complete deletion from Hub Vault upon request; auto-deleted within 12 months. |
| **`3. Anonymous public` *(Recommended for Field Evidence)*** | **Anonymous** *(PII & third-party names stripped)* | **The public** (`Prisma network, CPC, and public repository`) | **Approved anonymous quotes & structured gate findings** + SHA-256 vault fingerprint | **Team's AT Protocol Repo on Hub PDS** *(Raw recording & full transcript stay in Vault)* | Vault files & `at-pds` CAR backups purged on withdrawal; public repo record deleted (noting prior external copies cannot be recalled). |
| **`4. Public, named`** | **Named** *(Participant's name, role, and institution cited)* | **The public** (`Prisma network, CPC, and public repository`) | **Participant-approved text / quotes & structured findings** | **Team's AT Protocol Repo on Hub PDS** *(Raw recording stays in Vault)* | Vault files & `at-pds` CAR backups purged on withdrawal; public repo record deleted (noting prior external copies cannot be recalled). |
| **Separate AI Toggle (`Default: No`)** | **Allow Future AI Model Training?** (`Yes` / `No` - **Default: `No`**) | Applies to whether anonymised text may be used to train or fine-tune future AI models. *(Note: Local on-server Whisper transcription and local PII-filtering inside the Hub Vault run automatically to protect privacy and do not send data to external AI model trainers.)* | | | |

### Who Counts as an "Authorised Researcher" under Choice 2 (`Research`)?
Access to edited anonymous transcripts under **Choice 2 (`Research`)** is restricted strictly to:
1. Designated reviewers of the **Cardano Product Committee (`CPC`) / Intersect MBO** evaluating Grant `CPC-26-0013` deliverables, and
2. Named core synthesis researchers of **PRISMA (`Aspecting OÜ`)** approved in writing by both the **Project Lead (`Alfred Itodole`)** and the **custodial Regional Hub Lead**.
Original audio or video recordings are **never** accessible to external researchers under any choice.

---

## 3. Read-Aloud Scripts for Hub Leads & Interviewers (`Under 60 Seconds`)

Read the opening statement and the four option sentences aloud before starting the recorder, then log the participant's choice and give them their **Withdrawal Reference Number**:

> **Opening Statement (Read Aloud to Every Participant):**
> *"Thank you for speaking with us for this regional technology and market study commissioned by the Cardano Product Committee. Before we begin, you choose how your words are handled, and we will give you a reference number (`[Respondent_ID]`) so you can change your mind or ask us to delete your record at any time."*

- **Option 1 (`Private` - Default):**
  > *"If you choose **Private**, your recording and notes stay locked inside our local hub's encrypted vault for our small team's internal scoring only, and nothing you say is ever quoted or shared outside our hub."*
- **Option 2 (`Research`):**
  > *"If you choose **Research**, we remove your name, contact details, and any identifying references, and share only the edited anonymous transcript with the Cardano Product Committee and authorised project researchers from inside our secure vault, never on the public internet."*
- **Option 3 (`Anonymous public`):**
  > *"If you choose **Anonymous public**, we remove your name and all identifying details so you cannot be identified, and publish only approved anonymous quotes and summary findings to the public research repository."*
- **Option 4 (`Public, named`):**
  > *"If you choose **Public, named**, we will publish only the specific statements and findings you approve alongside your name, title, and organisation in the public research report."*
- **Separate AI Question (`Default = No`) & Withdrawal Note (Read Aloud):**
  > *"Our local server transcribes and redacts interviews privately on our own machine without training external AI. Separately, do you allow your responses to be used for future AI model training? By default we mark **No**. You can withdraw at any time using your reference number `[Respondent_ID]` and we will delete your files from our vault and backups, though please note that if you choose a public option (Option 3 or 4), outside copies or screenshots made while it was public cannot be recalled."*

---

## 4. Pre-Call Screening & Metadata Fields Captured at Intake

| Part | Where Stored | Mandatory Fields Captured |
| :--- | :--- | :--- |
| **Part A: Confidential Identity & Pre-Recording Consent Log** | **Strictly in Encrypted Hub Vault (`Never in Repo`)** | 1. `Withdrawal Reference Number` (`Respondent_ID`, e.g., `SC-BA-PAY-01`)<br/>2. Participant Full Name, Title, Organisation & Contact Channel<br/>3. Pre-Recording Consent Choice (`1. Private` [default], `2. Research`, `3. Anonymous public`, or `4. Public, named`)<br/>4. AI Model Training Permission (`No` [default] or `Yes`)<br/>5. Recording Modality (`Audio/Video`, `Notes Only`, or `Written Screener + Call`) & Timestamp of Consent |
| **Part B: Anonymised Research Metadata (`Choices 3 & 4` Only)** | **Team Repo on Hub PDS (`events.prisma.evidence.interview`)** | 1. `Respondent_ID` (`[Cluster]-[Hub]-[Pack]-[Number]`)<br/>2. `Regional_Cluster` & `Tested_Play_ID` (`H1-H7`, `H11-H12`)<br/>3. `Respondent_Category` (`1 of 7 Question Packs`) & `Functional_Role` (`1 of 6 Counterparty Roles`)<br/>4. `Non_Cardano_Independent` (`true` / `false`)<br/>5. `Consent_Scope` (`anonymous` or `public`) & `Vault_SHA256_Fingerprint`<br/>6. Redacted `Gate_Findings`, `Proposed_CASS_Tier`, `Regulatory_Certainty`, and `Reviewer_Signoff_DID` |
