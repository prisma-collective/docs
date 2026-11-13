**Roles, Permits and Domains — CPC**

Purpose of CPC:

The Cardano Product Committee (CPC) project delivers decision-grade regional market intelligence to Cardano. It is a local-first field research and publication sprint: three publications, each curated from field excursions across selected regional hubs conducting primary research on locally-appropriate emerging technology use-cases.

Each publication makes that visible as decision support for the client technology provider, Cardano.

**Prisma Role:**

To organise and facilitate a compressed field activation and publication sprint across regional hubs, delivering three publications that surface local market intelligence for Cardano's product decisions.

**Prisma Responsibilities:**

- To build the capacity of the hubs to conduct primary research with local stakeholders.
- To provide the publishing stack — the infrastructure that lets hubs capture, filter, consent, and publish field evidence as structured records on the AT Protocol.
- To design the research process: interview guides, stakeholder recruitment, question packs, and the learning arc that leads hubs and participants through the field work.
- To provide organisational clarity for stakeholders to participate in emergent and aligned action across the 45-day sprint.
- To apply social technology that meets stakeholders where they are, whilst maintaining depth, integrity, and rigour aligned with regenerative principles.
- To verify that publications align with CPC scope and Cardano's decision needs.

**Prisma Domain:**

Our main purpose is to deliver three publications of decision-grade regional market intelligence. Our domains:

- From the enrolment of hubs through field work to the final delivery
- Field work: facilitating hubs to conduct primary research with local stakeholders
- Publishing: the infrastructure and process that turns field evidence into structured, consent-filtered publications

Frontiers / boundaries:

- Not conducting the primary research ourselves: we build the capacity of hubs to do it
- Not making the product decisions: we deliver the intelligence that Cardano's Product Committee decides on
- Not responsible for the contents of the field evidence (the interviews, the use-cases) — the hubs own those
- Not responsible for the technical capabilities of the hubs to build their own projects — we provide infrastructure, not engineering teams

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

**Alfred Role:**

- Project Lead and Principal Investigator for the CPC engagement
- Research architecture, methodological rigour, and milestone delivery lead across all five contract phases
- Operational bridge between the core infrastructure team, the Regional Hubs (Buenos Aires, Lagos, Nairobi, and Barcelona benchmark), and the Cardano Product Committee scope

**Alfred Responsibilities:**

- Design and steward the end-to-end research methodology: the Regional Adoption Readiness Framework (RARF), Cardano Adoption Signal Standard (CASS), Use-Case Hypothesis Register, modular Question Packs, and bias-control protocols.
- Set the timeframe, enrolment requirements, and quota allocation for the Conduct-Ingest fieldwork sprint across the regional hubs and their local project teams.
- Lead Phase 2 desk screening, Phase 3 cross-hub verification audits, and Phase 4-5 synthesis to assemble the contractual Milestone Deliverables and Regional Entry Playbooks.
- Coordinate with Paul, Doko, and Abdulbasit so that the consent model, enrolment forms, vault review workflow, and AT Protocol schemas (`events.prisma.*`) match the research and ethical commitments of the contract.
- Conduct rolling quality-control checks on ingested field records so that every published claim traces to a signed, consent-verified hub record (`strongRef`) and meets CPC decision-gate standards.

**Alfred Domain:**

- Research design, methodology, and epistemic quality across all five milestones
- Hub and Local Team enrolment criteria, fieldwork sprint scheduling, and respondent quota governance
- Cross-regional evidence synthesis and contractual deliverable authoring

Frontiers / boundaries:

- Not unilaterally substituting local hub fieldwork: the regional hubs and their local teams conduct and own their primary stakeholder interviews and local context.
- Not writing low-level protocol or server infrastructure code directly: defines research, consent, and schema requirements for Paul and Doko to implement in the stack.
- Not executing corporate treasury disbursements or legal contract modifications: escalates contractual and financial settlement actions to Tabs.

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

Last updated on November 13, 2026
