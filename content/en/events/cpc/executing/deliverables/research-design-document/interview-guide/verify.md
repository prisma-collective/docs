# Layer 3: Cross-Hub Verification, Provenance & Quality Control

Within **72 hours** of an interview (`24 hours` after the Hub Vault Reviewer signs off at Layer 2), every ingested record passes through independent verification before entering the Milestone 3 synthesis dataset or Regional Entry Playbooks.

---

### 1. Six-Step Cross-Hub Verification Checklist

To prevent regional hub bias, the Layer 3 verifier must be either the **Project Lead (`Alfred Itodole`)** or a **Designated Reviewer from a different Regional Hub** (e.g., a Buenos Aires Hub reviewer verifying a Lagos Hub record):

| Step | Verification Check | Pass Criteria |
| :-: | :--- | :--- |
| **1** | **Cryptographic Identity & Dedicated Wallet Binding (`D18`, `D20`, `D23`)** | `hubDid` (`did:plc`) and `teamDid` (`did:plc`) resolve on Prisma's PLC directory, are bound to dedicated operational `did:cardano` wallets verified against shared CIP-30 test vectors, and carry a valid `reviewerSignoffDid` signature. |
| **2** | **Pre-Recording Consent (`D30`) & Zero-PII Audit (`D5`, `D26`)** | `vaultReceiptId` and `sha256Fingerprint` are present; zero personal names, third-party names, or disguised contact details appear anywhere in an `anonymous` record. |
| **3** | **Play Assembly & Incumbent Confrontation Check** | Record tests its assigned hypothesis (`H1-H7`, `H11-H12`) and explicitly compares the proposed Cardano workflow against the named regional incumbent baseline (`Transferencias 3.0`, `NIBSS NIP`, `M-Pesa`, `NIMC NIN`, `QuarkID`, `Decidim`, or `Tron/Polygon USDT`). |
| **4** | **CASS Anti-Hype Enforcement** | Any proposed `CASS Tier 1` or `Tier 2` rating is backed by a verifiable transaction hash, public contract number, or corroborated institutional budget; uncorroborated verbal statements are downgraded to `Tier 3` or `Tier 4`. |
| **5** | **Non-Cardano Quota & Category Balance Check** | Confirms the hub remains above the `>= 75%` independent non-Cardano respondent threshold (`Cardano Ecosystem Pack <= 25%`) and spans at least 4 of the 7 respondent categories. |
| **6** | **`strongRef` Citation Pinning (`URI + CID`)** | Verifier signs a `Verification_Attestation` record referencing the interview record's exact AT Protocol `URI + CID` (`com.atproto.repo.strongRef`), advancing the counterparty's status to **`Interviewed`** in the Stakeholder Access Register. |

---

### 2. Network Visibility (`AppView`, `potentialise`, and Static `evaluate`)

* **TypeScript `AppView` (`D6`, `D16`):** Indexes verified records across all hubs, hides unverified wallet claims in the research view, and exposes public read endpoints (`/api/hubs`, `/api/activity`, `/api/research/*`) for network monitoring.
* **Static `evaluate` View (`D29`):** Reads directly from the `AppView` (with zero open server routes or raw Telegram exposure) to display activity per hub and record type over time, follow `strongRef` citation graphs (`playbook -> case -> interview`), and track vault review queue counts by status without exposing private content.
* **Cardano Credential Attestation (`dids` / `L_DID 199674` & `L_VC 199675`):** Verified contributions credit the Local Team and Hub in the Event Contract distribution table and anchor selective-disclosure `ContributionCredentials` to their dedicated `did:cardano` wallets.
