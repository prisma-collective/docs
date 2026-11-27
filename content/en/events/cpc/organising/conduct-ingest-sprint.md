---
sidebarTitle: Conduct-Ingest Sprint
---

# Conduct-Ingest Sprint: Timeline and Launch Plan

The Conduct-Ingest Sprint is the six weeks of Phase 3 in which our teams carry out stakeholder interviews and turn them into verified research records. It is Milestone 3 of the CPC contract (Weeks 7 to 12, 22,000 ADA).

The sprint runs as an [Action-Learning Journey](/en/patterns/action-learning%20journeys) across our three [Regional Hubs](/en/collaborators/place/hub/hubs): Lagos (West Africa), Nairobi (East Africa) and Buenos Aires (Southern Cone). Each hub coordinates three Local Project Teams, nine in total.

This page covers three things: what must be ready before the first real interview, how the six weeks are paced, and what happens to each interview in the 72 hours after it takes place.

---

## 1. Launch sequence (14 to 21 November 2026): decoupling vault capture from public repository publishing

Because any record written to an AT Protocol repository is permanent, our launch plan separates **private interview capture in the Hub Vault** from **public repository publishing**:

| Step | When | Operational Reality & Readiness Gate | Role Group Lead |
| :-: | :--- | :--- | :--- |
| **1. Consent choices and lexicon alignment** | 14-17 Nov | Align the four consent choices (`Private`, `Research` [maps to M1 Confidential Synthesis], `Anonymous public` [maps to M1 Role-Only Anonymised], and `Public named` [maps to M1 Full Attribution]) plus the five privacy and redaction safeguards ([see the consent guide](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders)) across the docs, the Hub Vault review screen (`/review`), and the `consentScope` field. In parallel, the Infrastructure Lead finalises the interview record Lexicon namespace incorporating `eventId`, followed by a dedicated Lexicon pull request for extended research fields. | [Infrastructure, Research & Regional Hub Leads](/en/events/cpc/Roles,%20Responsibilities%20and%20Domains) |
| **2. Hub and Local Team enrolment** | 16-18 Nov | The three Regional Hubs (`events.prisma.hub.profile`) enrol through PRISMA, then each hub registers its three Local Project Teams (`events.prisma.hub.team`), following the [enrolment requirements](/en/events/cpc/organising/enrolment/form-guidance/participants). Every hub and team uses a dedicated Cardano wallet for project work ([Prisma DIDs](/en/processes/enrolment/dids/overview)). | [Research Lead, PI, Protocol & Regional Hub Leads](/en/events/cpc/Roles,%20Responsibilities%20and%20Domains) |
| **3. Interim walkthrough on the Hub Vault Web Form** | 18-19 Nov | Walk through the live user journey on the **Hub Vault Web Form**: the team signs in with its dedicated wallet, uploads a test recording and structured notes, the filter flags personal details, a Hub Lead reviews on `/review`, and only approved records move forward (`events-cli` command-line integration is documented separately by the protocol and CLI team). | [Infrastructure & Regional Hub Leads](/en/events/cpc/Roles,%20Responsibilities%20and%20Domains) |
| **4. End-to-end dry run and recorded onboarding video** | 19-21 Nov | Run the complete end-to-end dry run (Hub Vault Web Form wallet sign-in, synthetic recording and note upload, local Whisper transcription and redaction filter check, lead review on `/review`, and `AppView` indexing) using the three [Synthetic Interview Test Samples](/en/events/cpc/organising/synthetic-interview-test-samples) formatted to match our Interview Guide templates. **During this dry run, the Infrastructure & Regional Hub Leads record a short end-to-end screen-recording demonstration video of the full workflow using a synthetic interview sample so the Project Lead can use it to onboard all nine Local Project Teams.** | [Infrastructure & Regional Hub Leads](/en/events/cpc/Roles,%20Responsibilities%20and%20Domains) |
| **5. Real Wave 1 interviews begin (Vault capture first, publishing gated)** | From 21 Nov | Local Teams begin conducting real Wave 1 interviews on **21 November** and uploading recordings and structured notes directly through the **Hub Vault Web Form**. **All real interview uploads remain 100% private inside the encrypted Hub Vault (`Private` default; zero raw data leaves the hub vault). No real interview records are published out of the Hub Vault to public repositories until (a) the consent specification is finalised and (b) the local transcription and redaction filter step is live and verified on the pilot server.** (`CIP-0020` on-chain batch anchoring is not a prerequisite blocker for 21 November and cleanly follows after the first verified ingest and publication wave.) | [Research Lead, Infrastructure & Regional Hub Leads](/en/events/cpc/Roles,%20Responsibilities%20and%20Domains) |

---

## 2. The six weeks: three waves (21 November to 30 December 2026)

The contract requires 30 to 45 interviews. We are aiming for 42 to 51 verified interviews across the three hubs, which gives us room if some meetings fall through. The sprint is paced in three two-week waves.

**Wave 1, Weeks 7-8 (21 Nov to 4 Dec): warm contacts and anchor institutions.**
Teams start with the 18 organisations where we already have a working relationship, as listed in the [Counterparty Access Map](/en/events/cpc/executing/deliverables/counterparty-access-map). These include cooperative federations, universities, export associations and payment sandboxes. The goal is 15 to 18 verified records. At the Week 8 checkpoint we look at who has not responded and bring in substitutes through warm referrals.

**Wave 2, Weeks 9-10 (5 Dec to 18 Dec): referred contacts, regulators and legal counsel.**
Teams move to the 18 referred organisations and the most important desk-identified ones: central bank and securities regulators, licensed payment operators and local legal counsel. The open legal questions from the [Regulatory Scan](/en/events/cpc/executing/deliverables/regulatory-preliminary-scan) are tested here, along with one or two diagnostic calls on land registries in Lagos and Abuja. The goal is another 16 to 19 records, which takes us past the contractual floor of 30. At the Week 10 checkpoint we lock the legal answers and the infrastructure ratings.

**Wave 3, Weeks 11-12 (19 Dec to 30 Dec): closing gaps and writing up.**
The last 11 to 14 interviews fill any missing respondent categories. Teams finish cross-hub checks on every record, work through contradictions between respondents, and record whether each hypothesis was confirmed, revised or rejected. The wave ends with the Milestone 3 Fieldwork Synthesis Report and the 30 December checkpoint.

---

## 3. Who interviews whom

Only the three Regional Hubs carry out Phase 3 fieldwork. Each hub's three Local Teams typically run four to six interviews each.

| Regional Hub | Teams | What they are testing | Target interviews |
| :--- | :-: | :--- | :-: |
| **Lagos Hub** (Nigeria, Ghana; Senegal as desk reference) | 3 | Wholesale business-to-business payment corridors, credentials issued by universities and trade guilds, and a short diagnostic on land registries | 15-18 |
| **Nairobi Hub** (Kenya, Rwanda, Uganda) | 3 | Cross-border and humanitarian settlement, and European Union export traceability for coffee and tea | 13-16 |
| **Buenos Aires Hub** (Argentina, Uruguay, Paraguay) | 3 | Dollar escrow for cooperatives and small businesses, and portable credentials tied to cross-border contractor payments | 14-17 |
| **Total** | **9** | **7 hypotheses** | **42-51** |

Every hub keeps to the same balance rules:

- At least three in four interviewees come from organisations independent of Cardano. The Cardano ecosystem question pack is capped at a quarter of interviews.
- Each hub covers at least four of the seven respondent categories.
- Each hub aims for two to three verified records a week.

The other candidate regions screened in Milestone 2 (Iberia, Brazil, the Andean countries and Mexico, held on desk monitoring, and Ethiopia, excluded) receive no Phase 3 fieldwork. You can see why in [Candidate Regions](/en/events/cpc/executing/deliverables/candidate-regions).

---

## 4. What happens to one interview: the 72-hour path

Each interview follows the three layers of the [Interview Guide](/en/events/cpc/executing/deliverables/research-design-document/interview-guide).

1. **Hour 0: prepare and conduct** ([Conduct](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/conduct)). The team prepares the brief, reads the consent script, gives the participant a withdrawal reference number and records their choice (`Private`, `Research`, `Anonymous public`, or `Public named`) before the recorder starts. The interview itself takes 45 to 60 minutes.
2. **Hours 0-12: into the Hub Vault Web Form.** The team signs in to the Hub Vault web form with its dedicated wallet and uploads the recording and notes. Every upload lands in the encrypted Hub Vault set to `Private` by default ("zero raw data leaves the hub vault"). During the initial launch from 21 November, all real interview uploads stay strictly `Private` in the vault until the consent specification and pilot server filter step are locked.
3. **Hours 12-48: local filter and joint review** ([Ingest](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/ingest)). Once the filter step is active on the hub server, Whisper transcribes the recording locally and the filter flags names, contact details and third parties mentioned. The interviewer and the hub's vault reviewer inspect the draft together on `/review` and map findings to the eight decision gates. If the participant chose `Private` or `Research` (Milestone 1 Confidential Synthesis), the record stays permanently in the vault. Once the consent and filter gates are locked, if the participant chose `Anonymous public` (Milestone 1 Role-Only Anonymised, `consentScope: "anonymous"`) or `Public named` (Milestone 1 Full Attribution, `consentScope: "public"`), the reviewer signs the approved record into the team's repository.
4. **Hours 48-72: a second pair of eyes and post-ingest batch anchoring** ([Verify](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/verify)). A reviewer from a different hub, or the Project Lead, runs a six-step check before the record counts toward the quota and feeds [Evaluation](/en/processes/evaluation). `CIP-0020` on-chain batch anchoring is not a blocker for starting real interviews on 21 November and follows asynchronously after the first verified ingest wave.

---

## 5. Synthetic interview samples for the 19-21 November vault dry run

To test the Hub Vault Web Form, local Whisper transcription, regex rules, and the local redaction model (`llama3.2:3b`) end to end on **19 to 21 November** without touching real participant data, we have prepared three complete synthetic interview test packages on the dedicated [Synthetic Interview Test Samples](/en/events/cpc/organising/synthetic-interview-test-samples) page, alongside the quick-copy excerpts below. Each sample follows the [Interview Guide](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/conduct) format and intentionally includes fictional names, phone numbers, email addresses, links, and third-party references that the filter and human reviewer must strip before approving as `Anonymous public` (`consentScope: "anonymous"`).

### Sample A: Lagos Hub (West Africa, Testing Hypothesis `H1` Payment Corridors)

```text
[SYNTHETIC DRY-RUN SAMPLE - DO NOT COUNT TOWARD FIELDWORK QUOTA]
Withdrawal Reference Code: SYNTH-WA-LOS-PAY-01
Pre-Recorded Consent Choice: 3. Anonymous public (consentScope: "anonymous")
AI Model Training Consent: No (false)
Cluster & Hub: West Africa (Lagos Hub - Team 1)
Hypothesis & Question Pack: H1 (Wholesale B2B/MTO Corridor Settlement) | payment-infrastructure
Respondent Role & Independence: R6 Technical & Compliance Enabler | Non-Cardano (Independent MTO)

--- UNREDACTED TRANSCRIPT SEGMENT (FOR VAULT FILTER TEST) ---
Interviewer: Thank you for joining us in Victoria Island today. Before we talk about any new settlement rails, how does your treasury desk currently clear Naira-to-Cedi trade invoices between Lagos and Accra?
Respondent (Chinedu Okafor, Head of Treasury at KoboBridge FX Ltd): Right now, domestic leg collection in Nigeria is instant through NIBSS NIP, and our Ghanaian partner settles the last mile over GhIPSS GIP. The pain is the cross-border middle leg. Because PAPSS liquidity is still thin for mid-market importers, my compliance officer Amina Bello (you can reach her at amina.bello@kobobridge-example.ng or +234 803 555 0192, internal portal https://treasury.kobobridge-example.ng/otc) routes 80 percent of our wholesale settlement through Tron TRC-20 USDT OTC desks in Apapa. We lose about 185 basis points on the turn and wait six to eighteen hours when banking cutoffs hit. If someone pitches us Cardano USDCx or USDM, we will not switch unless a licensed SEC ARIP liquidity provider in Lagos quotes tighter than 1.5 percent with same-hour Naira payout.

--- STRUCTURED DECISION-GATE SUMMARY (FOR REVIEWED REPOSITORY TEXT) ---
- Gate 1 & Gate 2 (Region & Use Case H1): Revises H1 toward wholesale B2B inter-MTO settlement; domestic retail is already solved by NIBSS NIP and GhIPSS GIP.
- Gate 4 (Regulation): SEC Nigeria ARIP licensing is active under ISA 2025; CBN requires Naira-only domestic payout.
- Gate 5 (Infrastructure): Local off-ramp and stablecoin liquidity rated Unmet for Cardano USDCx/USDM compared with Tron TRC-20 USDT OTC depth.
- Gate 7 (Adoption Signal): No active Cardano usage (CASS Tier 4 baseline); falsification threshold set at <1.5% wholesale spread.
```

### Sample B: Nairobi Hub (East Africa, Testing Hypothesis `H5` Agricultural Export Traceability)

```text
[SYNTHETIC DRY-RUN SAMPLE - DO NOT COUNT TOWARD FIELDWORK QUOTA]
Withdrawal Reference Code: SYNTH-EA-NBO-AGR-01
Pre-Recorded Consent Choice: 3. Anonymous public (consentScope: "anonymous")
AI Model Training Consent: No (false)
Cluster & Hub: East Africa (Nairobi Hub - Team 1)
Hypothesis & Question Pack: H5 (EUDR Coffee & Tea Export Traceability) | agricultural
Respondent Role & Independence: R4 Local Delivery Partner | Non-Cardano (Cooperative Union Exporter)

--- UNREDACTED TRANSCRIPT SEGMENT (FOR VAULT FILTER TEST) ---
Interviewer: How is your cooperative union preparing for the European Union Deforestation Regulation polygon reporting requirements for the upcoming harvest?
Respondent (Grace Wanjiku, Operations Director at Kirinyaga Highland Growers Union): We mapped 14,200 smallholder coffee plots using handheld GPS units and stored the GeoJSON polygons in our central Postgres database at our Kerugoya mill. My lead agronomist Peter Kamau (+254 722 555 0148, p.kamau@kirinyagagrowers-example.co.ke) sends CSV exports to our Hamburg buyer. The problem is that three different European roasters audit the same parchment lots at the Nairobi Coffee Exchange, and they do not trust a single exporter's editable SQL spreadsheet. However, farmers in Nyeri will never hold ADA tokens or smartphones for gas fees: every payout runs on Safaricom M-Pesa USSD *334#. Any cryptographic proof has to anchor one batch hash per export container on the backend while keeping farmer payouts 100 percent in M-Pesa Shillings.

--- STRUCTURED DECISION-GATE SUMMARY (FOR REVIEWED REPOSITORY TEXT) ---
- Gate 1 & Gate 2 (Region & Use Case H5): Supports H5 multi-actor auditability across cooperative, miller, exporter, and EU buyer where a single SQL database lacks cross-party trust.
- Gate 4 (Regulation): Kenya DPA 2019 s. 40 requires farmer personal data and raw plot owner names to remain off-chain inside the local vault or cooperative server.
- Gate 5 (Infrastructure): Mobile-first USSD/M-Pesa integration and backend fee sponsorship are mandatory; farmers cannot hold ADA or manage seed phrases.
```

### Sample C: Buenos Aires Hub (Southern Cone, Testing Hypothesis `H6` Cooperative USD Escrow)

```text
[SYNTHETIC DRY-RUN SAMPLE - DO NOT COUNT TOWARD FIELDWORK QUOTA]
Withdrawal Reference Code: SYNTH-SC-BUE-PAY-01
Pre-Recorded Consent Choice: 3. Anonymous public (consentScope: "anonymous")
AI Model Training Consent: No (false)
Cluster & Hub: Southern Cone (Buenos Aires Hub - Team 1)
Hypothesis & Question Pack: H6 (B2B Cooperative & SME Programmable USD Escrow) | delivery-partners
Respondent Role & Independence: R3 Procurement & Budget Owner | Non-Cardano (Software Export Cooperative)

--- UNREDACTED TRANSCRIPT SEGMENT (FOR VAULT FILTER TEST) ---
Interviewer: When your cooperative signs multi-month software delivery contracts with clients in Uruguay and Spain, how do you handle milestone escrow and contributor splits today?
Respondent (Martín Echeverría, Treasurer at Cooperativa SurCódigo Ltda, Palermo, Buenos Aires): For everyday Peso expenses in CABA, everyone uses Transferencias 3.0 QR and Mercado Pago. For cross-border dollar contracts under DNU 70/2023 Article 765, our accountant Lucía Fernández (lucia.fernandez@surcodigo-example.coop, WhatsApp +54 9 11 5555 0183) collects USDC on Polygon or USDT on Tron through a CNV-registered PSAV and tracks member allocations in Google Sheets. Where we struggle is multi-cooperative contracts where three independent studios share milestone escrow and none of us wants one studio holding the whole multisig key. If a Cardano eUTxO escrow script can split USDCx automatically upon milestone sign-off and hand our PSAV a clean CIP-0020 invoice reference, we would test a USD 25,000 pilot contract, provided our PSAV supports direct ARS/USD off-ramping.

--- STRUCTURED DECISION-GATE SUMMARY (FOR REVIEWED REPOSITORY TEXT) ---
- Gate 1 & Gate 2 (Region & Use Case H6): Supports H6 for multi-party B2B cooperative USD milestone escrow under Civil and Commercial Code Art. 765; confirms domestic ARS retail is already solved by Transferencias 3.0.
- Gate 4 (Regulation): CNV General Resolution 1058/2025 governs PSAV fiat off-ramps; ARCA tax invoicing requires deterministic transaction metadata.
- Gate 5 (Infrastructure): Requires CNV-registered PSAV integration for Cardano USDCx/USDM so cooperatives do not bear double bridge hops.
```
