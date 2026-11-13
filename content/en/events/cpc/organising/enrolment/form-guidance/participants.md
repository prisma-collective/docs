---
sidebarTitle: Hubs & Local Teams Enrolment
---

# Enrolment Requirements: Regional Hubs and Local Project Teams

This document defines the eligibility rules, required form fields, public-consent boundaries (`D24`), approval authorities (`D25`), and wallet security practices (`D18`, `D20`, `D31`) for enrolling **Regional Hubs** and **Local Project Teams** into the CPC Phase 3 (`Milestone 3`) Conduct-Ingest Sprint.

---

## 1. Enrolment Architecture (`Two-Level Federated Registration`)

Enrolment follows the same federated pattern as the publishing stack (`D19`, `D25`):

1. **Level 1 - Regional Hub Enrolment (`Prisma enrol`):**
   - Prisma's central `enrol` instance registers the three priority emerging-market hubs (**Buenos Aires Hub** for the Southern Cone, **Lagos Hub** for West Africa, and **Nairobi Hub** for East Africa) plus the **Barcelona Benchmark Node** (Iberia).
   - Once approved and consented, Prisma's `enrol` publishes an `events.prisma.enrol.registration` record (`role: "hub"`, linked to the hub's `did:cardano`) from Prisma's `enrol` repository (`D25`).
   - The Hub then signs in with its dedicated Cardano wallet to initialise its own `did:plc` repository on its Hub PDS (`D18`, `D19`) and signs the bidirectional identity link (`did:cardano <-> did:plc`).
2. **Level 2 - Local Project Team Enrolment (`Hub enrol`):**
   - Each Priority Hub enrols **3 Local Project Teams** (`9 emerging-market teams` total across Buenos Aires, Lagos, and Nairobi, plus `1 benchmark team` in Barcelona).
   - Each Hub runs its own `enrol` flow (or hub-scoped registration path) and publishes team registrations (`role: "team"`) signed by the Hub's DID (`D25`: *the hub vouches for its teams*).
   - The AppView accepts a Hub registration only when issued by Prisma's trusted `enrol` DID, and accepts a Team registration only when issued by the DID of the parent Hub it names.

---

## 2. Mandatory Wallet & Operational Security Rules (`Before Enrolling`)

Before submitting an enrolment form, every Hub Lead and Local Team Lead must satisfy three security rules established during the pre-production readiness review:

1. **Dedicated Operational Cardano Wallet Only (`Never Personal or Treasury Wallets`):**
   - Every Hub and every Local Team **must create and use a dedicated CIP-30 Cardano wallet** (`Eternl` recommended and verified against the shared CIP-30 test vectors, `D23`) exclusively for CPC identity binding and repository signing.
   - **Never connect a personal savings wallet or an organisation's main treasury wallet.** Because wallet signatures bind `did:cardano` to the public AT Protocol repository (`D18`) and seed delegated signing/rotation permissions (`D20`, `D31`), using a dedicated operational wallet prevents accidental exposure of personal transaction history on the public graph and isolates operational keys.
2. **Ask Once at the Start, with Per-Field Public Consent (`D24`):**
   - Asking a question on the enrolment form does **not** make the answer public.
   - Every field that will be published to an AT Protocol repository (`events.prisma.enrol.registration` or `events.prisma.hub.profile`) has its own explicit consent checkbox on the form.
   - Any field without public consent (including contact emails, Telegram handles, and emergency phone numbers) remains strictly inside encrypted private storage and **never enters an AT Protocol repository** (`D5`, `D24`).
3. **Pre-Interview Ethics & Vault Review Certification (`Modules 1-5`):**
   - Every enrolled Hub Reviewer and Team Interviewer must complete the 5-Module Interviewer Training curriculum and commit to enforcing `D30` (`Pre-Recording Consent` with `1. Private` as the safe default and zero unredacted identifiers in anonymous records).

---

## 3. Who Can Enrol (`Eligibility Criteria`)

### 3.1 Regional Hub Eligibility (`role: "hub"`)

| Criterion | Requirement | Verification |
| :--- | :--- | :--- |
| **Approved Priority Cluster** | Must anchor one of the four Phase 3 clusters confirmed at Milestone 2: **Southern Cone (`Buenos Aires Hub`)**, **West Africa (`Lagos Hub`, covering Lagos, Abuja, Northern Nigeria & Accra)**, **East Africa (`Nairobi Hub`, covering Kenya, Rwanda & Uganda)**, or **Iberia (`Barcelona Benchmark`)**. | Verified against Milestone 2 Portfolio Decisions. |
| **Named Hub Lead & Vault Reviewer** | Must designate (a) a **Hub Lead** accountable for team coordination and local institutional introductions, and (b) a **Designated Vault Reviewer** accountable for running the 48-hour post-call PII filter review and signing repository approvals (`D26`). | Named in private enrolment fields; verified by Project Lead (`Alfred Itodole`). |
| **Institutional Access Reach** | Demonstrated ability to reach at least **4 of the 7 Respondent Categories** in the cluster (`Public Sector`, `Regulators & Policy`, `Humanitarian & NGOs`, `Delivery Partners`, `Payment Infrastructure`, `Agricultural Networks`, `Cardano Ecosystem`) with `>= 75%` independent non-Cardano counterparties. | Checked against the 64-entry Stakeholder Access Map. |
| **Dedicated Hub Wallet & Server Readiness** | Dedicated CIP-30 Cardano wallet (`did:cardano`) ready to link to the Hub's `did:plc` repository (`D18`, `D19`) and access to the Hub Vault review interface. | Verified during the 5-minute guided onboarding check. |

### 3.2 Local Project Team Eligibility (`role: "team"`)

| Criterion | Requirement | Verification |
| :--- | :--- | :--- |
| **Parent Hub Vouching** | Must be recruited, vetted, and vouched for by one of the enrolled Regional Hubs (`3 teams per priority hub`). | Parent Hub Lead approval (`D25`). |
| **Domain & Play Alignment** | Must be an active local practitioner or research team operating in one of the cluster's tested hypothesis domains (`H6, H7` in Southern Cone; `H1, H2, H3` in West Africa; `H4, H5` in East Africa; `H11, H12` in Barcelona). | Mapped to at least 1 primary hypothesis play (`H1-H12`) before enrolment approval. |
| **Team Composition (`2-3 Members`)** | Minimum of 2 members: a **Lead Interviewer** (conducts calls and question-pack assembly) and a **Field Scriber / Ingest Coordinator** (manages recording upload, timestamped transcription check, and 48-hour joint debrief with the Hub Reviewer). | Verified in team roster fields. |
| **Independence & Bias-Control Undertaking** | Commitment to test and falsify desk hypotheses objectively (no pitching Cardano, enforcing the `>= 2` non-Cardano respondent minimum per region and `<= 25%` Cardano ecosystem cap). | Signed Ethics & Bias-Control checkbox on enrolment form. |
| **Dedicated Team Wallet** | Freshly created, dedicated CIP-30 Cardano wallet (`did:cardano`) for team repository creation (`initiateRepo` on the Hub PDS, `D19`) and delegated key signing (`D20`). | Checked automatically by `enrol` (`stakeAddress` / `did:cardano` validation). |

---

## 4. Mandatory Enrolment Form Fields (`D24 Specification for Enrol & UI`)

### 4.1 Table A: Regional Hub Enrolment Form (`Prisma enrol`)

| # | Field Label / Key | Input Type | Required | Storage Destination | Public Consent Checkbox Required? (`D24`) | Purpose |
| :-: | :--- | :--- | :-: | :--- | :-: | :--- |
| **H1** | `hub_name` (e.g., `Buenos Aires Hub`, `Lagos Hub`, `Nairobi Hub`) | Text | Yes | **Public Repo** (`events.prisma.hub.profile`) | **Yes** *(Checkbox: publish hub name on network)* | Identifies the hub on `potentialise` and `evaluate`. |
| **H2** | `regional_cluster` (`Southern Cone`, `West Africa`, `East Africa`, `Iberia`) | Select | Yes | **Public Repo** | **Yes** *(Bundled with profile consent)* | Maps hub records to RARF regional cluster. |
| **H3** | `covered_cities_countries` (e.g., `Lagos, Abuja, Zaria, Accra`) | Text | Yes | **Public Repo** | **Yes** *(Bundled with profile consent)* | Documents sub-national and cross-border reach. |
| **H4** | `hub_cardano_wallet` (`stake1...` or `did:cardano:stake...`) | Wallet / Text (`ENROL_WALLET_FIELD`) | Yes | **Public Repo** (`events.prisma.enrol.registration`) | **Yes** (`ENROL_CONSENT_FIELD` - mandatory to publish registration) | Links Prisma's `enrol` registration to the Hub's wallet identity (`D24`, `D25`). |
| **H5** | `dedicated_wallet_attestation` | Checkbox | Yes | **Private (`enrol` DB only)** | No *(Internal security check)* | Confirms wallet is a dedicated operational wallet, not a personal or treasury wallet. |
| **H6** | `hub_lead_full_name` & `hub_lead_contact` (Email + Telegram handle) | Text / Email | Yes | **Private (`enrol` DB only)** | **No — Never Published (`D5`)** | Internal operational coordination only. |
| **H7** | `vault_reviewer_full_name` & `vault_reviewer_contact` | Text / Email | Yes | **Private (`enrol` DB only)** | **No — Never Published (`D5`)** | Identifies the authorised human reviewer who approves vault records (`D26`). |
| **H8** | `assigned_interview_quota` (`12-16` BA, `14-18` Lagos, `12-15` Nairobi, `3-4` BCN) | Number / Range | Yes | **Private (`enrol` DB) + Public Milestone Summary** | Yes *(Aggregate quota only)* | Tracks Phase 3 Conduct-Ingest Sprint delivery. |
| **H9** | `ethics_and_d30_consent_undertaking` | Checkbox | Yes | **Private (`enrol` DB only)** | No *(Internal compliance gate)* | Confirms adherence to `D30` pre-recording consent, 12-month retention limit, and vault rules. |

### 4.2 Table B: Local Project Team Enrolment Form (`Hub enrol`)

| # | Field Label / Key | Input Type | Required | Storage Destination | Public Consent Checkbox Required? (`D24`) | Purpose |
| :-: | :--- | :--- | :-: | :--- | :-: | :--- |
| **T1** | `team_name` (or Team Display Alias) | Text | Yes | **Public Repo** (`events.prisma.hub.team`) | **Yes** *(Checkbox: publish team name/alias)* | Displays team attribution on published research records. |
| **T2** | `parent_hub_did` / `parent_hub` (`Buenos Aires`, `Lagos`, `Nairobi`, `Barcelona`) | Select / Hidden | Yes | **Public Repo** | **Yes** | Links the team registration to the vouching Hub (`D25`). |
| **T3** | `assigned_plays` (`H1-H7`, `H11-H12`) | Multi-Select | Yes | **Public Repo** | **Yes** | Binds the team to specific hypothesis plays (`cluster x use case`). |
| **T4** | `target_question_packs` (`1-7`) & `team_interview_target` (`4-6` calls) | Multi-Select | Yes | **Private (`enrol` DB) + Aggregate Progress View** | Yes *(Aggregate target only)* | Ensures coverage across all 7 respondent categories and `>= 2` non-Cardano quota. |
| **T5** | `team_cardano_wallet` (`stake1...` or `did:cardano:stake...`) | Wallet / Text (`ENROL_WALLET_FIELD`) | Yes | **Public Repo** (`events.prisma.enrol.registration`) | **Yes** (`ENROL_CONSENT_FIELD` - mandatory) | Links the Hub's `enrol` registration to the Team's `did:plc` repo (`D19`, `D20`, `D25`). |
| **T6** | `dedicated_wallet_attestation` | Checkbox | Yes | **Private (`enrol` DB only)** | No | Confirms team wallet is a dedicated operational wallet, never personal or treasury. |
| **T7** | `team_members_names_and_contacts` (Lead Interviewer + Scriber emails/Telegram) | Text | Yes | **Private (`enrol` DB only)** | **No — Never Published (`D5`)** | Strictly confidential team contact directory (`protected behind authenticated endpoints`). |
| **T8** | `training_modules_completed` (`Modules 1-5`) | Checkbox | Yes | **Private (`enrol` DB only)** | No | Confirms completion of interviewer training before first field call. |
| **T9** | `ethics_and_vault_undertaking` | Checkbox | Yes | **Private (`enrol` DB only)** | No | Binding agreement to record consent before recording (`1. Private` default) and never upload raw PII outside the Hub Vault. |

---

## 5. Approval Rules & Guided Onboarding Flow (`Who Approves & What Happens Next`)

| Step | Actor | Action & Rule |
| :-: | :--- | :--- |
| **1. Hub Enrolment Approval** | **Project Lead (`Alfred Itodole`) & Project Director (`Tobias Fechner`)** | Verify the Hub's 9 form fields (`H1-H9`), dedicated wallet attestation, and quota allocation. Once approved, Prisma's `enrol` publishes `events.prisma.enrol.registration` (`role: "hub"`). |
| **2. Hub Guided Sign-In (`<= 3 mins`)** | **Regional Hub Lead** | Opens the Hub onboarding screen, signs in with the **dedicated Hub CIP-30 wallet**, automatically provisions the Hub's `did:plc` repo on its Hub PDS (`D18`, `D19`), and signs the `did:cardano <-> did:plc` binding link so the Hub appears live on `potentialise`. |
| **3. Team Enrolment Approval** | **Regional Hub Lead** *(with Project Lead quota review)* | Reviews the Local Team's 9 form fields (`T1-T9`), confirms play assignment (`H1-H7` / `H11-H12`) and training completion (`Modules 1-5`), and approves the team in the Hub's `enrol` instance. The Hub's `enrol` publishes the team registration (`role: "team"`) from the Hub's DID (`D25`). |
| **4. Team Guided Sign-In (`<= 3 mins`)** | **Local Team Lead** | Signs in with the **dedicated Team CIP-30 wallet**, receives the team's `did:plc` repo on the Hub PDS (`initiateRepo`, `D19`), and signs a time-bounded delegated signing key permission (`D20`) so the team can submit recordings and review drafts without constant wallet popups. |
| **5. Ready to Record** | **Local Team & Hub Vault Reviewer** | Team receives access to the Hub Vault intake channel (web upload / Telegram intake bot) and is cleared to begin scheduling Wave 1 interviews. |
