---
sidebarTitle: Synthetic Interview Test Samples
---

# Synthetic Interview Test Samples (19 to 21 November Dry Run)

This page provides three complete, fictional **Synthetic Interview Test Packages** formatted to match the [Interview Guide](/en/events/cpc/executing/deliverables/research-design-document/interview-guide/conduct) (`Assemble` preparation header, unredacted conversation transcript, and structured Decision-Gate analytical summary).

During the **19 to 21 November 2026** end-to-end dry run ([Conduct-Ingest Sprint](/en/events/cpc/organising/conduct-ingest-sprint)), the infrastructure team and the three active Regional Hubs (**Lagos Hub**, **Nairobi Hub**, and **Buenos Aires Hub**) use these synthetic packages to test the **Hub Vault Web Form** user journey:

1. Signing in to the Hub Vault web form with a dedicated project wallet ([Prisma DIDs](/en/processes/enrolment/dids/overview)).
2. Uploading a synthetic audio recording and structured notes into the encrypted team vault.
3. Testing local Whisper transcription and the redaction filter (regex rules and local language model flagging of personal names, third-party names, phone numbers, email addresses, URLs, and indirect identifiers).
4. Walking through the Hub Reviewer approval screen across all four [Consent Choices](/en/events/cpc/organising/enrolment/form-guidance/local-stakeholders) (`Private`, `Research`, `Anonymous public`, and `Public named`) and verifying how approved public records appear on the `AppView` index.

All names, organisations, phone numbers, email addresses, and domains below are **100% fictional** so no real participant data is exposed during pipeline testing.

---

## 1. How to Test the Four Consent Scopes During the Dry Run

Each synthetic sample below can be tested across the four consent choices in the Hub Vault review screen (`/review`):

| Consent Choice (`1:1 Milestone 1 Mapping`) | Vault vs. Repository Destination | What the Redaction Filter and Reviewer Must Enforce in the Dry Run |
| :--- | :--- | :--- |
| **1. `Private`** *(Vault-Only Safe Default)* | Stays strictly inside the encrypted Hub Vault (`apps/vault`). Never written to a repository. | Default selection on upload and on the review screen. Verify that clicking approve under `Private` writes zero records to `at-pds` or the `AppView`. |
| **2. `Research`** *(maps to M1 Confidential Synthesis)* | Stays strictly inside the encrypted Hub Vault (`apps/vault`) for authenticated reading by CPC reviewers and authorised PRISMA synthesis researchers. Never written to a repository. | Verify that all personal names, third-party names, phone numbers, emails, URLs, and organisation identifiers are redacted before approval, and that zero records are written to the public `at-pds` repository. |
| **3. `Anonymous public`** *(maps to M1 Role-Only Anonymised)* | Published to the team repository (`consentScope: "anonymous"`). Raw audio and full transcript remain in the vault. | Verify that the review screen blocks approval if any phone number, email address, link, interviewee name, or third-party colleague name remains unredacted. Once cleaned, verify that the signed record (`events.prisma.evidence.interview`, pending final `eventId` namespace lock) publishes to the repository and indexes on the `AppView`. |
| **4. `Public named`** *(maps to M1 Full Attribution)* | Published to the team repository (`consentScope: "public"`). Raw audio remains in the vault. | Verify that participant-approved statements publish alongside the fictional interviewee's name, role, and organisation, while third-party colleagues who did not separately consent (`e.g. Amina Bello`, `Peter Kamau`, `Lucía Fernández`) still have their private phone numbers and emails removed. |

---

## 2. Synthetic Test Package 1: Lagos Hub (West Africa, Hypothesis `H1` Payment Corridors)

### 2.1 Pre-Call `Assemble` Header & Consent Log

```text
[SYNTHETIC DRY-RUN TEST PACKAGE 1 - LAGOS HUB (WEST AFRICA)]
Withdrawal Reference Code: SYNTH-WA-LOS-PAY-01
Cluster & Hub: West Africa | Lagos Hub (Local Team 1 - Victoria Island / Accra Corridor)
Hypothesis Tested: H1 - Wholesale B2B and MTO Cross-Border Corridor Settlement (Nigeria <-> Ghana)
Question Pack: payment-infrastructure (Category 5: Payment Infrastructure & Liquidity Providers)
Functional Role: R6 - Technical & Compliance Enabler
Cardano Affiliation: Non-Cardano (Independent Regional FX & Remittance Aggregator)
Screener Passed: Yes (Direct treasury and settlement authority; active in Lagos and Accra)
Pre-Recorded Consent Choice: Anonymous public (maps to M1 Role-Only Anonymised | consentScope: "anonymous")
Separate AI Model Training Consent: No (false - default)
Consent Recorded Before Recorder Started: Yes (2026-11-19T10:00:00Z)
```

### 2.2 Synthetic Unredacted Transcript (Upload or Read Aloud to Test Filter)

> **Identifiers embedded for the filter to catch:**
> - **Interviewee Name & Title:** `Chinedu Okafor`, Head of Treasury
> - **Organisation Name:** `KoboBridge Corridor Settlement Ltd` (`Plot 42 Adeola Odeku Street, Victoria Island, Lagos`)
> - **Third-Party Colleague Names:** `Amina Bello` (Chief Compliance Officer), `Kwame Mensah` (Accra Liquidity Partner at `Osu PayGate Ghana`)
> - **Phone Numbers (Standard & Spaced):** `+234 803 555 0192` and `zero eight zero nine, five five five, zero four one one`
> - **Email Addresses (Standard & Disguised):** `amina.bello@kobobridge-example.ng` and `chinedu dot okafor at kobobridge dash example dot ng`
> - **Internal URL:** `https://treasury-desk.kobobridge-example.ng/otc-settlement`

```text
Interviewer (Lagos Hub Team 1): Thank you for taking the time to speak with us today. Before we discuss any new settlement protocols, could you walk us through how your treasury desk currently clears cross-border trade and remittance payouts between Lagos and Accra?

Respondent (Chinedu Okafor, Head of Treasury, KoboBridge Corridor Settlement Ltd): Gladly. From our office at Plot 42 Adeola Odeku Street in Victoria Island, our domestic Naira collection leg in Nigeria is instant because we connect straight into NIBSS NIP through our settlement bank, and on the Ghanaian side our partner Kwame Mensah at Osu PayGate Ghana clears the local Cedi leg over GhIPSS GIP in under ten seconds. So domestic retail transfers are already solved.

The real bottleneck is the cross-border wholesale leg between Lagos and Accra. Because commercial bank correspondent lines take two to three business days and PAPSS liquidity is still thin for mid-sized import invoices between USD 30,000 and USD 150,000, my Chief Compliance Officer Amina Bello (her direct line is +234 803 555 0192 and her email is amina.bello@kobobridge-example.ng) currently clears about 80 percent of our wholesale corridor inventory through Tron TRC-20 USDT over-the-counter liquidity desks. You can also reach my desk at chinedu dot okafor at kobobridge dash example dot ng or on zero eight zero nine, five five five, zero four one one, and we log our daily batch quotes on https://treasury-desk.kobobridge-example.ng/otc-settlement.

When Nigerian importers fund us in Naira, we lose between 160 and 210 basis points converting into USDT and back into Ghanaian Cedis, and banking cutoff windows still leave us exposed for six to twelve hours overnight. Under the Investments and Securities Act 2025 and the SEC Nigeria ARIP framework, we have to document every counterparty wallet. If a Cardano stablecoin like USDCx or USDM wants to compete for our Lagos-to-Accra wholesale corridor, we would need a licensed local liquidity provider quoting tighter than 1.5 percent with same-hour Naira and Cedi settlement, because right now none of our OTC makers quote native Cardano pairs.
```

### 2.3 Expected Redacted Output for `Anonymous public` (`consentScope: "anonymous"`)

```text
[APPROVED ANONYMOUS PUBLIC RECORD - SYNTH-WA-LOS-PAY-01]
Cluster & Hub: West Africa | Lagos Hub (Local Team 1)
Hypothesis & Pack: H1 (Wholesale B2B/MTO Corridor Settlement) | payment-infrastructure
Respondent Archetype: Head of Treasury at a licensed Nigerian-Ghanaian cross-border payment aggregator (R6 Technical & Compliance Enabler | Non-Cardano)
Consent Scope: anonymous (Anonymous public / M1 Role-Only Anonymised) | AI Training: false

1. Operational & Incumbent Baseline (Gates 1, 2 & 3):
- Domestic legs are already solved by NIBSS NIP (Nigeria) and GhIPSS GIP (Ghana) in under 10 seconds.
- Cross-border wholesale settlement (USD 30,000 to USD 150,000 trade invoices) faces 2-3 day correspondent banking delays and thin mid-market PAPSS liquidity.
- The respondent currently routes ~80% of wholesale Lagos-Accra inventory via Tron TRC-20 USDT OTC desks at a 160-210 bps round-trip spread with 6-12 hour overnight settlement exposure.

2. Regulatory & Compliance Findings (Gate 4 - LC-03):
- Operates under Nigeria's Investments and Securities Act 2025 (ISA 2025) and SEC Nigeria ARIP compliance rules requiring full counterparty wallet documentation and Naira-only domestic settlement.
- Regulatory Certainty Pairing: Clear (High Certainty) on statutory authority; Conditional local counsel verification required for cross-border Lagos-Accra settlement net-off agreements.

3. Infrastructure Readiness & Falsification Test (Gates 5, 6, 7 & 8):
- Stablecoin Liquidity & Local Off-Ramp: Rated Unmet for Cardano USDCx/USDM in Lagos/Accra today (zero active OTC makers quoting native Cardano pairs).
- Hypothesis H1 Status: Revised (confirms wholesale B2B corridor demand, falsifies domestic retail replacement; sets a <1.5% spread and same-hour NGN/GHS settlement threshold forRFP 01 / RFP 03 liquidity onboarding).
- Provisional CASS Tier: Tier 4 (No active Cardano production usage).
```

---

## 3. Synthetic Test Package 2: Nairobi Hub (East Africa, Hypothesis `H5` Agricultural Export Traceability)

### 3.1 Pre-Call `Assemble` Header & Consent Log

```text
[SYNTHETIC DRY-RUN TEST PACKAGE 2 - NAIROBI HUB (EAST AFRICA)]
Withdrawal Reference Code: SYNTH-EA-NBO-AGR-01
Cluster & Hub: East Africa | Nairobi Hub (Local Team 1 - Nairobi / Central Highlands Corridor)
Hypothesis Tested: H5 - Agricultural Export Traceability & Smallholder Cooperative Verification
Question Pack: agricultural (Category 6: Agricultural & Supply-Chain Networks)
Functional Role: R4 - Local Delivery Partner
Cardano Affiliation: Non-Cardano (Independent Coffee Cooperative Union & Export Miller)
Screener Passed: Yes (Manages smallholder farmer registries and EU export compliance)
Pre-Recorded Consent Choice: Research (maps to M1 Confidential Synthesis | Vault-only CPC access)
Separate AI Model Training Consent: No (false - default)
Consent Recorded Before Recorder Started: Yes (2026-11-19T13:30:00Z)
```

### 3.2 Synthetic Unredacted Transcript (Upload or Read Aloud to Test Filter)

> **Identifiers embedded for the filter to catch:**
> - **Interviewee Name & Title:** `Grace Wanjiku`, Operations Director
> - **Organisation Name:** `Kirinyaga Highland Growers Cooperative Union` (`Kutus Road Mill, Kerugoya, Kenya`)
> - **Third-Party Names:** `Peter Kamau` (Lead GIS Agronomist), `Heinrich Vogel` (Compliance Buyer at `AlsterRoast GmbH` in Hamburg)
> - **Phone Numbers:** `+254 722 555 0148` and `+254 733 555 0921`
> - **Email Addresses:** `p.kamau@kirinyagagrowers-example.co.ke` and `g.wanjiku@kirinyagagrowers-example.co.ke`
> - **Internal URL:** `https://eudr-portal.kirinyagagrowers-example.co.ke/polygons`

```text
Interviewer (Nairobi Hub Team 1): How is your cooperative union currently handling farm-plot geolocation mapping and chain-of-custody audits for European coffee buyers under the EU Deforestation Regulation?

Respondent (Grace Wanjiku, Operations Director, Kirinyaga Highland Growers Cooperative Union): Over the past eight months at our Kutus Road Mill in Kerugoya, my lead GIS agronomist Peter Kamau (+254 722 555 0148, email p.kamau@kirinyagagrowers-example.co.ke) walked 14,200 smallholder coffee parcels with field enumerators and uploaded the GeoJSON boundary polygons into our central PostgreSQL database at https://eudr-portal.kirinyagagrowers-example.co.ke/polygons. You can also reach my office on +254 733 555 0921 or g.wanjiku@kirinyagagrowers-example.co.ke.

Where our current Postgres setup hits a wall is multi-buyer verification. When we deliver parchment coffee to the Nairobi Coffee Exchange, three different European buyers, including Heinrich Vogel at AlsterRoast GmbH in Hamburg, purchase split lots from the same wet-mill batch. Their European auditors refuse to rely on an editable CSV export from our server because an exporter's database administrator could alter plot coordinates or wet-mill delivery timestamps after harvest.

At the same time, two constraints are non-negotiable for us. First, under Section 40 of Kenya's Data Protection Act 2019, our farmers' national ID numbers, names, and phone numbers cannot be written to any public ledger outside Kenya. Second, 90 percent of our growers in Kirinyaga and Nyeri use basic feature phones and receive cherry advances exclusively over Safaricom M-Pesa USSD *334#. Farmers will never hold ADA tokens or pay blockchain transaction fees. If your team anchors one cryptographic Merkle root and cooperative verifiable credential per export container on Cardano while keeping farmer records inside our Kenyan server and payouts on M-Pesa, our Hamburg buyer has indicated they would co-fund a USD 2.50 per-tonne traceability check.
```

### 3.3 Expected Redacted Output for `Research` (`Vault-Only CPC & Authorised Researchers`)

```text
[APPROVED RESEARCH VAULT RECORD - SYNTH-EA-NBO-AGR-01 (VAULT-ONLY / NEVER PUBLISHED TO REPO)]
Cluster & Hub: East Africa | Nairobi Hub (Local Team 1)
Hypothesis & Pack: H5 (EUDR Coffee & Tea Export Traceability) | agricultural
Respondent Archetype: Operations Director at a Central Kenyan Coffee Cooperative Union (14,000+ smallholders | R4 Local Delivery Partner | Non-Cardano)
Consent Choice: Research (maps to M1 Confidential Synthesis - accessible only to CPC reviewers and authorised PRISMA researchers inside the Hub Vault) | AI Training: false

1. Operational & Incumbent Baseline (Gates 1, 2 & 3):
- Cooperative union already stores 14,200 smallholder GeoJSON plot polygons in a centralized PostgreSQL database and pays farmers via Safaricom M-Pesa USSD (*334#).
- Multi-party trust gap: when parchment lots are split across multiple European roasters at the Nairobi Coffee Exchange, EU EUDR auditors reject mutable exporter CSV spreadsheets because a single administrator can alter plot coordinates or delivery timestamps post-harvest.

2. Regulatory & Compliance Findings (Gate 4 - LC-06):
- Kenya Data Protection Act 2019 (Section 40) prohibits writing farmer national IDs, personal names, or phone numbers to a public ledger; raw PII must remain off-chain in Kenya, with only salted batch Merkle roots and cooperative DID attestations anchored publicly.
- Regulatory Certainty Pairing: Clear (High Certainty) on DPA 2019 s. 40 off-chain requirement.

3. Infrastructure Readiness & Falsification Test (Gates 5, 6, 7 & 8):
- Mobile-First USSD & Fee Abstraction: Mandatory backend fee sponsorship (1 UTxO per export container lot) paired with existing M-Pesa payout rails; zero farmer wallet or ADA exposure.
- Hypothesis H5 Status: Confirmed (multi-party EU buyer audit demand verified; European buyer willingness to co-fund ~USD 2.50/tonne batch anchoring identified).
- Provisional CASS Tier: Tier 3 (Strong problem-owner alignment; no live Cardano production deployment yet).
```

---

## 4. Synthetic Test Package 3: Buenos Aires Hub (Southern Cone, Hypothesis `H6` Cooperative USD Escrow)

### 4.1 Pre-Call `Assemble` Header & Consent Log

```text
[SYNTHETIC DRY-RUN TEST PACKAGE 3 - BUENOS AIRES HUB (SOUTHERN CONE)]
Withdrawal Reference Code: SYNTH-SC-BUE-PAY-01
Cluster & Hub: Southern Cone | Buenos Aires Hub (Local Team 1 - CABA / Montevideo Corridor)
Hypothesis Tested: H6 - B2B Cooperative & SME Programmable USD Escrow & Settlement
Question Pack: delivery-partners (Category 4: Technical Delivery Partners, Cooperatives & System Integrators)
Functional Role: R3 - Procurement & Budget Owner
Cardano Affiliation: Non-Cardano (Federation-Affiliated Software Export Cooperative)
Screener Passed: Yes (Signs cross-border USD software contracts and manages cooperative treasury)
Pre-Recorded Consent Choice: Anonymous public (maps to M1 Role-Only Anonymised | consentScope: "anonymous")
Separate AI Model Training Consent: No (false - default)
Consent Recorded Before Recorder Started: Yes (2026-11-20T15:00:00Z)
```

### 4.2 Synthetic Unredacted Transcript (Upload or Read Aloud to Test Filter)

> **Identifiers embedded for the filter to catch:**
> - **Interviewee Name & Title:** `Martín Echeverría`, Treasurer
> - **Organisation Name:** `Cooperativa de Trabajo SurCódigo Ltda.` (`Thames 1640, Palermo, Ciudad Autónoma de Buenos Aires`)
> - **Third-Party Names:** `Lucía Fernández` (External Certified Accountant), `Diego Salgado` (Managing Director at `Montevideo CloudLabs S.A.`)
> - **Phone Numbers:** `+54 9 11 5555 0183` and `+598 99 555 041`
> - **Email Addresses:** `lucia.fernandez@surcodigo-example.coop` and `martin@surcodigo-example.coop`
> - **Internal URL:** `https://tesoreria.surcodigo-example.coop/escrow-2026`

```text
Interviewer (Buenos Aires Hub Team 1): When your cooperative delivers software projects with partner studios in Uruguay and Europe, how do you currently manage dollar contract escrow, milestone sign-off, and member distributions?

Respondent (Martín Echeverría, Treasurer, Cooperativa de Trabajo SurCódigo Ltda.): Here at our studio on Thames 1640 in Palermo, any domestic Peso expense in Buenos Aires runs over Transferencias 3.0 interoperable QR or Mercado Pago in seconds, so nobody needs a blockchain to buy coffee or pay local utilities.

Our headache is B2B cross-border milestone escrow. Since Decree DNU 70/2023 reformed Articles 765 and 766 of the Civil and Commercial Code, we legally denominate our B2B software contracts in US Dollars or stablecoins. Right now, when we co-deliver a USD 90,000 platform build with Diego Salgado at Montevideo CloudLabs S.A. (+598 99 555 041), our accountant Lucía Fernández (WhatsApp +54 9 11 5555 0183, email lucia.fernandez@surcodigo-example.coop) receives USDC on Polygon or USDT on Tron into a CNV-registered PSAV account and reconciles the three-studio revenue split manually in a spreadsheet at https://tesoreria.surcodigo-example.coop/escrow-2026. My own address is martin@surcodigo-example.coop.

Manual reconciliation causes two problems: first, none of the three partner cooperatives wants a single studio holding unilateral custody of the entire project escrow for ninety days; second, our tax filings with ARCA require an immutable invoice-to-payout audit trail across jurisdictions. If a Cardano eUTxO multi-party escrow contract can lock USDCx or USDM against deterministic milestone sign-off and attach the invoice hash in transaction metadata, we would pilot it on a USD 25,000 contract next quarter, but only if at least one CNV-registered PSAV under Resolution 1058/2025 supports direct Cardano stablecoin settlement without forcing us to bridge back to Tron or Polygon first.
```

### 4.3 Expected Redacted Output for `Anonymous public` (`consentScope: "anonymous"`)

```text
[APPROVED ANONYMOUS PUBLIC RECORD - SYNTH-SC-BUE-PAY-01]
Cluster & Hub: Southern Cone | Buenos Aires Hub (Local Team 1)
Hypothesis & Pack: H6 (B2B Cooperative & SME Programmable USD Escrow) | delivery-partners
Respondent Archetype: Treasurer at a Buenos Aires Software Export Cooperative (R3 Procurement & Budget Owner | Non-Cardano)
Consent Scope: anonymous (Anonymous public / M1 Role-Only Anonymised) | AI Training: false

1. Operational & Incumbent Baseline (Gates 1, 2 & 3):
- Domestic ARS retail payments are fully solved by BCRA Transferencias 3.0 QR and Mercado Pago.
- Cross-border B2B multi-cooperative software contracts (USD 25,000 to USD 90,000 across Argentina and Uruguay) currently settle in Polygon USDC or Tron USDT via CNV-registered PSAVs using manual spreadsheet reconciliation.
- Acute multi-party gap: partner cooperatives lack neutral programmable milestone escrow and unified cross-border ARCA tax audit logs across independent studios.

2. Regulatory & Compliance Findings (Gate 4 - LC-01 & LC-02):
- Executive Decree DNU 70/2023 (Arts. 765-766 CCyC) provides High Certainty legal validity for B2B contracts settled in foreign currency or virtual assets.
- CNV General Resolution 1058/2025 governs PSAV settlement and custody; ARCA tax compliance requires deterministic invoice-to-payout references.

3. Infrastructure Readiness & Falsification Test (Gates 5, 6, 7 & 8):
- Local Off-Ramp & PSAV Integration: Rated Partially Met / Dependent on onboarding at least one CNV-registered PSAV to support native Cardano USDCx/USDM off-ramping without double bridging to Tron/Polygon (routed to RFP 01 / RFP 03).
- Hypothesis H6 Status: Confirmed for B2B multi-cooperative USD escrow (respondent willing to pilot a USD 25,000 contract conditional on direct PSAV off-ramp support).
- Provisional CASS Tier: Tier 3 (Concrete pilot appetite from budget owner; pending PSAV off-ramp integration).
```
