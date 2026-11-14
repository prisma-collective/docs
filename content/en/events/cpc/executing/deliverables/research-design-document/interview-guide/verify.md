# Layer 3: Cross-Hub Verification and Citation Links

Within **72 hours** of an interview (that is, within 24 hours after the Hub Vault Reviewer signs off in [Layer 2: Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest)), every record is checked by a second pair of eyes before it counts toward our Milestone 3 fieldwork total or is cited in a Regional Entry Playbook ([Evaluation](/en/processes/evaluation)).

---

### 1. Six-step check by a second hub

To keep scoring consistent across the **Lagos Hub**, **Nairobi Hub** and **Buenos Aires Hub**, the verifier must be either the **Project Lead ([Alfred Itodole](/en/collaborators/core/business-development/alfred))** or a **designated reviewer from a different Regional Hub** (for example, a reviewer in Buenos Aires checking a record from Lagos):

| Step | What is checked | What has to be true to pass |
| :-: | :--- | :--- |
| **1** | **Project identities and wallet signatures** | The hub and team repository identities resolve properly, are linked to dedicated project Cardano wallets ([Cardano DIDs](/en/processes/enrolment/dids/overview)), and carry a valid reviewer signature. |
| **2** | **Consent receipt and complete redaction** | The vault receipt and SHA-256 fingerprint are present, and no personal names, third-party names or disguised contact details appear anywhere in an anonymous record. |
| **3** | **Comparison with the local incumbent** | The interview tests its assigned regional workflow and compares the Cardano approach directly against the local system already in use (such as Transferencias 3.0, NIBSS Instant Payments, M-Pesa, PAPSS, Nigeria's NIN, QuarkID, or USDT on Tron and Polygon). |
| **4** | **Realistic adoption signal rating** | Any Tier 1 or Tier 2 adoption rating is backed by a verifiable transaction hash, a public contract reference or a confirmed budget; unverified verbal claims are moved to Tier 3 or Tier 4. |
| **5** | **Independent respondent balance** | The hub remains above the 75% non-Cardano respondent threshold (with Cardano ecosystem interviews at 25% or below) and covers at least four of the seven respondent categories. |
| **6** | **Permanent citation link (`URI + CID`)** | The verifier signs an attestation pointing to the exact version of the interview record (`com.atproto.repo.strongRef`), which updates the organisation's status to **Interviewed** in the [Counterparty Access Map](/en/events/cpc/executing/deliverables/counterparty-access-map). |

---

### 2. How verified records feed the network view and evaluation

* **Network indexing (`AppView`):** once verified, public and anonymous-public records from Lagos, Nairobi and Buenos Aires are indexed so teams can follow progress across hubs and build chronological threads ([Timelining](/en/processes/process-infrastructuring/publishing/timelining)).
* **Evaluation dashboard ([Evaluation](/en/processes/evaluation)):** reads from the index to show verified interviews per hub over time, trace citations from playbooks back to the underlying field records, and display how many vault items are waiting for review without exposing any private vault content.
* **Contribution credentials ([Credential Schemas](/en/processes/enrolment/dids/credential-schemas)):** verified records credit the Local Project Team and Regional Hub in the project's contribution table and link verifiable credentials to their dedicated project wallets.
