---
sidebarTitle: "Module 5: Verification & Wallet Security"
---

# Module 5: Dedicated Wallets, Cross-Hub Verification & `strongRef` Provenance

## 1. Mandatory Dedicated Wallet Practice (`D18`, `D20`, `D31`)
- Every Hub and every Local Team operates with a **dedicated CIP-30 Cardano wallet** (`Eternl` recommended) created specifically for the CPC sprint — **never a personal wallet or an organisation's main treasury wallet**.
- During enrolment, the dedicated wallet signs the identity link between `did:cardano` and the `did:plc` repository on the Hub PDS (`D18`) and grants a time-bounded delegated signing key (`D20`) so the team can submit and sign evidence records without constant wallet popups.
- Rotation keys (`D31`) are protected by `enrol`'s strict Content Security Policy (`CSP`) and three-layer confirmation safeguards.

## 2. Six-Step Cross-Hub Verification (`Hours 48-72`)
Before any interview record counts toward the Milestone 3 quota (`30-45` minimum; `42-52` target) or is cited in a Regional Entry Playbook, a designated verifier from a **second Regional Hub** (or the Project Lead) completes the 6-step verification check:
1. **Identity & Signature Check:** Confirm that `teamDid`, `hubDid`, and `reviewerDid` carry valid signatures verified by `Tap` and the `AppView` (`D20`, `D23`).
2. **Pre-Recording Consent & Zero-PII Check (`D5`, `D30`):** Confirm that no personal names, third-party names, or contact details appear in the record (unless `consentScope == "public"` with explicit named attribution consent).
3. **Play & Gate Completeness:** Confirm that the record tests its assigned play (`H1-H7`, `H11-H12`) and maps substantive evidence to the primary Decision Gates.
4. **CASS Anti-Hype Check:** Confirm that no uncorroborated verbal claim or unfunded MOU is rated above `CASS Tier 4`.
5. **Non-Cardano Quota Check:** Confirm compliance with the `>= 75%` non-Cardano respondent share (`<= 25%` Cardano ecosystem cap).
6. **`strongRef` Citation Pinning (`URI + CID`):** Once verified, the record's immutable AT Protocol `URI + CID` (`com.atproto.repo.strongRef`) is indexed in the `AppView` so every Milestone 3/4/5 playbook claim pins to the exact signed version of the field record.
