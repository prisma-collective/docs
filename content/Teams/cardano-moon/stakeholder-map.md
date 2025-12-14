---
title: Stakeholder Map
---

# 🗺️ Stakeholder Map — Cardano Moon (MEDBLOCK)

**MEDBLOCK Project Ecosystem**

This stakeholder map describes the primary actors within Nigeria's healthcare ecosystem and their relationship to the MEDBLOCK national EMR and blockchain platform.

---

## 1. Caretakers
*High Operational Influence*

Caretakers include **doctors, nurses, clinicians, and telemedicine providers**, who directly interact with patient data on a daily basis. They are frontline operators of MEDBLOCK and depend on accurate data access for clinical decision-making.

### Role & Influence:

- Access, edit, and upload FHIR-compliant electronic records through dashboard
- Depend on consent layer, requesting authorization from patients
- Daily interaction positions them as core drivers of system adoption
- Their usage legitimizes MEDBLOCK and drives patient trust

### Challenges & Pain Points:

- Fragmented data leads to misdiagnosis and treatment delays
- Technical literacy varies greatly across institutions
- Key management, authentication, and secure data handling create new responsibilities
- Fear of workflow disruption during transition

### Opportunities:

- **Reduced repeated diagnostics** due to instant historical access
- Sequential workflows become **faster and more reliable**
- **Mobile-first telemedicine integration** enhances rural outreach
- Complete patient histories improve clinical decision-making

### Power Dynamics:

Medium-high influence. Without caretaker adoption, institutional buy-in struggles. Their endorsement drives patient trust.

---

## 2. Institutions & Local Actors
*Highest Structural Influence*

This group includes **hospitals, clinics, diagnostic labs, HMOs, insurance providers, and State Ministries of Health**. They represent the backbone of healthcare delivery and infrastructure.

### Role & Influence:

- **Hospitals/Clinics:** Upload bulk records to off-chain storage, anchor hashes on-chain
- **Labs:** Push test results tied to patient IDs
- **HMOs:** Rely on smart contracts to automate claims and fight fraud
- **State Health Actors:** Support scaling, compliance, ecosystem coordination

### Challenges & Pain Points:

- **Legacy infrastructure** and low interoperability across facilities
- **Significant financial loss** due to fraudulent insurance claims (billions annually)
- High pressure to meet **regulatory standards** (NDPR, NHIA)
- Many institutions lack reliable infrastructure (downtime risks)

### Opportunities:

- **Huge cost savings** through automated, transparent claims
- Establishment of a **national EMR standard**
- Centralized performance dashboards enable more effective oversight
- **Fraud reduction** through blockchain verification
- Enhanced institutional reputation through transparency

### Power Dynamics:

**Very high influence.** Successful adoption, nationwide scaling, and policy alignment depend primarily on institutional involvement.

---

## 3. Emerging Leaders
*Innovation Drivers*

Emerging leaders include **telemedicine startups, international donors (World Bank, Global Fund), and AI/HealthTech integrators**.

### Role & Influence:

- Pioneer **mobile-first access**
- Fund initial pilots
- Support public-sector modernization
- Build high-level features: analytics, AI decision support, future multi-country interoperability

### Challenges & Pain Points:

- Interoperability with fragmented existing systems
- Regulatory uncertainty around patient-owned data models
- Need for secure, low-bandwidth, mobile-first architecture to achieve scale

### Opportunities:

- **AI-driven insights** that improve diagnostics and triage
- **Cross-border portability** across African regions
- **Partnerships with government** accelerate expansion and legitimacy
- Integration with wearables and IoT medical devices

### Power Dynamics:

Influence is **rapidly growing**, especially as donors drive funding and telemedicine becomes a major healthcare channel.

---

## 4. Groups Affected by the Challenge
*Core Beneficiaries*

This category includes **patients, the general public, and national health agencies** such as NHIA, NPHCDA, and Federal/State Ministries of Health.

### Patients & General Public:

**Role:**
- Own their data via private keys
- Control access permissions through consent layer
- Benefit from complete, portable medical histories

**Challenges:**
- Preventable mortality due to inaccessible or lost medical histories
- Repetitive diagnostics increase costs and delay treatment
- Lack of trust in healthcare institutions
- Rural and underserved communities face worst data inequality

**Opportunities:**
- **Consent-based access** gives patients control and restores trust
- **Complete medical history** accessible via mobile app
- **No more repeated tests** from lost records
- **Reduced misdiagnoses** from complete data

### Government Agencies (NHIA, NPHCDA, Ministries):

**Role:**
- Use anonymized analytics dashboards
- Track outbreaks and plan interventions
- Evidence-based policy making

**Challenges:**
- Lack accurate national data to make informed public health decisions
- Slow epidemic response due to fragmented information
- Cannot verify healthcare spending effectiveness

**Opportunities:**
- **Dashboards enable rapid responses** to epidemics
- **Real-time disease surveillance**
- **Transparent record flows** reduce billing fraud
- **Evidence-based resource allocation**

### Power Dynamics:

Influence ranges widely:
- **Patients wield veto power** via access control
- **Agencies hold regulatory power** and can enforce nationwide requirements

---

## Ecosystem Dynamics

### Interconnections:

- **Patients → Caretakers:** Provide or revoke access using consent smart contracts
- **Institutions → Blockchain Layer:** Anchor records for integrity and auditability
- **HMOs → Hospitals & Labs:** Smart contract-based claims reduce fraud and processing delays
- **Government Agencies → Ecosystem:** Use analytics to shape national policy, allocate resources, monitor trends

### Prioritization Across Phases:

**MVP / Phase 2:**  
Core medical facilities (hospitals, clinics) and patients

**Scaling / Phase 3-4:**  
HMOs, labs, telemedicine, and institutional integrations

**Regional Expansion:**  
Donors and cross-border health partners

---

## Risk & Mitigation Considerations

**Adoption Risk:**  
Reduced with financial incentives, technical support, and institutional onboarding programs

**Key Loss Risk:**  
Handled with social recovery, guardians, and backup protocols

**Interoperability Risk:**  
Addressed through strict FHIR compliance and unified APIs
