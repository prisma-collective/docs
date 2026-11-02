---
sidebarTitle: 'ADR: CIP-68 vs Metadata'
---
# Prisma DIDs – Architecture Decision: CIP-68 Smart Contracts vs Metadata + Resolver

**Date:** November 16, 2025  
**Version:** 1.0  
**Status:** Decision Analysis

---

## Executive Summary

During the design phase of Prisma DIDs, we evaluated two fundamentally different approaches:

1. **Initial Approach:** CIP-68 NFT-based smart contracts with on-chain state
2. **Final Approach:** CIP-20-style metadata with off-chain resolver

**Note:** We developed comprehensive design proposals for the CIP-68 approach (Documento 4: Smart Contract Design, Documento 5: Implementation Architecture), which demonstrate the feasibility and complexity of that path. These design documents remain valuable as reference for a potential v2 upgrade. For the MVP, we chose the metadata approach for cost and speed advantages.

The metadata + resolver approach is fully specified in the [Technical Specification](/processes/enrolment/dids/technical-specification) (v1.6.2), which defines the `did:cardano` method, VC schema, signature verification, anchoring mechanisms, and upgrade paths.

This document compares both approaches and explains why the metadata-based design is superior for the Catalyst MVP timeline and budget.

---

## Approach 1: CIP-68 NFT Smart Contract Design (Proposal)

> **Note:** Prisma developed detailed design proposals for this approach:
> - **Documento 4:** Smart contract design specification (~764 lines of conceptual Aiken code)
> - **Documento 5:** Architectural documentation with proposed implementation patterns
> 
> These documents demonstrate thorough evaluation of the CIP-68 approach and provide a detailed roadmap if we pursue L1 enforcement in v2. The design work validates feasibility but **the smart contracts have not been implemented or deployed**. For the MVP, we use this design work as reference rather than proceeding with implementation.

### Architecture

**Smart Contracts (Aiken):**
- `did_registry.ak` - Main validator for DID operations
- `did_nft_policy.ak` - CIP-68 minting policy
- `vc_issuer.ak` - Verifiable Credential issuance (planned)

**On-Chain State:**
- CIP-68 Reference NFT (100) per DID
- CIP-68 User Token (222) per DID
- DID Document stored in inline datum
- UTxO-based state management

**Operations:**
```aiken
type DIDRedeemer {
  Register { initial_public_key_hash, initial_ipfs_cid }
  Update { new_public_key_hash, new_ipfs_cid }
  Revoke
  Suspend
  Reactivate
}
```

### Cost Analysis

| Operation | ADA Cost | Components |
|-----------|----------|------------|
| **Create DID** | 5-8 ADA | Mint 2 NFTs + script execution + UTxO min ADA |
| **Update DID** | 3-5 ADA | Consume UTxO + validator + re-mint + new UTxO |
| **Revoke DID** | 4-6 ADA | Burn NFTs + final state change + validator |
| **VC Anchor** | 3-5 ADA | Similar to Update operation |

**Total for 1,000 DIDs:** 5,000-8,000 ADA (~$2,000-3,200 USD)

> **Note on Cost Estimates:** Detailed Aiken documentation (Documento 5) shows optimistic per-transaction costs of ~0.5-0.6 ADA under ideal conditions. The estimates above use conservative upper bounds (5-8 ADA) to account for:
> - Real-world script sizes and execution costs
> - Network congestion and fee volatility
> - Non-ideal batching scenarios
> - UTxO minimum ADA requirements
> - Buffer for future protocol parameter changes
> 
> This conservative approach prevents under-budgeting for pilot deployments.

### Complexity Metrics

- **Aiken Code:** ~764 lines across 3 files
- **Architecture Layers:** 4 (Blockchain → Backend → Frontend → Storage)
- **Dependencies:**
  - Aiken compiler + testing framework
  - NFT minting infrastructure
  - IPFS (Pinata)
  - PostgreSQL for indexing
  - Lucid-Cardano for tx building
  - Mesh SDK for wallet integration

- **Development Time:** 4-6 months
  - Smart contract development: 6-8 weeks
  - Testing & auditing: 4-6 weeks
  - Backend integration: 4-6 weeks
  - Frontend development: 4-6 weeks
  - Testnet validation: 2-4 weeks

### Pros

✅ **L1 Enforcement:** Cardano blockchain enforces all rules  
✅ **NFT Standards:** Follows CIP-68 for metadata  
✅ **Composability:** Other contracts can consume DID state  
✅ **Truly Decentralized:** No off-chain dependencies for validation  

### Cons

❌ **High Cost:** 30-47x more expensive than metadata approach  
❌ **Slow Development:** 4-6 months to production-ready contracts  
❌ **Audit Required:** Smart contracts need security review  
❌ **Inflexible:** Hard to upgrade without migration  
❌ **Complex Testing:** Requires comprehensive validator testing  
❌ **UTxO Contention:** Potential issues at scale  

---

## Approach 2: Final Design (Metadata + Resolver)

### Architecture

**No Smart Contracts for v1:**
- CIP-20-style metadata under dedicated CIP-10 labels
- Label `199674` - DID events (create/update/revoke)
- Label `199675` - VC anchors/validations

**Off-Chain Resolver:**
- Indexes all metadata with Prisma labels
- Validates Ed25519 signatures
- Builds version chains
- Enforces business logic

**Operations:**
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

### Cost Analysis

| Operation | ADA Cost | Components |
|-----------|----------|------------|
| **Create DID** | ~0.17 ADA | Metadata tx only |
| **Update DID** | ~0.17 ADA | Metadata tx only |
| **Revoke DID** | ~0.17 ADA | Metadata tx only |
| **VC Anchor** | ~0.17 ADA | Metadata tx only (optional) |

**Total for 1,000 DIDs:** 170 ADA (~$68 USD)

**Cost Reduction:** 97% cheaper (30-47x savings)

### Complexity Metrics

- **Specification:** v1.3.1 (~30KB markdown)
- **Architecture Layers:** 3 (SDK → Resolver → Dashboard)
- **Dependencies:**
  - Blockfrost/Koios for indexing
  - IPFS (Pinata)
  - json-canonicalize (JCS)
  - cardano-serialization-lib
  - Lucid-Cardano for tx building

- **Development Time:** 6-8 weeks
  - Resolver + indexer: 2-3 weeks
  - SDK development: 2-3 weeks
  - Dashboard UI: 2-3 weeks
  - Testing & deployment: 1 week

### Pros

✅ **Ultra Low Cost:** 97% cheaper than smart contracts  
✅ **Fast Development:** 3-4x faster time to market  
✅ **No Smart Contract Audit Required:** Application-level security  
✅ **Easy Iteration:** Fix bugs without migrations  
✅ **Same W3C Compliance:** Identical standards adherence  
✅ **Clear Upgrade Path:** Can add Plutus v2 later (§11.3)  
✅ **Production-Ready Spec:** Complete technical design v1.3.1  

### Cons

⚠️ **Application-Level Security:** Not L1-enforced (acceptable for MVP)  
⚠️ **Resolver Dependency:** Requires running/trusting resolver service  
⚠️ **Spam Metadata:** Anyone can write to labels (filtered by resolver)  

---

## Side-by-Side Comparison

| Feature | CIP-68 NFT Approach | Metadata Approach |
|---------|---------------------|-------------------|
| **Cost per DID** | 5-8 ADA | 0.17 ADA |
| **Cost for 1,000 DIDs** | 5,000-8,000 ADA | 170 ADA |
| **Time to MVP** | 4-6 months | 6-8 weeks |
| **Smart Contract Required** | Yes (3 validators) | No |
| **Smart Contract Audit** | Required | Not applicable |
| **W3C Compliance** | ✅ Yes | ✅ Yes |
| **L1 Enforcement** | ✅ Yes | ⚠️ Application-level |
| **Upgrade Flexibility** | ❌ Hard | ✅ Easy |
| **Development Complexity** | High | Low |
| **On-Chain State** | UTxOs + NFTs | Metadata only |
| **Spam Prevention** | L1-enforced | Resolver filters |
| **Multi-Sig/Advanced Auth** | Requires contract changes | Future (v2+) |

---

## Why Metadata Approach Wins for Catalyst MVP

### 1. **Cost Efficiency: 97% Cheaper**

**Impact on Pilots:**
- **CIP-68:** 100 test DIDs = 500-800 ADA (~$200-320)
- **Metadata:** 100 test DIDs = 17 ADA (~$7)

For a Catalyst-funded project with budget constraints, this difference is **make or break**.

### 2. **Speed to Market: 3-4x Faster**

**Catalyst Timeline:**
- Proposal approval: Month 1
- CIP-68 approach ready: Month 6-7 (might miss evaluation)
- Metadata approach ready: Month 2-3 (plenty of time for pilots)

**You can ship, validate market fit, and iterate within the grant period.**

### 3. **Identical W3C Compliance**

Both approaches deliver:
- ✅ W3C DID Core compliant `did:cardano` method
- ✅ W3C VC Data Model compliant credentials
- ✅ Ed25519 signature verification
- ✅ DID resolution
- ✅ VC anchoring

**The metadata approach doesn't compromise on standards.**

### 4. **Same Security for the Threat Model**

**Threat:** Someone creates a fake DID for another person's stake address

**CIP-68 Defense:**
- Plutus validator checks signature on-chain
- Minting policy enforces rules

**Metadata Defense:**
- Resolver checks signature off-chain
- Invalid events filtered out

**Result:** Both prevent impersonation via cryptography (Ed25519)

**The difference:**
- CIP-68: L1-enforced (more trustless)
- Metadata: Application-level (sufficient for MVP)

For pilots with trusted UI (Prisma dashboard), application-level security is **acceptable**.

### 5. **Better Upgrade Path**

**CIP-68 Approach:**
- Would start with full smart contracts implementation
- Hard to change rules once deployed
- Migration complexity if standards evolve

**Metadata Approach:**
- v1: Metadata-only (MVP)
- v2: Implement Plutus v2 registry using existing CIP-68 design proposals
- v3: Multi-sig, time-locks, DAO governance

**You preserve optionality while validating market fit first.**

---

## What Changed During Design

### Initial Assumptions (Reconsidered)

1. ⚠️ "We need L1 enforcement from day 1"
2. ⚠️ "Smart contracts = more decentralized = always better"
3. ⚠️ "NFTs provide better UX for DIDs"
4. ⚠️ "Cost doesn't matter much for identity"

### Realizations (Validated)

1. ✅ **Spam ≠ Impersonation** - Anyone can write metadata, but only controller can sign valid events
2. ✅ **Resolver = Sufficient for MVP** - Off-chain validation works when backed by cryptographic signatures
3. ✅ **Plutus v2 = Optional Upgrade** - Can add L1 enforcement later without breaking v1 DIDs
4. ✅ **Cost Matters for Pilots** - 30x cheaper enables actual pilot deployments with budget constraints
5. ✅ **Speed Matters for Catalyst** - 6 weeks vs 6 months determines project success within grant timeline
6. ✅ **Design Work Validates Options** - Detailed CIP-68 design proposals prove we understand both paths

### The Key Insight

> "For an MVP with a 6-month Catalyst timeline and limited budget, optimizing for **speed and cost** while maintaining **standards compliance** is more important than optimizing for **maximum decentralization on day 1**."

You can always add more decentralization later. You can't recover from:
- Running out of money on expensive operations
- Missing the evaluation deadline
- Over-engineering before validating market fit

The CIP-68 design work demonstrates technical depth and provides a **detailed roadmap for future L1 enforcement**, not wasted effort.

---

## Risk Analysis

### CIP-68 Approach Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Smart contract bug | Medium | Critical | Extensive testing + audit |
| Cost overruns | High | High | Budget more ADA |
| Development delays | High | Critical | Hire Aiken expert |
| NFT standard changes | Low | High | Monitor CIP updates |
| UTxO contention | Medium | Medium | Batch operations |

### Metadata Approach Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Resolver downtime | Low | Medium | Deploy redundant resolvers |
| Spam metadata | High | Low | Resolver filters invalid events |
| Centralization concerns | Medium | Low | Document upgrade path to Plutus v2 |
| Standards changes | Low | Low | Metadata is flexible |

**Overall Risk:** Metadata approach has lower risk profile for MVP.

---

## Financial Comparison (Real Numbers)

### Scenario: 500 DIDs + 2,000 VCs for Pilot

**CIP-68 Approach:**
- 500 DID creations: 2,500-4,000 ADA
- 100 DID updates: 300-500 ADA
- 2,000 VC anchors: 6,000-10,000 ADA
- **Total: 8,800-14,500 ADA (~$3,500-5,800 USD)**

**Metadata Approach:**
- 500 DID creations: 85 ADA
- 100 DID updates: 17 ADA
- 2,000 VC anchors: 340 ADA
- **Total: 442 ADA (~$177 USD)**

**Savings: $3,323-5,623 (94-97% reduction)**

---

## Timeline Comparison (Realistic Estimates)

### CIP-68 Approach: 20-26 Weeks

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Smart contract dev | 6-8 weeks | Aiken expertise |
| Testing framework | 2-3 weeks | Test infrastructure |
| Security audit | 4-6 weeks | External auditor |
| Backend integration | 4-6 weeks | Lucid + IPFS + DB |
| Frontend development | 4-6 weeks | Mesh SDK + React |
| Testnet validation | 2-4 weeks | Faucet + testing |

**Critical Path:** Contract audit blocks everything downstream

### Metadata Approach: 6-8 Weeks

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Resolver development | 2-3 weeks | Blockfrost API |
| SDK development | 2-3 weeks | Lucid + JCS |
| Dashboard UI | 2-3 weeks | React + CIP-30 |
| Testing & deployment | 1 week | Testnet |

**No Blockers:** All phases can partially overlap

**Time Saved:** 14-18 weeks (3.5-4.5 months)

---

## Decision Matrix

| Criterion | Weight | CIP-68 Score | Metadata Score | Winner |
|-----------|--------|--------------|----------------|--------|
| Cost Efficiency | 25% | 2/10 | 10/10 | **Metadata** |
| Development Speed | 25% | 3/10 | 10/10 | **Metadata** |
| W3C Compliance | 20% | 10/10 | 10/10 | Tie |
| Security | 15% | 10/10 | 7/10 | CIP-68 |
| Upgrade Flexibility | 10% | 4/10 | 9/10 | **Metadata** |
| Decentralization | 5% | 10/10 | 6/10 | CIP-68 |

**Weighted Score:**
- **CIP-68:** (2×0.25) + (3×0.25) + (10×0.20) + (10×0.15) + (4×0.10) + (10×0.05) = **4.65/10**
- **Metadata:** (10×0.25) + (10×0.25) + (10×0.20) + (7×0.15) + (9×0.10) + (6×0.05) = **8.85/10**

**Winner: Metadata Approach** (significantly better for Catalyst MVP across cost, speed, and flexibility)

---

## Conclusion

### The Trade

We traded **"L1-enforced from day 1"** for:
- ✅ 30-47x cost reduction
- ✅ 3-4x faster time to market
- ✅ Simplified development (no smart contracts to implement)
- ✅ Same W3C standards compliance
- ✅ Option to add L1 enforcement later (detailed design already exists)

### The Verdict

For a **Catalyst MVP with:**
- 6-month timeline
- Limited budget
- Need to validate market fit
- Requirement for real pilot deployments

**The metadata approach is objectively superior.**

### What We Keep

- ✅ Full W3C DID Core compliance
- ✅ Full W3C VC Data Model compliance
- ✅ Cryptographic security (Ed25519)
- ✅ Verifiable signatures
- ✅ Clear upgrade path to L1 enforcement (design validated)

### What We Gain

- ✅ 97% cost reduction
- ✅ 75% faster development
- ✅ Production-ready spec (v1.3.1)
- ✅ Ability to ship within Catalyst timeline
- ✅ Budget for actual pilot operations

### Future Path

**v1 (Metadata):** Ship MVP, validate pilots, gather feedback  
**v2 (Plutus v2):** Implement L1 enforcement using CIP-68 design as foundation  
**v3 (Advanced):** Multi-sig, DAOs, cross-chain bridges

---

## References

### Prisma DIDs Documentation
- **Prisma DIDs v1.3.1:** Production-Ready Technical Specification (this design)
- **Documento 4:** Contrato Inteligente Aiken Actualizado (CIP-68) - Complete smart contract code
- **Documento 5:** Documentación Código Production-Ready CIP-68 - Comprehensive implementation guide
- **Approach Comparison:** This document

### Cardano Standards
- **CIP-68:** NFT Metadata Standard
- **CIP-20:** Transaction Metadata
- **CIP-10:** Metadata Label Registry
- **CIP-30:** dApp Wallet Connector

### W3C Standards
- **W3C DID Core 1.0:** Decentralized Identifiers
- **W3C VC Data Model 1.1:** Verifiable Credentials

### Technical References
- **RFC 8785:** JSON Canonicalization Scheme (JCS)
- **Cardano Serialization Library:** Address and key handling
- **Lucid-Cardano:** Transaction building framework

---

**Status:** Decision finalized in favor of metadata approach  
**Next Steps:** Begin resolver implementation (Week 1)  
**Review Date:** Post-MVP (evaluate Plutus v2 migration)
