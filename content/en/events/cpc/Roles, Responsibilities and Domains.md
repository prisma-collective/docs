**Roles, Responsibilities and Domains: CPC**

**Purpose of the CPC engagement**

The Cardano Product Committee (CPC) engagement produces regional market intelligence that Cardano can act on. It runs under Grant Agreement CPC-26-0013 as a local-first field research and publication sprint.

Three [Regional Hubs](/en/collaborators/communities-of-place/hub/hubs) carry the fieldwork: Lagos, Nairobi and Buenos Aires. Each hub coordinates three Local Project Teams, so nine teams in total speak with regulators, payment operators, cooperatives, universities and businesses in their own regions. What they learn becomes three regional entry playbooks and one cross-regional synthesis, written as decision support for the Cardano Product Committee.

---

**PRISMA Role**

PRISMA organises and facilitates the engagement as an [Action-Learning Journey](/en/patterns/action-learning%20journeys): a time-bound sprint in which local teams learn by investigating real institutional problems in their own region. PRISMA's job is to make that journey possible and to turn its results into publications the CPC can rely on.

**PRISMA Responsibilities**

- Build the capacity of the three Regional Hubs and their [Hub Teams](/en/collaborators/communities-of-place/hub/hub%20team) to run primary research with local stakeholders.
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

---

**Tabs (Tobias Fechner)**

**Role**

- Principal Investigator (PI) for the CPC engagement and Infrastructure Lead
- Legal representative of Aspecting OÜ (trading as PRISMA) and contractual signatory toward the Cardano Product Committee and Intersect
- Supports Alfred, who leads day-to-day delivery as Co-PI and Project Lead

**Responsibilities**

- Steward the quality of the work and make sure Alfred has what he needs to lead the project
- Lead the architecture of PRISMA's [Process Infrastructuring](/en/processes/process-infrastructuring), which ties together Enrolment, [Ground Potentialising](/en/processes/ground-potentialising), Enactment and Evaluation
- Resolve organisational blockers where the CPC work meets PRISMA's wider lines of work
- Resource Alfred and other team members from the perspective of PRISMA as a whole
- Sign off milestones as PI and action settlements
- Connect the CPC engagement to PRISMA's long-term viability, including go-to-market and partnerships

**Domain**

- Principal Investigator oversight
- Internal governance quality
- The socio-technical infrastructure architecture

---

**Alfred (Alfred Itodole)**

**Role**

- Co-Principal Investigator (Co-PI) and Project Lead / Project Manager for the CPC engagement, leading delivery from Milestone 2 through Milestone 5
- Research architecture and methodology lead
- The working bridge between the core infrastructure team, the three Regional Hubs and the CPC scope
- Alongside this, Alfred carries PRISMA's [Business Development](/en/collaborators/core/business-development/alfred) and [Ecosystem Weaving](/en/collaborators/core/business-development/alfred/ecosystem-weaving) work

**Responsibilities**

- Design and steward the research method: RARF, CASS, the [Use-Case Hypothesis Register](/en/events/cpc/executing/deliverables/use-case-hypothesis-register), the Question Packs and the bias controls.
- Set the timeframe, the [enrolment requirements for hubs and teams](/en/events/cpc/organising/enrolment/form-guidance/participants) and the interview quotas for the Conduct-Ingest Sprint.
- Lead the Phase 2 desk screening, the Phase 3 cross-hub quality checks and the Phase 4 and 5 synthesis that produce the milestone deliverables and regional playbooks.
- Work with Tabs, Paul, Doko and Abdulbasit so that the [consent model](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders), enrolment forms, Hub Vault review and Lexicons match the research and ethical commitments in the contract.
- Run rolling quality checks so that every published claim traces back to a signed, consented hub record.

**Domain**

- Project management, research method and evidence quality across Milestones 2 to 5
- Enrolment criteria, sprint scheduling and interview quotas across Lagos, Nairobi and Buenos Aires
- Cross-regional synthesis and authoring of contractual deliverables

**Frontiers and boundaries**

- Alfred does not replace local fieldwork. The hubs and their teams conduct and own their interviews.
- Alfred does not write protocol or server code. He sets the research, consent and data requirements that Paul and Doko implement.
- Alfred does not execute treasury payments or contract changes alone. These go through Tabs as PI and legal representative.

---

**Paul**

**Role**

- Protocol infrastructure development
- Building the publishing stack that carries evidence from the field to the publication
- Making sure hubs can use that stack in practice

**Responsibilities**

- Develop and deliver the protocol layer: wallet sign-in, identity, the network firehose, and the data model that carries field evidence across hubs and events. Each hub and team gets a portable identity through [Prisma DIDs](/en/processes/enrolment/dids/overview), controlled by its own dedicated Cardano wallet.
- Build the consent model at protocol level: raw material stays local, and only approved, filtered text reaches the network.
- Keep the infrastructure reusable across events through the shared [PRISMA Lexicons](https://github.com/prisma-collective/lexicons) namespace and the Event Contract.
- Build backup and recovery so field evidence survives disk loss or server failure, and so a participant's withdrawal can be honoured everywhere their data is held.

**Domain**

- The protocol layer: identity, the firehose, the data model and the Lexicon namespace
- The Event Contract that coordinates across hubs
- Backup and recovery of field evidence

---

**Doko**

**Role**

- Network and evidence infrastructure on the standard [ATProto](/en/processes/process-infrastructuring/publishing/atproto) path: how hub records reach the network, and how field evidence becomes a record that is safe to publish
- Making the network visible through the AppView and the network view in [Ground Potentialising](/en/processes/ground-potentialising)
- Keeping technical decisions traceable so the whole team can follow and shape them

**Responsibilities**

- Run the network side of the publishing stack: the relay, the indexer (Tap) and the AppView that collect what hubs publish and serve it to the network view and dashboards.
- Build the Hub Vault. Recordings and messages arrive there, including from the Telegram bots. They are transcribed and filtered on the hub's own server, and a person reviews them before anything enters a repository. The vault writes using the reviewer's own session and holds no repository credentials of its own.
- Keep the team's architectural decision record, with the reasoning for every choice, open for review.
- Turn protocol decisions into tools the team can use, such as publishing the Lexicons under prisma.events and the pilot server requirements.
- Work synthetic-first, so no confidential interview content ever enters code, tests or published records.

**Domain**

- Network ingestion and indexing: relay, Tap and AppView
- The Hub Vault: intake, transcription, local filtering and review
- The network view in Ground Potentialising
- The technical decision record

**Frontiers and boundaries**

- The data server, identity and the Event Contract belong to Paul's protocol layer. Doko builds on it and proposes changes through review.
- The content of the Lexicons is decided by the team. Doko proposes and reviews.
- The consent levels and what participants agree to are set by the research lead and the participants. The vault enforces those choices.
- The field research and its content belong to the hubs.

---

**Abdulbasit**

**Role**

- Security assurance and pre-flight testing across the CPC tools
- Standing in for the end user, the Hub Lead and the Local Team interviewer, so tools are safe and easy to use before they reach the field
- Pull request review and interface quality across CPC frontends

**Responsibilities**

- **Pre-flight testing.** Test CPC tools before they reach the hubs, to catch defects and edge cases early.
- **Security and privacy review.** Look for ways data could leak, or permissions could be misused, across enrolment, identity, the data server and the Hub Vault.
- **Reproducible test cases.** For every issue found, build a clear way to reproduce it so the responsible engineer can fix it with confidence.
- **Hub Lead advocacy.** Walk through onboarding and interview intake as a Hub Lead would, checking that the five-minute sign-in and the vault review hold up on unreliable connections.
- **Interface review.** Review frontends for clarity, accessibility and consistency with PRISMA's design.

**Domain**

- Pre-production security and testing across CPC tools
- Test suites and reproducible test cases
- The Hub Lead's user experience

**Frontiers and boundaries**

- Abdulbasit does not write production fixes or hold production credentials. He finds issues and hands over test cases, and the domain owners (Paul for protocol, Doko for network and vault) ship the fixes.
- Abdulbasit does not set research scope or contract terms. He reports technical and usability findings so Tabs and Alfred can steer.

Last updated on November 14, 2026
