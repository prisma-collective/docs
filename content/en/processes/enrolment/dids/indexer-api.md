---
sidebarTitle: Indexer API
---
# Prisma DIDs Indexer API

Base URL depends on which indexer instance you are querying. The DID indexer and VC indexer run as separate services with different `INDEXER_CONFIG` values, but they share the same codebase and health endpoint.

All responses are JSON. All timestamps are ISO 8601 strings. The API supports CORS and gzip compression.

## Health

### GET /health

Returns the current sync state of the indexer. Use this to check if the service is running and how far behind the chain tip it is.

**Response**

```json
{
  "status": "ok",
  "indexer": "prisma-did-indexer",
  "network": "preprod",
  "confirmationDepth": 10,
  "sync": [
    {
      "label": 199674,
      "lastBlockHeight": 1234567,
      "lastBlockHash": "abc123..."
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"ok"` if the server is responding |
| `indexer` | string | Name of the indexer configuration |
| `network` | string | Cardano network (`preprod` or `mainnet`) |
| `confirmationDepth` | number | How many blocks deep a transaction must be before it is considered confirmed |
| `sync` | array | One entry per metadata label the indexer is tracking. `lastBlockHeight` tells you the most recent block the indexer has processed |

---

## DID Endpoints

These endpoints are available on the DID indexer (`INDEXER_CONFIG=did`).

### GET /did/:did

Resolves a DID to its current document and metadata. By default, the indexer uses the latest valid **confirmed** event for this DID, fetches the DID Document from IPFS, and returns both.

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `did` | string | The full DID string, e.g. `did:cardano:stake_test1uq...` |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `includeUnconfirmed` | string | `"false"` | Set to `"true"` to include events that have not yet reached confirmation depth. Useful for showing freshly created DIDs before they are fully confirmed |

**Responses**

| Status | When |
|--------|------|
| 200 | DID found and active |
| 400 | Invalid DID format |
| 404 | No events found for this DID |
| 410 | DID has been revoked |

**200 Response**

```json
{
  "did": "did:cardano:stake_test1uq...",
  "document": {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:cardano:stake_test1uq...",
    "verificationMethod": [...],
    "authentication": [...],
    "service": [...]
  },
  "metadata": {
    "created": "2025-01-15T10:30:00.000Z",
    "updated": "2025-02-01T14:00:00.000Z",
    "version": 2,
    "deactivated": false
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `did` | string | The resolved DID |
| `document` | object or null | The W3C DID Document fetched from IPFS. Null if the IPFS fetch failed |
| `metadata.created` | string or null | Timestamp of the first `create` event |
| `metadata.updated` | string | Timestamp of the most recent event |
| `metadata.version` | number | Current version number (starts at 1, increments on each update) |
| `metadata.deactivated` | boolean | Always `false` for active DIDs (revoked DIDs return 410 instead) |

**Caching**: Responses are cached for 60 seconds. An `ETag` header is included based on the DID and version number.

---

### GET /did/:did/history

Returns the full event history for a DID with pagination. Each event represents an on-chain action (create, update, or revoke).

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `did` | string | The full DID string |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | `50` | Results per page, between 1 and 100 |
| `offset` | number | `0` | Number of results to skip |
| `order` | string | `"desc"` | Sort order by version. `"desc"` shows newest first, `"asc"` shows oldest first |
| `includeUnconfirmed` | string | `"false"` | Set to `"true"` to include unconfirmed events |

**Responses**

| Status | When |
|--------|------|
| 200 | DID found, returning events |
| 400 | Invalid DID format |
| 404 | No events found for this DID |

**200 Response**

```json
{
  "did": "did:cardano:stake_test1uq...",
  "events": [
    {
      "txHash": "abc123...",
      "action": "create",
      "version": 1,
      "prevTxHash": null,
      "ipfsCid": "QmXyz...",
      "blockHeight": 1234000,
      "timestamp": "2025-01-15T10:30:00.000Z",
      "valid": true,
      "confirmed": true
    }
  ],
  "total": 3,
  "limit": 50,
  "offset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `events[].txHash` | string | Cardano transaction hash |
| `events[].action` | string | One of `create`, `update`, or `revoke` |
| `events[].version` | number | Version number at the time of this event |
| `events[].prevTxHash` | string or null | Transaction hash of the previous event in the chain. Null for `create` events |
| `events[].ipfsCid` | string or null | IPFS CID pointing to the DID Document for this version |
| `events[].blockHeight` | number | Block number where this transaction was included |
| `events[].timestamp` | string | Block timestamp |
| `events[].valid` | boolean | Whether the event passed structural and signature validation |
| `events[].confirmed` | boolean | Whether the event has reached the required confirmation depth |
| `total` | number | Total number of events matching the query |
| `limit` | number | Page size used |
| `offset` | number | Offset used |

---

### GET /1.0/identifiers/:did

W3C Universal Resolver compatible endpoint. Returns the same data as `GET /did/:did` but wrapped in the standard DID Resolution Result format defined by the [W3C DID Resolution spec](https://w3c-ccg.github.io/did-resolution/).

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `did` | string | The full DID string |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `includeUnconfirmed` | string | `"false"` | Set to `"true"` to include unconfirmed events |

**200 Response (active DID)**

```json
{
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  },
  "didDocument": {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:cardano:stake_test1uq..."
  },
  "didDocumentMetadata": {
    "created": "2025-01-15T10:30:00.000Z",
    "updated": "2025-02-01T14:00:00.000Z",
    "versionId": "2",
    "deactivated": false
  }
}
```

**200 Response (revoked DID)**

```json
{
  "didResolutionMetadata": {},
  "didDocument": null,
  "didDocumentMetadata": {
    "deactivated": true
  }
}
```

**400 Response (invalid DID)**

```json
{
  "didResolutionMetadata": { "error": "invalidDid" },
  "didDocument": null,
  "didDocumentMetadata": {}
}
```

**404 Response (not found)**

```json
{
  "didResolutionMetadata": { "error": "notFound" },
  "didDocument": null,
  "didDocumentMetadata": {}
}
```

---

## Verifiable Credential Endpoints

These endpoints are available on the VC indexer (`INDEXER_CONFIG=vc`).

### GET /vc/:vcHash

Returns all on-chain anchor events for a credential, ordered by block height. This includes issue, validate, and revoke events. Useful for building a full audit trail.

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `vcHash` | string | The credential's unique identifier (JTI hash) |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `includeUnconfirmed` | string | `"false"` | Set to `"true"` to include unconfirmed events |

**Responses**

| Status | When |
|--------|------|
| 200 | Events found |
| 404 | No events for this vcHash |

**200 Response**

```json
{
  "vcHash": "abc123...",
  "events": [
    {
      "txHash": "def456...",
      "event": "issue",
      "issuerDid": "did:cardano:stake_test1uq...",
      "holderDid": "did:cardano:stake_test1ur...",
      "validatorDid": null,
      "vcType": "PrismaIdentityCredential",
      "vcFormat": "cose-sd",
      "ipfsCid": "QmXyz...",
      "reason": null,
      "confirmed": true,
      "blockHeight": 1234000,
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `events[].txHash` | string | Cardano transaction hash |
| `events[].event` | string | One of `issue`, `validate`, or `revoke` |
| `events[].issuerDid` | string | DID of the credential issuer |
| `events[].holderDid` | string | DID of the credential holder |
| `events[].validatorDid` | string or null | DID of the validator (only present for `validate` events) |
| `events[].vcType` | string | Credential type identifier (e.g. `PrismaIdentityCredential`) |
| `events[].vcFormat` | string | Credential format. One of `cose-sd` or `ed25519` |
| `events[].ipfsCid` | string or null | IPFS CID where the credential payload is pinned. Only present on `issue` events |
| `events[].reason` | string or null | Revocation reason, only present on `revoke` events |
| `events[].confirmed` | boolean | Whether this event has reached confirmation depth |
| `events[].blockHeight` | number | Block number |
| `events[].timestamp` | string | Block timestamp |

---

### GET /vc/:vcHash/status

Returns the current status of a credential. The indexer looks at all events for this vcHash and reduces them into a single status using a deterministic algorithm: it finds the first `issue` event to identify the canonical issuer, then checks if there is an authorized `revoke` event from that same issuer. Only the original issuer can revoke a credential.

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `vcHash` | string | The credential's unique identifier |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `includeUnconfirmed` | string | `"false"` | Set to `"true"` to see freshly issued credentials that have not been confirmed yet |

**Responses**

| Status | When |
|--------|------|
| 200 | Status computed |
| 404 | No events for this vcHash |

**200 Response (active)**

```json
{
  "vcHash": "abc123...",
  "status": "active",
  "confirmed": true,
  "issuer": "did:cardano:stake_test1uq...",
  "holder": "did:cardano:stake_test1ur...",
  "vcType": "PrismaIdentityCredential",
  "issuedAt": "2025-01-15T10:30:00.000Z",
  "issuedTxHash": "def456...",
  "issuedTxConfirmed": true
}
```

**200 Response (revoked)**

```json
{
  "vcHash": "abc123...",
  "status": "revoked",
  "confirmed": true,
  "issuer": "did:cardano:stake_test1uq...",
  "holder": "did:cardano:stake_test1ur...",
  "vcType": "PrismaIdentityCredential",
  "issuedAt": "2025-01-15T10:30:00.000Z",
  "issuedTxHash": "def456...",
  "issuedTxConfirmed": true,
  "revokedAt": "2025-02-10T08:00:00.000Z",
  "revokedTxHash": "ghi789...",
  "reason": "key_compromised"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `vcHash` | string | The credential identifier |
| `status` | string | One of `active`, `revoked`, or `unknown`. For `GET /vc/:vcHash/status`, `unknown` means events exist but none are `issue` events (if no events exist, this endpoint returns 404). In batch status responses, missing vcHashes are returned as `unknown` |
| `confirmed` | boolean | True if all relevant events (issue and revoke if applicable) have been confirmed |
| `issuer` | string | DID of the issuer (from the first `issue` event) |
| `holder` | string | DID of the holder |
| `vcType` | string | Credential type |
| `issuedAt` | string | When the credential was issued |
| `issuedTxHash` | string | Transaction hash of the issue event |
| `issuedTxConfirmed` | boolean | Whether the issue transaction is confirmed |
| `revokedAt` | string | When the credential was revoked (only if `status` is `revoked`) |
| `revokedTxHash` | string | Transaction hash of the revoke event (only if revoked) |
| `reason` | string | Revocation reason (only if provided by the issuer) |

**Caching**: Responses are cached for 30 seconds.

---

### POST /vc/status/batch

Fetches the status of multiple credentials in a single request. This avoids making one HTTP call per credential when loading a list. Each vcHash is reduced independently using the same algorithm as `GET /vc/:vcHash/status`.

**Request body**

```json
{
  "vcHashes": ["abc123...", "def456...", "ghi789..."],
  "includeUnconfirmed": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `vcHashes` | string[] | Yes | Array of credential identifiers. Maximum 100 per request |
| `includeUnconfirmed` | boolean | No | Defaults to `false`. Set to `true` to include unconfirmed events in the status computation |

**Responses**

| Status | When |
|--------|------|
| 200 | Statuses computed |
| 400 | Missing or invalid `vcHashes`, or more than 100 items |

**200 Response**

```json
{
  "statuses": {
    "abc123...": {
      "vcHash": "abc123...",
      "status": "active",
      "confirmed": true,
      "issuer": "did:cardano:stake_test1uq...",
      "holder": "did:cardano:stake_test1ur...",
      "vcType": "PrismaIdentityCredential",
      "issuedAt": "2025-01-15T10:30:00.000Z",
      "issuedTxHash": "def456...",
      "issuedTxConfirmed": true
    },
    "def456...": {
      "vcHash": "def456...",
      "status": "unknown",
      "confirmed": true
    }
  }
}
```

The `statuses` object is keyed by vcHash. Each value has the same shape as the response from `GET /vc/:vcHash/status`. In this batch endpoint, credentials with no events on-chain are returned as `status: "unknown"` (unlike the single status endpoint, which returns 404 when no events are found).

**Caching**: Responses are cached for 30 seconds.

---

### GET /issuer/:did/credentials

Returns a paginated list of credentials issued by a specific DID. Only `issue` events are returned (not revoke or validate events). To check if any of these credentials have been revoked, use the batch status endpoint.

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `did` | string | The issuer's DID |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | `20` | Results per page, between 1 and 100 |
| `offset` | number | `0` | Number of results to skip |
| `order` | string | `"desc"` | Sort by block height. `"desc"` shows newest first |
| `includeUnconfirmed` | string | `"false"` | Set to `"true"` to include unconfirmed issue events |

**200 Response**

```json
{
  "issuer": "did:cardano:stake_test1uq...",
  "credentials": [
    {
      "vcHash": "abc123...",
      "holderDid": "did:cardano:stake_test1ur...",
      "vcType": "PrismaIdentityCredential",
      "vcFormat": "cose-sd",
      "ipfsCid": "QmXyz...",
      "txHash": "def456...",
      "confirmed": true,
      "blockHeight": 1234000,
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `credentials[].vcHash` | string | Credential identifier |
| `credentials[].holderDid` | string | DID of the holder this credential was issued to |
| `credentials[].vcType` | string | Credential type |
| `credentials[].vcFormat` | string | Credential format |
| `credentials[].ipfsCid` | string or null | IPFS CID of the credential payload |
| `credentials[].txHash` | string | Transaction hash of the issue event |
| `credentials[].confirmed` | boolean | Whether the issue event is confirmed |
| `credentials[].blockHeight` | number | Block number |
| `credentials[].timestamp` | string | Block timestamp |
| `pagination.total` | number | Total credentials matching the query |
| `pagination.limit` | number | Page size |
| `pagination.offset` | number | Current offset |

---

### GET /holder/:did/credentials

Returns a paginated list of credentials held by a specific DID. Same structure and behavior as the issuer endpoint but filtered by `holderDid` instead of `issuerDid`.

**URL params**

| Param | Type | Description |
|-------|------|-------------|
| `did` | string | The holder's DID |

**Query params**

Same as `GET /issuer/:did/credentials`.

**200 Response**

```json
{
  "holder": "did:cardano:stake_test1ur...",
  "credentials": [
    {
      "vcHash": "abc123...",
      "issuerDid": "did:cardano:stake_test1uq...",
      "vcType": "PrismaIdentityCredential",
      "vcFormat": "cose-sd",
      "ipfsCid": "QmXyz...",
      "txHash": "def456...",
      "confirmed": true,
      "blockHeight": 1234000,
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

The only difference from the issuer endpoint is that each credential includes `issuerDid` instead of `holderDid`, since the holder is already known from the URL.

---

### GET /schemas

Returns the list of supported credential types from the schema registry. Each schema defines which fields can be selectively disclosed when creating a presentation.

**No params.**

**200 Response**

```json
{
  "schemas": [
    {
      "vct": "ContributionCredential",
      "disclosableFields": ["hours", "description", "evidenceUrl"]
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `schemas[].vct` | string | Verifiable Credential Type identifier. This is the value used in the `vcType` field when issuing a credential |
| `schemas[].disclosableFields` | string[] | List of claim keys that support selective disclosure. When creating a presentation, the holder can choose which of these fields to reveal |

---

## Modifying the Credential Schema

The schema that defines what fields a credential contains lives in a single file: `packages/schemas/src/credentials/contribution.ts`. This is the only place you need to make changes.

**To add, remove, or change fields**, edit the `ContributionCredentialSchema.extend({})` block. Each field uses a Zod validator, for example `z.string().min(1)` for a required string or `z.number().positive().optional()` for an optional positive number.

**To change the contribution type options**, update the `ContributionTypeEnum` array at the top of the file. These are the allowed values for the `contributionType` field.

**To update which fields support selective disclosure**, edit the `contributionDisclosableFields` array at the bottom. When a holder creates a presentation, they can choose to reveal or hide any field listed here.

No changes are needed for the on-chain transaction (it only stores a credential hash and an IPFS pointer, so it never sees the schema fields), the indexer (it only indexes on-chain event metadata and never inspects the credential body on IPFS), or the schema registry (`packages/schemas/src/registry.ts`) which already references this file and feeds the `/schemas` endpoint automatically.

**You also need to update the issuance form.** The form in `apps/vc-interface/components/IssuanceForm.tsx` has a hardcoded `credentialFields` object (around line 35) that does not read from the Zod schema. If you change the schema, you must mirror those changes in the form or it will break.

**Example: adding a `role` field to ContributionCredential**

1. In `packages/schemas/src/credentials/contribution.ts`, add the field to the Zod schema:
   ```ts
   role: z.string().min(1),                  // required text field
   // or
   role: z.string().optional(),              // optional text field
   ```
   If it should support selective disclosure, add `'role'` to the `contributionDisclosableFields` array.

2. In `apps/vc-interface/components/IssuanceForm.tsx`, add a matching entry to the `ContributionCredential` array inside `credentialFields`:
   ```ts
   { key: 'role', label: 'Role', type: 'text', required: true, canDisclose: false, defaultDisclosed: false },
   ```
   Each field needs:
   - `key`: must match the Zod field name exactly
   - `label`: what the user sees in the form
   - `type`: `'text'` for strings, `'number'` for numbers, `'select'` for enums
   - `required`: `true` if the Zod field is not `.optional()`
   - `options`: only for `'select'` type, list the enum values (e.g. `['code', 'design', 'other']`)
   - `canDisclose`: `true` if the field is in `contributionDisclosableFields`
   - `defaultDisclosed`: `true` if the disclosure checkbox should be pre-checked

The same pattern applies when removing or renaming fields. Delete or update the entry in both files.

---

## Error Format

Most error responses include an `error` message and may include endpoint-specific context fields (for example, `did` or `vcHash`):

```json
{
  "error": "Human-readable error message",
  "did": "did:cardano:stake_test1..."
}
```

The Universal Resolver endpoint (`/1.0/identifiers/:did`) uses the W3C error format instead, with `didResolutionMetadata.error` containing the error code.

---

## Common Query Patterns

**Check if a DID exists and is active**

```
GET /did/did:cardano:stake_test1uq...
```
200 means active, 404 means not found, 410 means revoked.

**Load a credential list with statuses**

1. `GET /holder/did:cardano:stake_test1ur.../credentials?includeUnconfirmed=true` to get the list
2. `POST /vc/status/batch` with all the `vcHash` values from step 1 to get statuses in one call

**Check if a freshly issued credential is visible**

```
GET /vc/:vcHash/status?includeUnconfirmed=true
```
The `includeUnconfirmed=true` flag ensures the credential appears before it reaches confirmation depth. The `confirmed` field in the response tells you whether it is confirmed yet.
