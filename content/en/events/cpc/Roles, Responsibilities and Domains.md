**Roles, Responsibilities and Domains: CPC**

**Purpose of the CPC engagement**

The Cardano Product Committee (CPC) engagement produces regional market intelligence that Cardano can act on. It runs under Grant Agreement CPC-26-0013 as a local-first field research and publication sprint.

Three [Regional Hubs](/en/collaborators/place/hub/hubs) carry the fieldwork: Lagos, Nairobi and Buenos Aires. Each hub coordinates three Local Project Teams, so nine teams in total speak with regulators, payment operators, cooperatives, universities and businesses in their own regions. What they learn becomes three regional entry playbooks and one cross-regional synthesis, written as decision support for the Cardano Product Committee.

---

**PRISMA Role**

PRISMA organises and facilitates the engagement as an [Action-Learning Journey](/en/patterns/action-learning%20journeys): a time-bound sprint in which local teams learn by investigating real institutional problems in their own region. PRISMA's job is to make that journey possible and to turn its results into publications the CPC can rely on.

**PRISMA Responsibilities**

- Build the capacity of the three Regional Hubs and their [Hub Teams](/en/collaborators/place/hub/hub%20team) to run primary research with local stakeholders.
- Provide the publishing stack. Through [Process Infrastructuring](/en/processes/process-infrastructuring), each hub gets its own environment to capture, filter, consent and publish field evidence as signed records on [ATProto](/en/processes/process-infrastructuring/publishing/atproto), using the shared templates in the [PRISMA Lexicons](https://github.com/prisma-collective/lexicons).
- Design the research process: the Regional Adoption Readiness Framework (RARF), the Cardano Adoption Signal Standard (CASS), the [Interview Guide](/en/events/cpc/executing/deliverables/research-design-document/interview-guide), the [Stakeholder Recruitment Plan](/en/events/cpc/executing/deliverables/research-design-document/stakeholder-recruitment-plan) and the seven [Question Packs](/en/events/cpc/organising/question-packs).
- Give everyone involved enough organisational clarity to act on their own initiative and still stay aligned through the [Conduct-Ingest Sprint](/en/events/cpc/organising/conduct-ingest-sprint).
- Use social technology that meets people where they are, while keeping the research rigorous and the participants protected.
- Check that every publication fits CPC scope and answers the decisions Cardano actually needs to make.

**PRISMA Domain**

- The full arc from [Enrolment](/en/processes/enrolment) of hubs and teams, through fieldwork ([Enactment](/en/processes/enactment)), to final synthesis and [Evaluation](/en/processes/evaluation)
- Fieldwork facilitation: helping hubs and teams run interviews well
- Publishing: the infrastructure and process that turns consented field evidence into structured publications and living [Case Studies](/en/patterns/case-study)

**Frontiers and boundaries**

- PRISMA does not conduct the primary research itself. It builds the capacity of the hubs and teams to do it.
- PRISMA does not make Cardano's product decisions. It delivers the intelligence the Product Committee decides on.
- PRISMA does not own the content of the field evidence. The hubs and teams own their interviews and their local relationships.
- PRISMA provides research and publishing infrastructure. It does not supply engineering teams to build hub projects.

**Tabs Role:**

- Principal representative and final risk-bearer of Prisma
- First point of contact with Cardano Product Committee
- Supporting Alfred in his role as project lead

**Tabs Responsibilities:**

- Steward the level/ quality of work and ensure Alfred is enabled to lead on the project
- Address any organisational blockers at the level of CPC within the broader lines of work of Prisma as a whole
- Resource Alfred and other team members from the perspective of the broader lines of work of Prisma as a whole
- Action settlements
- Connect CPC project to broader organisational viability endeavours (go-to-market & business development)

**Tabs Domain:**

- Internal governance quality

**Alfred (Alfred Itodole)**

**Role**

- Co-Principal Investigator (Co-PI) and Project Lead / Project Manager for the CPC engagement, leading delivery from Milestone 2 through Milestone 5
- Research architecture and methodology lead
- The working bridge between the core infrastructure team, the three Regional Hubs and the CPC scope
- Alongside this, Alfred carries PRISMA's [Business Development](/en/collaborators/core/business-development/alfred) work

**Responsibilities**

- Design and steward the research method: RARF, CASS, the [Use-Case Hypothesis Register](/en/events/cpc/executing/deliverables/use-case-hypothesis-register), the Question Packs and the bias controls.
- Set the timeframe, the [enrolment requirements for hubs and teams](/en/events/cpc/organising/enrolment/form-guidance/participants) and the interview quotas for the Conduct-Ingest Sprint.
- Lead the Phase 2 desk screening, the Phase 3 cross-hub quality checks and the Phase 4 and 5 synthesis that produce the milestone deliverables and regional playbooks.
- Work with the Principal Investigator and the CPC Infrastructure and Regional Hub Leads so that the [consent model](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders), enrolment forms, Hub Vault review and Lexicons match the research and ethical commitments in the contract.
- Run rolling quality checks so that every published claim traces back to a signed, consented hub record.

**Domain**

- Project management, research method and evidence quality across Milestones 2 to 5
- Enrolment criteria, sprint scheduling and interview quotas across Lagos, Nairobi and Buenos Aires
- Cross-regional synthesis and authoring of contractual deliverables

**Frontiers and boundaries**

- Alfred does not replace local fieldwork. The hubs and their teams conduct and own their interviews.
- Alfred does not write protocol or server code. He sets the research, consent and data requirements that the infrastructure and engineering team implements.
- Alfred does not execute treasury payments or contract changes alone. These go through Tabs as PI and legal representative.

**Paul Role:**

- Protocol infrastructure development
- Building the publishing stack that carries evidence from the field to the publication
- Ensuring the hubs can use the publishing stack effectively

**Paul Responsibilities:**

- Develop and deliver the protocol layer: sign-in, identity, the firehose, and the data model that carries field evidence across hubs and events.
- Build the consent model: raw material stays local, only approved and filtered text reaches the network.
- Ensure the infrastructure is reusable across events through a shared lexicon namespace and the eventContract.
- Build backup and recovery so field evidence survives disk loss or server failure.

**Paul Domain:**

- The protocol layer: identity, the firehose, the data model, the lexicon namespace
- The eventContract that coordinates across hubs
- Backup and recovery of field evidence

**Doko Role:**

- Network and evidence infrastructure on the standard AT Protocol path: how hubs' records reach the network, and how field evidence becomes a record that is safe to publish
- Making the network visible: the AppView and potentialise's network view
- Keeping technical decisions traceable, so the whole team can follow and shape them

**Doko Responsibilities:**

- Run the network side of the publishing stack: the relay, Tap and the AppView that index what hubs publish and serve it to potentialise and the dashboards.
- Build the hub vault, where recordings and messages arrive (including from the Telegram bots). There they are transcribed and filtered locally, and a person reviews them before anything enters a repo. This is the hub-side part of the consent model, built on Paul's protocol layer: the vault writes with the reviewer's own session and holds no repo credentials.
- Keep the decision record (`docs/decisions.md` in at-tap): every architectural choice with its reasons, open for the team to review.
- Turn protocol decisions into tools the team can act on, such as publishing the Lexicons under `prisma.events` and the pilot server requirements.
- Work synthetic-first, so no confidential interview content ever enters code, tests or published records.

**Doko Domain:**

- Network ingestion and indexing: relay, Tap, AppView
- The hub vault: intake, transcription, local filtering and review
- potentialise's network view
- The technical decision record

**Frontiers / boundaries:**

- Not the PDS, identity or the eventContract: that is Paul's protocol layer. I build on it and propose changes through pull requests.
- Not the content of the Lexicons: I propose and review, and the team decides.
- Not deciding the consent levels or what participants agree to: the vault enforces what the team and the participants decide.
- Not the field research or its content: the hubs own it.

**Abdulbasit Role:**

- Security assurance, pre-flight verification, and vulnerability discovery across all CPC-related repositories.
- Serving as the operational proxy for the end user (the Hub Lead) to ensure tools are secure, robust, and intuitive before hitting the field.
- Pull request review and UI/UX optimization across CPC frontend applications.

**Abdulbasit Responsibilities:**

- **Pre-flight & Regression Verification**: Rigorously test and verify all CPC repositories locally to catch functional defects, edge cases, and regressions before hubs encounter them in production.
- **Security & Vulnerability Auditing**: Audit the Protocol, Data, and Ingestion backends (`at-pds`, `at-tap`, `lexicons`, and APIs) for potential exploits, data leakage vectors, injection flaws, or permission loopholes.
- **Proof-of-Concept (PoC) Development**: For every vulnerability or defect candidate discovered, build reproducible local Proofs of Concept and test harnesses so domain engineers can execute precise patches.
- **Hub Lead Advocacy**: Evaluate all workflows through the eyes of a Hub Lead, ensuring that field research and publishing processes remain friction-free, resilient to network dropouts, and respectful of local operating realities.
- **UI/UX Optimization & Brand Consistency**: Review and contribute to frontend interfaces (`potentialise`, `cpc-milestone-submission`, `evaluate`) to elevate usability, typography, and adherence to Prisma design tokens.
- **Independent PR Review**: Conduct technical and architectural reviews on incoming pull requests, providing constructive feedback on security posture and user ergonomics.

**Abdulbasit Domain:**

- Pre-production security assurance and vulnerability discovery across all CPC repositories.
- Verification test suites and Proof-of-Concept (PoC) artifact creation.
- Hub Lead user experience and interface ergonomics quality.

Frontiers / boundaries:

- Not writing production patches or modifying codebase implementations directly: Identifies candidates and delivers PoCs; implementation and patching remain with the domain authors (e.g., Paul for protocol, core engineers for features).
- Not managing production infrastructure or deployment credentials: Focuses on verification and local testing, not cloud DevOps.
- Not setting CPC project scope or contract terms: Communicates technical and UX findings to enable Tabs and Alfred to steer project direction.

Last updated on November 26, 2026
