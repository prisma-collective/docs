---
sidebarTitle: Credential Schemas
---
# Credential Schema Authoring Guide

How to define new Verifiable Credential types in `packages/schemas`, validate claims with Zod, and register schemas across the SDK, Indexer, and VC Interface.

---

## Overview

Every credential type in Prisma DIDs is defined as a **Zod schema** in the `packages/schemas` package. This single definition serves as the source of truth for:

- **SDK** — validates claims before issuance (`issueSDJwtVC()`)
- **Indexer** — exposes supported types via `GET /schemas`
- **VC Interface** — re-exports types for UI forms

```
packages/schemas/src/credentials/contribution.ts
       ↓ registerSchema()
packages/schemas/src/registry.ts (Map<vct, {schema, disclosableFields}>)
       ↓ import
┌──────┼──────────────┐
│      │              │
SDK    Indexer    VC Interface
(validate) (expose)  (UI types)
```

---

## Schema Anatomy

### Base Fields (All Credentials)

Every credential extends `BaseCredentialSchema` which provides protocol-level fields:

```typescript
// packages/schemas/src/base.ts
export const BaseCredentialSchema = z.object({
  iss: z.string().startsWith('did:cardano:'),    // Issuer DID
  sub: z.string().startsWith('did:cardano:'),    // Holder DID
  jti: z.string().regex(/^urn:uuid:.../),        // Credential UUID
  iat: z.number().int().positive(),              // Issued-at (Unix)
  exp: z.number().int().positive().optional(),   // Expiration (optional)
  vct: z.string().min(1),                        // Type discriminator
});
```

These fields are set automatically by the SDK during issuance — you don't need to include them in claim forms.

### Domain-Specific Fields (Your Credential)

Your schema extends the base with domain-specific claims:

```typescript
export const ContributionCredentialSchema = BaseCredentialSchema.extend({
  vct: z.literal('ContributionCredential'),  // Type discriminator (literal)
  projectId: z.string().min(1),              // Required
  contributionType: ContributionTypeEnum,    // Enum
  hours: z.number().positive().optional(),   // Optional
  organization: z.string().min(1),           // Required
  description: z.string().optional(),        // Optional
  evidenceUrl: z.string().url().optional(),  // Optional, validated URL
});
```

### Selective Disclosure

Each schema declares which fields can be **selectively disclosed** (hidden by default, revealed only when the holder chooses):

```typescript
export const contributionDisclosableFields = [
  'hours',
  'description',
  'evidenceUrl',
] as const;
```

**Design rule:** Sensitive or personal fields should be disclosable. Structural fields (projectId, organization) should always be visible.

---

## Adding a New Credential Type

### Step 1: Create the Schema File

Create `packages/schemas/src/credentials/membership.ts`:

```typescript
import { z } from 'zod';
import { BaseCredentialSchema } from '../base.js';

// Define enums for constrained fields
export const MembershipTierEnum = z.enum([
  'bronze',
  'silver',
  'gold',
  'platinum',
]);
export type MembershipTier = z.infer<typeof MembershipTierEnum>;

// Define the credential schema
export const MembershipCredentialSchema = BaseCredentialSchema.extend({
  vct: z.literal('MembershipCredential'),       // REQUIRED: literal discriminator
  organization: z.string().min(1),               // Organization name
  tier: MembershipTierEnum,                      // Membership level
  memberSince: z.string().datetime(),            // ISO 8601 date
  department: z.string().optional(),             // Optional department
  employeeId: z.string().optional(),             // Optional, sensitive
});

// Infer TypeScript type from schema
export type MembershipCredential = z.infer<typeof MembershipCredentialSchema>;

// Declare disclosable fields
export const membershipDisclosableFields = [
  'department',
  'employeeId',
] as const;
```

### Step 2: Register in the Registry

Update `packages/schemas/src/registry.ts`:

```typescript
import {
  MembershipCredentialSchema,
  membershipDisclosableFields,
} from './credentials/membership.js';

// Existing registrations...
registerSchema('ContributionCredential', ContributionCredentialSchema, contributionDisclosableFields);

// Add your new type
registerSchema('MembershipCredential', MembershipCredentialSchema, membershipDisclosableFields);
```

### Step 3: Export from Package

Update `packages/schemas/src/index.ts`:

```typescript
// Existing exports...
export {
  ContributionCredentialSchema,
  ContributionTypeEnum,
  contributionDisclosableFields,
  type ContributionCredential,
  type ContributionType,
} from './credentials/contribution.js';

// New credential type
export {
  MembershipCredentialSchema,
  MembershipTierEnum,
  membershipDisclosableFields,
  type MembershipCredential,
  type MembershipTier,
} from './credentials/membership.js';
```

### Step 4: Rebuild

```bash
pnpm --filter @prisma-events/dids-schemas build
```

### Step 5: Update VC Interface (Optional)

If the UI should support issuing this credential type:

**`apps/vc-interface/config/org-config.ts`:**
```typescript
CREDENTIAL_TYPES: ['ContributionCredential', 'MembershipCredential'],
```

**`apps/vc-interface/types/vc.ts`:**
```typescript
export type CredentialType = 'ContributionCredential' | 'MembershipCredential';
export { MembershipTierEnum } from '@prisma-events/dids-schemas';
```

**Add translations** for each locale:
```json
{
  "types": {
    "ContributionCredential": "Contribution",
    "MembershipCredential": "Membership"
  }
}
```

### Step 6: Verify

```bash
# SDK validates automatically on issuance
# Indexer exposes via /schemas endpoint
curl https://your-indexer.up.railway.app/schemas
```

Expected response:
```json
{
  "schemas": [
    { "vct": "ContributionCredential", "disclosableFields": ["hours", "description", "evidenceUrl"] },
    { "vct": "MembershipCredential", "disclosableFields": ["department", "employeeId"] }
  ]
}
```

---

## Zod Validation Patterns

### Common Validators

```typescript
// Strings
z.string().min(1)                    // Non-empty
z.string().max(500)                  // Max length
z.string().url()                     // Valid URL
z.string().email()                   // Valid email
z.string().regex(/^[A-Z]{3}$/)       // Custom pattern
z.string().startsWith('did:cardano:') // DID format

// Numbers
z.number().positive()                // > 0
z.number().int().min(0).max(100)     // Integer 0-100
z.number().nonnegative()             // >= 0

// Dates
z.string().datetime()                // ISO 8601
z.number().int().positive()          // Unix timestamp

// Enums
z.enum(['a', 'b', 'c'])             // String union
z.literal('ExactValue')             // Exact match

// Optional fields
z.string().optional()                // string | undefined
z.number().positive().optional()     // number | undefined
```

### Extending Base Schema

Always use `.extend()` on `BaseCredentialSchema`:

```typescript
export const MySchema = BaseCredentialSchema.extend({
  vct: z.literal('MyCredential'),  // Override vct with literal
  // ... your fields
});
```

This ensures all protocol fields (iss, sub, jti, iat, vct) are validated.

### Inferring TypeScript Types

```typescript
// Schema → Type (no manual interface needed)
export type MyCredential = z.infer<typeof MyCredentialSchema>;

// Enum → Type
export type MyEnum = z.infer<typeof MyEnumSchema>;
```

---

## How Validation Works

### Issuance Flow

When `issueSDJwtVC()` is called in the SDK:

```
1. getSchema(vct) → lookup in registry
2. If found:
   a. Build full credential: { iss, sub, jti, iat, vct, ...claims }
   b. schema.safeParse(fullCredential) → Zod validation
   c. Check disclosable keys against allowed list
   d. Throw on failure with field-specific error messages
3. If NOT found:
   → Skip validation (forward-compatible with unknown types)
4. Proceed with COSE-SD issuance
```

### Error Messages

Validation failures produce clear, actionable errors:

```
Schema validation failed for ContributionCredential:
  projectId: String must contain at least 1 character(s);
  contributionType: Invalid enum value. Expected 'code' | 'design' | ... , received 'invalid'
```

```
Invalid disclosable keys for ContributionCredential: projectId.
  Allowed: hours, description, evidenceUrl
```

### Unknown Credential Types

If a `vct` is not registered in the schema registry, the SDK **skips validation** and allows issuance. This provides forward compatibility — new credential types can be used before schemas are formally registered.

---

## On-Chain Event Schema

VC lifecycle events are stored on Cardano under metadata label `L_VC` (199675). The event schema is defined in `packages/schemas/src/vc-event.ts`:

```typescript
export const VCEventPayloadSchema = z.object({
  event: z.enum(['issue', 'validate', 'revoke']),
  issuerDid: z.string().startsWith('did:cardano:'),
  holderDid: z.string().startsWith('did:cardano:'),
  vcHash: z.string().min(1),        // jti for COSE-SD credentials
  vcType: z.string().min(1),        // Must match your schema's vct
  vcFormat: z.enum(['cose-sd', 'ed25519']),
  validatorDid: z.string().optional(),
  reason: z.string().optional(),
  payloadSig: z.string(),           // COSE_Sign1 signature
  ts: z.string().datetime(),
});
```

The `vcType` field on-chain matches the `vct` literal in your credential schema. The indexer uses this to correlate on-chain events with credential types.

---

## Package Structure

```
packages/schemas/
├── src/
│   ├── index.ts                      ← Public API exports
│   ├── base.ts                       ← BaseCredentialSchema (shared fields)
│   ├── vc-event.ts                   ← On-chain event schema + L_VC constant
│   ├── registry.ts                   ← Schema registry (Map + register/get/list)
│   └── credentials/
│       ├── contribution.ts           ← ContributionCredential (built-in)
│       └── membership.ts             ← Your new credential type
├── package.json                      ← @prisma-events/dids-schemas, depends on zod
└── tsconfig.json
```

---

## Checklist for New Credential Types

- [ ] Create schema file in `packages/schemas/src/credentials/`
- [ ] Extend `BaseCredentialSchema` with `vct: z.literal('...')`
- [ ] Define enums for constrained fields
- [ ] Declare `disclosableFields` array
- [ ] Export TypeScript type via `z.infer<>`
- [ ] Register in `packages/schemas/src/registry.ts`
- [ ] Export from `packages/schemas/src/index.ts`
- [ ] Run `pnpm --filter @prisma-events/dids-schemas build`
- [ ] (Optional) Update VC Interface `org-config.ts` CREDENTIAL_TYPES
- [ ] (Optional) Update VC Interface types and translations
- [ ] Verify: `curl your-indexer/schemas` shows the new type
