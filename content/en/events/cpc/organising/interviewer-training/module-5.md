---
sidebarTitle: "Module 5: Verification & Wallet Security"
---

# Module 5: Dedicated Wallets, Cross-Hub Checks and Citation Links

Every record published from our fieldwork has to be traceable to the team that conducted the interview, the hub that reviewed it, and the second hub that verified it, without ever putting personal wallets or private participant details at risk.

---

## 1. Using a dedicated project wallet

- Every Regional Hub (**Lagos Hub**, **Nairobi Hub** and **Buenos Aires Hub**) and every Local Project Team (nine teams in total) sets up a **dedicated Cardano wallet** (such as a fresh Eternl profile) used only for this project. Teams never connect a personal savings wallet or a main organisation treasury wallet ([Cardano DIDs](/en/processes/enrolment/dids/overview)).
- During [Enrolment](/en/processes/enrolment), that dedicated wallet signs a one-time link to the team's repository on the hub server and issues a temporary signing session. That way, interviewers and reviewers can sign and submit research records during the six-week sprint without dealing with wallet pop-ups on every form.
- Actions that change ownership of a repository require multi-step confirmation inside the enrolment service so a team cannot lose access by mistake.

---

## 2. The six-step check by a second hub (Hours 48 to 72)

Before an interview counts toward our Milestone 3 fieldwork target (30 to 45 required by contract; 42 to 51 targeted across the three hubs) or is cited in a Regional Entry Playbook ([Evaluation](/en/processes/evaluation)), a reviewer from a **different Regional Hub** or the Project Lead ([Alfred Itodole](/en/collaborators/core/business-development/alfred)) runs six checks ([Layer 3: Verify](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/verify)):

1. **Identity and signatures.** Check that the team, hub and reviewer signatures are valid and match their enrolled project identities.
2. **Consent and redaction.** Check that the vault receipt is attached and that no personal names, third-party names or contact details appear anywhere in an anonymous record.
3. **Comparison against the local incumbent.** Check that the interview tested its assigned use case and compared the workflow against the local payment or identity system people already use in that country.
4. **Realistic signal rating.** Check that no unverified verbal claim or unfunded memorandum of understanding has been rated above the lowest adoption signal tier.
5. **Independent respondent balance.** Check that the hub stays above the 75% non-Cardano respondent floor (keeping interviews from the Cardano ecosystem at 25% or below).
6. **Permanent citation link.** Once the record passes, the verifier signs an attestation linked to the exact version of the interview record (`URI + CID`). That moves the organisation's status to **Interviewed** in the [Counterparty Access Map](/en/events/cpc/executing/deliverables/counterparty-access-map) and credits the Local Team and Hub through [Credential Schemas](/en/processes/enrolment/dids/credential-schemas).
