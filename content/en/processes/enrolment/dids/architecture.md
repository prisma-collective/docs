---
sidebarTitle: Architecture
---
# Prisma DIDs – Technical Design v1.6.2

## Cardano-Native DIDs & Verifiable Contributions

**Version:** 1.6.2
**Date:** December 17th 2025
**Authors:** Prisma Team
**Status:** Production-Ready MVP Specification with Forkable Indexer Architecture

---

## 0. Executive Summary

Prisma DIDs provides a **Cardano-native identity and verifiable contributions layer** using:

* A W3C-compliant **DID method** (`did:cardano`),
* **Verifiable Credentials (VCs)** to represent contributions,
* **SD-JWT selective disclosure** for privacy-preserving credential sharing,
* **CIP-20-style metadata + CIP-10 labels** as a DID & VC anchor registry,
* A **DID Dashboard** + **DID Indexer** (global infrastructure) for identity management,
* A **VC Interface** + **VC Indexer** (forkable per organization) for credential operations,
* A clear **roadmap to ZK / BBS+** and an optional **Plutus v2** for on-chain enforcement.

### What's New in v1.6

* **Forkable Indexer Architecture (§1.4):** VC Indexer is now forkable per organization, parallel to the VC Interface
* **Global vs Forkable Separation (§1.1):** Clear distinction between ecosystem-wide infrastructure (DID) and organization-specific components (VC)
* **Configurable Metadata Labels (§1.4.2):** Each organization can register and index their own CIP-10 labels
* **Shared Schemas Package (§1.5):** Monorepo structure with shared credential schemas between VC Interface and VC Indexer
* **Verifier Discovery (§2.2):** DID Document `service` field now includes `VCIndexer` endpoint for credential status lookups

### What's New in v1.5

* **DID/VC Interface Separation (§1.3):** DID Dashboard as universal Cardano infrastructure; VC Interface as forkable/parametrized module
* **Forkable Architecture:** VC layer designed for organization-specific deployments (ALJ, Prisma, etc.)

### What's New in v1.4

* **SD-JWT Integration (§5.3):** Cryptographic selective disclosure for VCs using industry-standard SD-JWT format
* **VC Revocation (§6.4):** On-chain revocation events for credential lifecycle management
* **VC Format Indicator (§6.1):** Future-proof anchoring schema supporting multiple VC formats
* **Privacy Roadmap Update (§11.4):** Clear progression from SD-JWT → BBS+ → advanced ZK
* **Design Rationale (Appendix A):** Documentation of Hyperledger Identus and KERI evaluation

The MVP is designed to:

* Be fully deliverable within the Catalyst 6-month period,
* Match the Catalyst F14 proposal claims (DID creation, VC issuance, DID Dashboard + VC Interface, VC anchoring),
* Stay compatible with future NFC + ZK upgrades,
* Enable organizations to run their own VC infrastructure independently.

---

## 1. Architecture Overview

### 1.1 Components

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Cardano Blockchain                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Tx Metadata (CIP-20-style)                                           │  │
│  │  - DID events under L_DID (199674) - Global                           │  │
│  │  - VC events under L_VC (199675) - Prisma/ALJ                         │  │
│  │  - VC events under L_ORG (custom) - Other organizations               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                            IPFS Storage                                     │
│  - DID Documents (JSON-LD)                                                  │
│  - Optional VC payloads (encrypted)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GLOBAL INFRASTRUCTURE (Prisma)                          │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   DID Dashboard (Universal)  │  │   DID Indexer                       │  │
│  │   ─────────────────────────  │  │   ─────────────────────────────────│  │
│  │   - CIP-30 wallet connect    │  │   - Indexes L_DID (199674) globally │  │
│  │   - DID create/update/revoke │  │   - Validates DID chains & sigs     │  │
│  │   - DID Document viewer      │  │   - Source of truth for all DIDs    │  │
│  │   - Universal Cardano usage  │  │   - REST API for DID resolution     │  │
│  │                              │  │                                     │  │
│  │   [Ecosystem Infrastructure] │  │   [Ecosystem Infrastructure]        │  │
│  └─────────────────────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Prisma SDK (TS)                                │
│  - Create / update / revoke / resolve DID                                   │
│  - Issue / verify VCs (Ed25519 & SD-JWT)                                    │
│  - Anchor VC issuance/validation/revocation                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FORKABLE PER ORGANIZATION                               │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   VC Interface (Forkable)    │  │   VC Indexer (Forkable)             │  │
│  │   ─────────────────────────  │  │   ─────────────────────────────────│  │
│  │   - Parametrized per org     │  │   - Configurable metadata labels    │  │
│  │   - VC issuance forms        │  │   - Custom credential schemas       │  │
│  │   - Credential inbox         │  │   - Org-specific VC event indexing  │  │
│  │   - Selective disclosure     │  │   - REST API for VC status          │  │
│  │   - Organization branding    │  │   - Shared schema with VC Interface │  │
│  │                              │  │                                     │  │
│  │   [ALJ | Prisma | Custom]    │  │   [ALJ | Prisma | Custom]           │  │
│  └─────────────────────────────┘  └─────────────────────────────────────┘  │
│                         ↖─── Shared schemas package ───↗                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **Design Philosophy:** DIDs are ecosystem-wide identity infrastructure—one global indexer serves all Cardano users. VCs are organization-specific—each organization defines their credential types, schemas, and runs their own indexer. This separation enables decentralized credential ecosystems while maintaining a unified identity layer.

### 1.2 Technology Stack

* **Cardano**: base ledger & metadata registry
* **Metadata**: CIP-20-style JSON under **CIP-10 labels**
* **Wallets**: CIP-30 dApp connectors (Lace, Eternl, Nami, etc.)
* **Storage**: IPFS (e.g. Pinata)
* **Backend**: Node.js + TypeScript (Indexers & APIs)
* **SDK**: TypeScript client library
* **Frontend**: React / Next.js dashboard
* **Standards**: W3C DID Core, W3C VC Data Model, IETF SD-JWT
* **Canonicalization**: JSON Canonicalization Scheme (RFC 8785 / `json-canonicalize`)
* **Package Management**: Monorepo with shared schemas (see §1.5)

### 1.3 Frontend Architecture: DID Dashboard & VC Interface

The frontend layer is split into two distinct interfaces:

#### DID Dashboard (Universal)

A **general-purpose DID management interface** for any Cardano user:

* **Purpose:** Create, view, update, and revoke `did:cardano` identities
* **Target Users:** Any Cardano wallet holder
* **Scope:** DID-only operations, no VC-specific features
* **Deployment:** Single canonical instance (prisma-dids.io or similar)
* **Branding:** Neutral Cardano identity branding

The DID Dashboard is infrastructure—like a wallet or block explorer, it serves the entire ecosystem.

#### VC Interface (Forkable/Parametrized)

A **customizable credential interface** designed to be forked or parametrized per organization:

* **Purpose:** Issue, receive, present, and verify Verifiable Credentials
* **Target Users:** Organization members (e.g., ALJ contributors, Prisma team)
* **Scope:** Full VC lifecycle with organization-specific credential types
* **Deployment:** Multiple instances (one per organization or use case)
* **Branding:** Customizable per deployment (logo, colors, credential types)

> **Prisma Pilot: Action Learning Journey (ALJ)**
>
> ALJ is Prisma's first production deployment of the VC Interface. ALJ issues `ContributionCredential` VCs to track learning contributions. This pilot validates the parametrization model before broader adoption.

**Parametrization Options:**

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| `ORG_NAME` | Organization display name | "Action Learning Journey", "Prisma" |
| `ORG_LOGO` | Logo asset path (optional) | `/assets/alj-logo.svg` |
| `CREDENTIAL_TYPES` | Allowed credential types | `["ContributionCredential"]` |
| `ISSUER_DIDS` | Authorized issuer DIDs | `["did:cardano:stake1u9..."]` |
| `THEME` | UI color scheme | `{ primary: "#4F46E5" }` |
| `INDEXER_ENDPOINT` | VC Indexer URL | `"https://indexer.alj.example.com"` |
| `DID_INDEXER_ENDPOINT` | Global DID Indexer URL | `"https://did-indexer.prisma-dids.io"` |
| `NETWORK` | Cardano network | `"preprod"` or `"mainnet"` |

### 1.4 Indexer Architecture: DID Indexer & VC Indexer

The indexer layer is split to match the frontend separation:

#### DID Indexer (Global)

A **single ecosystem-wide indexer** for all `did:cardano` identities:

* **Purpose:** Index and validate all DID lifecycle events
* **Scope:** L_DID (199674) metadata label only
* **Operator:** Prisma (ecosystem infrastructure)
* **Deployment:** Single canonical instance
* **API:** DID resolution and history endpoints

The DID Indexer is the authoritative source for `did:cardano` resolution.

#### VC Indexer (Forkable/Configurable)

A **customizable indexer** designed to be forked or configured per organization:

* **Purpose:** Index organization-specific VC events (issuance, validation, revocation)
* **Scope:** Configurable metadata labels and schemas
* **Operator:** Each organization runs their own
* **Deployment:** Multiple instances (one per organization)
* **API:** VC status, revocation checks, credential listings

**Why Forkable VC Indexer?**

1. **Decentralization:** Organizations own their credential infrastructure
2. **Custom Schemas:** Each org defines their credential types and validation rules
3. **Scalability:** No single bottleneck for all VC events
4. **Privacy:** Org-specific credentials stay within org infrastructure
5. **Independence:** Orgs can operate without relying on Prisma

#### 1.4.1 VC Indexer Configuration

Each VC Indexer instance is configured with:

```typescript
// indexer.config.ts
export interface IndexerConfig {
  // Metadata labels to index
  labels: {
    [labelNumber: number]: {
      name: string;
      schema: VCEventPayloadSchema;
    };
  };

  // Database connection
  database: DatabaseConfig;

  // Cardano provider
  cardanoProvider: 'blockfrost' | 'koios';

  // Optional: DID Indexer endpoint for DID resolution
  didIndexerEndpoint?: string;
}

// Prisma/ALJ configuration
export const prismaConfig: IndexerConfig = {
  labels: {
    199674: {
      name: 'L_DID',
      schema: DIDEventPayloadSchema,  // Also index DIDs (optional)
    },
    199675: {
      name: 'L_VC',
      schema: VCEventPayloadSchema,
    },
  },
  database: { /* ... */ },
  cardanoProvider: 'blockfrost',
  didIndexerEndpoint: 'https://did.prisma-dids.io',
};

// Example: Another organization's configuration
export const customOrgConfig: IndexerConfig = {
  labels: {
    199674: {
      name: 'L_DID',
      schema: DIDEventPayloadSchema,  // Still index global DIDs
    },
    888888: {
      name: 'L_ORG_CERTS',
      schema: OrgCertificationSchema,  // Custom credential schema
    },
  },
  database: { /* ... */ },
  cardanoProvider: 'koios',
  didIndexerEndpoint: 'https://did.prisma-dids.io',
};
```

#### 1.4.2 Custom Metadata Labels

Organizations wanting custom VC types should:

1. **Register a CIP-10 label** for their VC events (e.g., `L_ORG = 888888`)
2. **Define their schema** compatible with the base `VCEventPayload` structure
3. **Configure their indexer** to watch their label
4. **Update issuer DID Documents** with their VC Indexer service endpoint

**Label Allocation:**

| Label | Purpose | Operator |
|-------|---------|----------|
| 199674 | DID events (global) | Prisma |
| 199675 | VC events (Prisma/ALJ) | Prisma |
| Custom | VC events (other orgs) | Organization |

### 1.5 Monorepo Structure

The codebase is organized as a monorepo with clear separation between **packages** (imported as dependencies) and **apps** (deployed as services):

```
prisma-dids/
├── packages/                 # IMPORTED as dependencies
│   ├── schemas/              # Shared source of truth
│   │   ├── events/
│   │   │   ├── did-event.ts      # DIDEventPayload
│   │   │   └── vc-event.ts       # VCEventPayload
│   │   └── credentials/
│   │       ├── base.ts           # Base credential fields
│   │       └── contribution.ts   # ContributionCredential
│   │
│   ├── sdk/                  # Core SDK (DID + VC operations)
│   │   ├── did/                  # DID operations
│   │   ├── vc/                   # VC operations (Ed25519, SD-JWT)
│   │   └── anchor/               # Anchoring operations
│   │
│   └── types/                # Shared TypeScript types
│
└── apps/                     # DEPLOYED as services
    ├── did-dashboard/        # Universal DID Dashboard (global, Prisma-operated)
    │   ├── components/
    │   └── pages/
    │
    ├── did-indexer/          # Global DID Indexer (Prisma-operated)
    │   ├── sync/                 # L_DID chain synchronization
    │   ├── api/                  # REST API (/did/:did, /did/:did/history)
    │   └── db/                   # did_events table
    │
    ├── vc-interface/         # Forkable VC Frontend (per-organization)
    │   ├── components/           # UI components
    │   ├── config/               # Org parametrization
    │   └── pages/                # Issuance, inbox, verification
    │
    └── vc-indexer/           # Forkable VC Backend (per-organization)
        ├── config/               # Label & schema configuration
        ├── sync/                 # Chain synchronization
        ├── db/                   # Database operations
        └── api/                  # REST API endpoints
```

> **Design Rationale:** The distinction is based on **how components are used**, not whether they're forkable:
> - **Packages** (`packages/`) are **imported** via `npm install @prisma-events/dids-sdk`
> - **Apps** (`apps/`) are **deployed** via `git clone` → configure → `vercel deploy`
>
> Both VC Interface and VC Indexer are forkable (organizations clone and customize), but they're deployed as standalone services, not imported as libraries.

**Forking Workflow:**

1. Fork the `prisma-dids` monorepo
2. Modify `packages/schemas/credentials/` with your credential types
3. Update `apps/vc-indexer/config/` with your metadata label
4. Update `apps/vc-interface/config/` with your branding
5. Deploy your VC Indexer and VC Interface
6. Register your VC Indexer in your issuer DID Documents

All apps import from `@prisma-events/dids-schemas` and `@prisma-events/dids-sdk`, ensuring they stay synchronized.

---

## 2. DID Method: `did:cardano`

### 2.1 Identifier Format

**Method name:** `cardano`

```text
did:cardano:<id>
```

Where `<id>` is derived from the **stake key** (reward address) of a CIP-30 wallet, so identities:

* Are **persistent** across payment addresses,
* Are **not** tied to a single spending address,
* Can be verified from chain-level stake key data.

Example:

```text
did:cardano:stake1u9rqg7a3skqzx8jxzvm9k2w3c5k6h7j8l9m0n1p2q3r4s5
```

**Network Assumptions:**

Unless otherwise specified, examples in this document assume **Cardano mainnet** (networkId = 1). On testnet/preprod, the DID derivation and stake address format are identical; only the bech32 prefix differs (e.g., `stake_test1...` on testnet vs `stake1...` on mainnet). The same DID method works across all Cardano networks.

### 2.1.1 DID Derivation Specification

We define a deterministic derivation from a CIP-30 wallet to `did:cardano`:

**Inputs:**

* CIP-30 wallet (e.g. Nami, Eternl),
* `rewardAddresses = await wallet.getRewardAddresses()`
  (array of Bech32 stake addresses, use `rewardAddresses[0]`).

**Algorithm:**

1. Obtain primary reward address:

   ```ts
   const rewardAddresses = await wallet.getRewardAddresses();
   const rewardAddress = rewardAddresses[0]; // e.g. "stake1u9..."
   ```

2. Define the DID identifier as **exactly** that Bech32 stake address:

   ```ts
   const didIdentifier = rewardAddress; // "stake1u9..."
   ```

3. Construct DID:

   ```ts
   const did = `did:cardano:${didIdentifier}`;
   ```

**Example:**

* Reward address:
  `stake1u9rqg7a3skqzx8jxzvm9k2w3c5k6h7j8l9m0n1p2q3r4s5`
* DID:
  `did:cardano:stake1u9rqg7a3skqzx8jxzvm9k2w3c5k6h7j8l9m0n1p2q3r4s5`

**Controller key:**

* The DID controller is the **stake key** that controls this reward address.
* In verification, we ensure signatures come from a key that corresponds to this stake key.

---

### 2.2 DID Document (IPFS)

DID Documents follow W3C DID Core and are stored in IPFS.

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:cardano:stake1u9rqg7a3skqzx8jxzvm9k2w3c5k6h7j8l9m0n1p2q3r4s5",
  "verificationMethod": [
    {
      "id": "did:cardano:stake1u9...#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:cardano:stake1u9...",
      "publicKeyMultibase": "z6Mkf..."
    }
  ],
  "authentication": [
    "did:cardano:stake1u9...#key-1"
  ],
  "service": [
    {
      "id": "did:cardano:stake1u9...#vc-indexer",
      "type": "VCIndexer",
      "serviceEndpoint": "https://indexer.alj.example.com"
    }
  ]
}
```

**Service Endpoints:**

| Service Type | Purpose | Example |
|--------------|---------|---------|
| `VCIndexer` | VC status/revocation lookups | `https://indexer.alj.example.com` |
| `LinkedDomains` | Domain verification (future) | `https://alj.example.com` |

The `VCIndexer` service enables **verifier discovery**: when verifying a credential, the verifier can resolve the issuer's DID Document to find which indexer to query for revocation status.

**Verifier Discovery Flow:**

1. Verifier receives credential from holder
2. Extract `issuerDid` from credential
3. Resolve issuer's DID Document (via global DID Indexer)
4. Find `service` with `type: "VCIndexer"`
5. Query that indexer's `/vc/:vcHash/status` endpoint

Future BBS+ keys can be added as additional `verificationMethod` entries (see §11.4).

---

## 3. DID Registry via CIP-20-Style Metadata

### 3.1 Labels

Prisma uses dedicated **CIP-10 metadata labels**:

* `L_DID = 199674` – DID events (create/update/revoke) - **Global**
* `L_VC  = 199675` – VC events (Prisma/ALJ) - **Prisma-operated**

Organizations can register additional labels for their VC events.

These are **CIP-20-style** uses: structured JSON attached under specific labels.

### 3.1.1 CIP-10 Label Registration Process

**Prisma Labels (registered):**

* **Label 199674** – `PrismaDIDs`
  * Description: DID create/update/revoke events for `did:cardano` method.
  * Schema: §3.2.
  * Operator: Prisma (global infrastructure)

* **Label 199675** – `PrismaVCAnchors`
  * Description: VC issuance, validation, and revocation events.
  * Schema: §6.1.
  * Operator: Prisma (for ALJ and Prisma credentials)

**Custom Organization Labels:**

Organizations deploying their own VC Indexer should:

1. Choose an unregistered CIP-10 label number
2. Submit PR to CIP-10 registry with:
   * Label number
   * Organization name
   * Schema reference (compatible with `VCEventPayload`)
3. Configure their VC Indexer to watch this label

---

### 3.2 DID Event JSON Schema (Label `L_DID`)

Each DID operation is a JSON object under label `L_DID`:

```json
{
  "id": "did:cardano:stake1u9...",
  "ipfs": "QmHashOfDIDDocument",
  "action": "create" | "update" | "revoke",
  "v": 1,
  "prev": null,
  "payloadSig": "{\"sig\":\"...\",\"key\":\"...\",\"address\":\"...\"}",
  "ts": "2025-01-01T12:00:00Z"
}
```

Fields:

* `id` – DID.
* `ipfs` – CID of DID Document for this version.
* `action` – `"create"`, `"update"`, or `"revoke"`.
* `v` – version number (1, 2, 3…).
* `prev` – previous tx hash for this DID (null for create).
* `payloadSig` – serialized CIP-30 signature (spec below).
* `ts` – timestamp (ISO 8601; logical convenience only).

**Optional Fields (Forward Compatibility):**

Resolvers SHOULD ignore unknown fields in DID events for forward compatibility. Early implementations MAY include additional fields (e.g., `ts` for client-side timestamp convenience). These fields are not validated and do not affect event processing.

---

## 7. Indexer Services

### 7.1 DID Indexer (Global)

The DID Indexer is the authoritative source for `did:cardano` resolution.

#### 7.1.1 Database Schema

**`did_events` table:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `did` | VARCHAR | The DID identifier |
| `tx_hash` | VARCHAR | Cardano transaction hash |
| `action` | ENUM | create, update, revoke |
| `version` | INT | Version number |
| `prev_tx_hash` | VARCHAR | Previous transaction hash |
| `ipfs_cid` | VARCHAR | IPFS CID of DID Document |
| `valid` | BOOLEAN | Validation status |
| `block_height` | INT | Block number |
| `timestamp` | TIMESTAMP | Event timestamp |

#### 7.1.2 API Endpoints

**DID Resolution:**

* `GET /did/:did` → Latest valid DID Document + metadata
* `GET /did/:did/history` → Full valid event chain
* `GET /health` → Indexer health and sync status

### 7.2 VC Indexer (Forkable)

Each organization runs their own VC Indexer configured for their metadata labels.

#### 7.2.1 Database Schema

**`vc_events` table:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `tx_hash` | VARCHAR | Cardano transaction hash |
| `event` | ENUM | issue, validate, revoke |
| `issuer_did` | VARCHAR | Issuer DID |
| `holder_did` | VARCHAR | Holder DID (nullable for revoke) |
| `validator_did` | VARCHAR | Validator DID (for validate events) |
| `vc_hash` | VARCHAR | Credential identifier (jti for SD-JWT) |
| `vc_type` | VARCHAR | Credential type |
| `vc_format` | VARCHAR | Format: ed25519, sd-jwt, bbs+ |
| `reason` | VARCHAR | Revocation reason (nullable) |
| `block_height` | INT | Block number |
| `timestamp` | TIMESTAMP | Event timestamp |

#### 7.2.2 API Endpoints

**VC Status:**

* `GET /vc/:vcHash` → VC anchor events (issue, validate, revoke)
* `GET /vc/:vcHash/status` → Current status (active/revoked)
* `GET /issuer/:did/credentials` → All VCs issued by DID
* `GET /holder/:did/credentials` → All VCs held by DID
* `GET /schemas` → Supported credential schemas
* `GET /health` → Indexer health and sync status

#### 7.2.3 Configuration

```typescript
// apps/vc-indexer/config/index.ts
import { DIDEventPayloadSchema, VCEventPayloadSchema } from '@prisma-events/dids-schemas';

export const indexerConfig = {
  // Labels to index
  labels: {
    199674: {
      name: 'L_DID',
      schema: DIDEventPayloadSchema,
    },
    199675: {
      name: 'L_VC',
      schema: VCEventPayloadSchema,
    },
  },

  // Cardano provider
  provider: {
    type: 'blockfrost',
    projectId: process.env.BLOCKFROST_PROJECT_ID,
    network: 'mainnet',
  },

  // Global DID Indexer (for DID resolution during verification)
  didIndexer: 'https://did.prisma-dids.io',

  // Database
  database: {
    connectionString: process.env.DATABASE_URL,
  },
};
```

---

## 8. Security Considerations

### 8.1 Integrity & Authenticity

* **DID events:** verified via Ed25519 signatures from payment keys whose stake credential matches the DID's stake address (see §3.3.2).
* **VCs (Ed25519):** verified via Ed25519 signatures from issuer DIDs.
* **VCs (SD-JWT):** verified via EdDSA signatures embedded in JWT.
* **VC anchors:** rely on VC signatures + canonical hashes.

### 8.2 Availability

* DID docs and optional VCs pinned in IPFS.
* DID Indexer can recompute state from chain + IPFS.
* VC Indexers are independently operated; org controls their availability.

### 8.3 Indexer Trust Model

**DID Indexer (Global):**
* Operated by Prisma as ecosystem infrastructure
* Verifiable: anyone can run their own DID Indexer and compare results
* Single source of truth for DID resolution

**VC Indexer (Per-Org):**
* Operated by each organization
* Trust model: verifiers trust the issuer's designated indexer
* Discovery via DID Document `service` field
* Organizations are responsible for their indexer availability

### 8.4 Threats & Mitigations

| Threat | Mitigation |
|--------|------------|
| Impersonation | Signature verification + stake address binding |
| Forged VCs | Issuer DID resolution + signature verification |
| Replay attacks | Version chaining (`prev` field) for DIDs |
| VC tampering | Hash verification against `vcHash` |
| Metadata spam | Indexers filter invalid signatures |
| Rogue VC Indexer | Verifiers check issuer's DID Document for authoritative indexer |

---

## 12. Catalyst F14 Alignment (Quick Map)

* **Prototype:**

  * DID creation via wallet (CIP-30) + metadata (CIP-20 style)
  * W3C VCs with cryptographic proofs (Ed25519 + JCS)
  * SD-JWT selective disclosure
  * DID Dashboard (universal) + VC Interface (forkable) with selective disclosure controls
  * Forkable VC Indexer architecture
  * Testnet deployment + ALJ pilot usage

* **Final version (post-MVP):**

  * NFC validation (roadmap in §11.2)
  * ZK proofs (BBS+ plan in §11.4)

* **Metrics:**

  * DIDs created, VCs issued, validation txs (via `L_VC`)

---

## Appendix C: Changelog

### v1.6.2 (December 2025)

**Clarifications:**

* §1.5: Clarified distinction between **packages** (imported as dependencies) and **apps** (deployed as services)
* §1.5: Moved `vc-interface/` and `vc-indexer/` from `packages/` to `apps/` - forkable components are deployed, not imported
* §1.5: Added design rationale explaining the apps vs packages decision
* §7.2.3: Updated config path from `packages/indexer/` to `apps/vc-indexer/`

> **Breaking Change:** Monorepo structure now places forkable components in `apps/` instead of `packages/`. This aligns with how organizations will actually use the code (clone and deploy, not import as dependency).

### v1.6 (December 2025)

**New Features:**

* §1.1: Updated architecture diagram with Global vs Forkable separation
* §1.4: New section - Indexer Architecture (DID Indexer + VC Indexer)
* §1.4.1: VC Indexer configuration specification
* §1.4.2: Custom metadata labels for organizations
* §1.5: Monorepo structure with shared schemas package
* §2.2: VCIndexer service endpoint in DID Documents
* §7: Reorganized as Indexer Services (DID + VC)
* §8.3: Indexer trust model

**Changes:**

* §1.1: Components diagram now shows forkable VC Indexer
* §1.3: Renamed to "Frontend Architecture" (indexer split to §1.4)
* §3.1: Labels section clarifies global vs org-specific

**No Changes:**

* §2.1: DID Method (unchanged)
* §3.2: DID Event Schema (unchanged)
* §5: Verifiable Credentials (unchanged)
* §6: VC Anchoring (unchanged)

### v1.5 (December 2025)

* DID/VC Interface Separation
* Forkable VC Interface architecture

### v1.4 (December 2025)

* SD-JWT Integration
* VC Revocation events
* VC Format Indicator
* Privacy Roadmap Update
* Design Rationale (Appendix A)

### v1.3.1 (November 2025)

* Initial production-ready specification
* DID method, registry, operations
* Basic VC format with Ed25519
* BBS+ roadmap

---

**END – Prisma DIDs Technical Design v1.6.2**
