---
sidebarTitle: 'Fork: VC Indexer'
---
# VC Indexer Fork Guide

How to create, configure, and deploy your own **VC Indexer** instance for indexing Verifiable Credential events on Cardano.

---

## Overview

The VC Indexer is a Fastify 5 service that polls Cardano for VC lifecycle events (issue, validate, revoke) under metadata label `L_VC` (199675), stores them in PostgreSQL via Drizzle ORM, and exposes a REST API for querying credential status.

**Each organization runs its own VC Indexer instance.** The indexer shares its codebase with the DID Indexer — behavior is driven entirely by configuration.

**Architecture:**
```
Cardano Blockchain (Blockfrost API)
       ↓ poll every 30s
Poller → vc-processor.ts (parse, validate, store)
       ↓
PostgreSQL (vc_events table)
       ↓
Fastify REST API
  GET /vc/:vcHash         → All events for a credential
  GET /vc/:vcHash/status  → Current status (active/revoked)
  GET /issuer/:did/credentials
  GET /holder/:did/credentials
  GET /schemas            → Registered credential types
  GET /health             → Health check + sync status
```

---

## Quick Start

### Option A: Create a New Config (Recommended)

If you're creating an indexer for a new organization:

```bash
# 1. Create your config file
cp apps/indexer/src/config/alj-vc-indexer.ts \
   apps/indexer/src/config/myorg-vc-indexer.ts
```

### Option B: Deploy the Default VC Indexer

Use the existing `vc-indexer.ts` config as-is — it indexes all VC events on the network.

---

## Step 1: Create Your Indexer Config

Create a new config file at `apps/indexer/src/config/myorg-vc-indexer.ts`:

```typescript
import { L_VC } from '@prisma-events/dids-schemas';
import type { ResolvedIndexerConfig } from './types.js';
import { vcEventProcessor } from '../worker/vc-processor.js';

/**
 * MyOrg VC Indexer configuration.
 * Indexes VC lifecycle events under Cardano metadata label 199675.
 */
export const myorgVcIndexerConfig: ResolvedIndexerConfig = {
  name: 'MyOrg VC Indexer',
  labels: [L_VC],               // Metadata label 199675
  eventsTable: 'vc_events',     // PostgreSQL table name
  schemas: {},                  // Auto-derived from processors at startup
  endpoints: [
    {
      method: 'GET',
      path: '/vc/:vcHash',
      handlerId: 'vc:resolve',
      description: 'All anchor events for a credential',
    },
    {
      method: 'GET',
      path: '/vc/:vcHash/status',
      handlerId: 'vc:status',
      description: 'Current VC status (active/revoked/unknown)',
    },
    {
      method: 'GET',
      path: '/issuer/:did/credentials',
      handlerId: 'vc:issuer-list',
      description: 'Paginated VCs issued by a DID',
    },
    {
      method: 'GET',
      path: '/holder/:did/credentials',
      handlerId: 'vc:holder-list',
      description: 'Paginated VCs held by a DID',
    },
    {
      method: 'GET',
      path: '/schemas',
      handlerId: 'vc:schemas',
      description: 'Supported credential schemas from registry',
    },
  ],
  network: (process.env.NETWORK as 'preprod' | 'mainnet') || 'preprod',
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 30_000,
  confirmationDepth: Number(process.env.CONFIRMATION_DEPTH) || 10,
  processors: {
    [L_VC]: vcEventProcessor,
  },
};
```

### Configuration Fields

| Field | Purpose | Default |
|-------|---------|---------|
| `name` | Display name (logs, health endpoint) | — |
| `labels` | Cardano metadata labels to scan | `[199675]` (L_VC) |
| `eventsTable` | PostgreSQL table for events | `'vc_events'` |
| `network` | Cardano network | `'preprod'` |
| `pollIntervalMs` | Polling interval in ms | `30000` (30s) |
| `confirmationDepth` | Blocks before marking confirmed | `10` |
| `processors` | Event processors keyed by label | `{ [L_VC]: vcEventProcessor }` |
| `endpoints` | REST API routes to register | See above |

---

## Step 2: Register Your Config

Add your config to the config registry in `apps/indexer/src/config/load-config.ts`:

```typescript
import { myorgVcIndexerConfig } from './myorg-vc-indexer.js';

const configs: Record<string, ResolvedIndexerConfig> = {
  did: didIndexerConfig,
  vc: vcIndexerConfig,
  'alj-vc-indexer': aljVcIndexerConfig,
  'myorg-vc-indexer': myorgVcIndexerConfig,   // ← Add here
};
```

The `INDEXER_CONFIG` environment variable selects which config to use at runtime.

---

## Step 3: Set Up PostgreSQL

### Local Development

```bash
# Using Docker
docker run -d \
  --name prisma-vc-postgres \
  -e POSTGRES_DB=vc_indexer \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16

# Connection URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vc_indexer
```

### Schema

Migrations run automatically on startup. The VC events table:

```sql
CREATE TABLE "vc_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tx_hash" text NOT NULL UNIQUE,
  "tx_index" integer,
  "event" text NOT NULL,               -- issue, validate, revoke
  "issuer_did" text NOT NULL,
  "holder_did" text NOT NULL,
  "validator_did" text,
  "signer_stake_address" text,         -- For revocation auth check
  "vc_hash" text NOT NULL,             -- jti (credential ID)
  "vc_type" text NOT NULL,             -- e.g., ContributionCredential
  "vc_format" text NOT NULL,           -- cose-sd, ed25519
  "reason" text,
  "valid" boolean NOT NULL DEFAULT true,
  "validation_error" text,
  "confirmed" boolean NOT NULL DEFAULT false,
  "confirmed_at_height" bigint,
  "block_height" bigint NOT NULL,
  "timestamp" timestamptz NOT NULL,
  "raw_event" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX "idx_vc_hash" ON "vc_events" ("vc_hash");
CREATE INDEX "idx_vc_issuer_did" ON "vc_events" ("issuer_did");
CREATE INDEX "idx_vc_holder_did" ON "vc_events" ("holder_did");
CREATE INDEX "idx_vc_block_height" ON "vc_events" ("block_height");
CREATE INDEX "idx_vc_confirmed" ON "vc_events" ("confirmed") WHERE NOT "confirmed";
```

---

## Step 4: Environment Variables

Create `.env.local` from the template:

```bash
cp apps/indexer/.env.example apps/indexer/.env.local
```

Required variables:

```bash
# Which config to load (must match a key in load-config.ts)
INDEXER_CONFIG=myorg-vc-indexer

# PostgreSQL connection
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Blockfrost API key (must match NETWORK)
BLOCKFROST_API_KEY=preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Cardano network
NETWORK=preprod

# Server
PORT=3001
HOST=0.0.0.0
```

Optional tuning:

```bash
# Polling interval (default: 30000ms)
POLL_INTERVAL_MS=30000

# Confirmation depth (default: 10 blocks)
CONFIRMATION_DEPTH=10
```

---

## Step 5: Run Locally

```bash
# Build workspace dependencies
pnpm --filter @prisma-events/dids-types build && \
pnpm --filter @prisma-events/dids-schemas build && \
pnpm --filter @prisma-events/dids-sdk build

# Build and run the indexer
pnpm --filter @prisma-events/dids-indexer build
cd apps/indexer && node dist/index.js
```

Verify it's running:

```bash
curl http://localhost:3001/health
# { "status": "ok", "service": "MyOrg VC Indexer", "network": "preprod", ... }

curl http://localhost:3001/schemas
# { "schemas": [{ "vct": "ContributionCredential", "disclosableFields": [...] }] }
```

---

## Step 6: Deploy to Railway

### Using Railpack (Recommended)

The monorepo includes a `railway.toml` at the root:

```toml
[build]
buildCommand = "pnpm --filter @prisma-events/dids-indexer build"

[deploy]
startCommand = "cd apps/indexer && node dist/index.js"
healthcheckPath = "/health"
healthcheckTimeout = 120
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Railway Setup

1. **Create a new project** in Railway
2. **Add PostgreSQL** service (Railway plugin)
3. **Add your indexer service** from the GitHub repo
4. **Set environment variables:**
   - `INDEXER_CONFIG=myorg-vc-indexer`
   - `DATABASE_URL` → auto-linked from PostgreSQL service
   - `BLOCKFROST_API_KEY`
   - `NETWORK=preprod`
   - `PORT=3001`
5. **Set watch patterns** in Railway: `/apps/indexer/**`
   - Changes outside `apps/indexer/` won't auto-deploy; use `git commit --allow-empty` + push to trigger

### Using Dockerfile (Alternative)

A multi-stage `Dockerfile` is included at `apps/indexer/Dockerfile`:

```dockerfile
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@10.6.1 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/indexer/package.json ./apps/indexer/
COPY packages/types/package.json ./packages/types/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/sdk/package.json ./packages/sdk/
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY packages/types/ ./packages/types/
COPY packages/schemas/ ./packages/schemas/
COPY packages/sdk/ ./packages/sdk/
COPY apps/indexer/ ./apps/indexer/
RUN pnpm --filter @prisma-events/dids-types build && \
    pnpm --filter @prisma-events/dids-schemas build && \
    pnpm --filter @prisma-events/dids-sdk build && \
    pnpm --filter @prisma-events/dids-indexer build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/indexer/dist ./apps/indexer/dist
COPY --from=builder /app/apps/indexer/drizzle ./apps/indexer/drizzle
COPY --from=builder /app/apps/indexer/node_modules ./apps/indexer/node_modules
COPY --from=builder /app/apps/indexer/package.json ./apps/indexer/
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/types/package.json ./packages/types/
COPY --from=builder /app/packages/schemas/dist ./packages/schemas/dist
COPY --from=builder /app/packages/schemas/package.json ./packages/schemas/
COPY --from=builder /app/packages/sdk/dist ./packages/sdk/dist
COPY --from=builder /app/packages/sdk/package.json ./packages/sdk/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

WORKDIR /app/apps/indexer
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### Deploy to Fly.io (Alternative)

Create a `fly.toml`:

```toml
app = "myorg-vc-indexer"

[build]
  dockerfile = "apps/indexer/Dockerfile"

[env]
  INDEXER_CONFIG = "myorg-vc-indexer"
  NETWORK = "preprod"
  PORT = "3001"

[[services]]
  internal_port = 3001
  protocol = "tcp"

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [[services.http_checks]]
    path = "/health"
    interval = 30000
    timeout = 5000
```

---

## Custom Metadata Labels

The default VC metadata label is `L_VC = 199675` (defined in `@prisma-events/dids-schemas`). All Prisma DIDs VC events use this label.

If you need a separate namespace (rare), you can:

1. Define a new label constant in `packages/schemas/src/vc-event.ts`
2. Create a new processor for that label
3. Reference the new label in your indexer config

**Note:** Using the standard `L_VC` label is recommended. All VC Interface instances read from `L_VC`, so using a different label would require UI changes.

---

## API Reference

All endpoints are defined in the config's `endpoints` array and implemented in `apps/indexer/src/api/routes/vc.ts`.

### `GET /vc/:vcHash`

Returns all anchor events for a credential, ordered by block height.

```bash
curl https://your-indexer.up.railway.app/vc/urn:uuid:abc123
```

```json
{
  "events": [
    {
      "txHash": "abc...",
      "eventType": "issue",
      "issuerDid": "did:cardano:stake_test1uz...",
      "holderDid": "did:cardano:stake_test1uz...",
      "vcType": "ContributionCredential",
      "blockHeight": 4200000,
      "confirmed": true,
      "timestamp": "2025-12-01T00:00:00Z"
    }
  ]
}
```

### `GET /vc/:vcHash/status`

Returns the **deterministic** current status, computed by the status reducer.

```json
{ "status": "active", "vcHash": "urn:uuid:abc123" }
```

Status values: `active`, `revoked`, `pending`, `not_found`

**Query params:** `?includeUnconfirmed=true` — include unconfirmed events (useful for showing "pending" after fresh issuance).

### `GET /issuer/:did/credentials`

Paginated list of credentials issued by a DID.

**Query params:** `?limit=20&offset=0&includeUnconfirmed=true`

### `GET /holder/:did/credentials`

Paginated list of credentials held by a DID.

### `GET /schemas`

Lists registered credential schemas from `@prisma-events/dids-schemas` registry.

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

### `GET /health`

```json
{
  "status": "ok",
  "service": "MyOrg VC Indexer",
  "network": "preprod",
  "confirmationDepth": 10,
  "sync": {
    "label": 199675,
    "lastBlockHeight": 4212689,
    "lastBlockHash": "545e..."
  }
}
```

---

## How the Status Reducer Works

The `reduceVCStatus()` function in `apps/indexer/src/api/routes/vc.ts` determines credential status deterministically:

1. Events are ordered by `blockHeight ASC, txIndex ASC NULLS LAST, txHash ASC`
2. An `issue` event sets status to `active`
3. A `revoke` event sets status to `revoked` **only if** the revoker's stake address matches the original issuer's
4. A `validate` event doesn't change status (informational)
5. If no confirmed events and some unconfirmed: `pending`
6. If no events at all: `not_found`

---

## Deployment Lessons

- **`.tsbuildinfo` files** must be in `.gitignore` — stale ones break Railway builds
- **ESM imports** need `.js` extensions on all relative paths
- **Build chain order matters**: types → schemas → sdk → indexer
- **Start command** must `cd apps/indexer` for relative paths (Drizzle migrations use `./drizzle`)
- **Railway watch patterns**: Only `/apps/indexer/**` triggers auto-deploy. For workspace package changes, do a manual push or `git commit --allow-empty -m "trigger deploy" && git push`

---

## File Reference

```
apps/indexer/
├── src/
│   ├── index.ts                    ← Entry point (loadConfig → db → server → poller)
│   ├── config/
│   │   ├── load-config.ts          ← Config registry + invariant validation
│   │   ├── types.ts                ← ResolvedIndexerConfig type
│   │   ├── did-indexer.ts          ← DID Indexer config
│   │   ├── vc-indexer.ts           ← Default VC Indexer config
│   │   └── alj-vc-indexer.ts       ← ALJ fork config (example)
│   ├── worker/
│   │   ├── poller.ts               ← Blockfrost polling loop
│   │   ├── vc-processor.ts         ← VC event parser + row mapper
│   │   └── did-processor.ts        ← DID event parser (reference)
│   ├── db/
│   │   ├── schema.ts               ← Drizzle table definitions
│   │   ├── connection.ts           ← PostgreSQL pool
│   │   └── migrate.ts              ← Auto-migration runner
│   ├── api/
│   │   ├── server.ts               ← Fastify app + route registration
│   │   └── routes/
│   │       ├── vc.ts               ← VC API endpoints + status reducer
│   │       └── did.ts              ← DID API endpoints (reference)
│   └── sources/
│       └── blockfrost.ts           ← Blockfrost API client
├── drizzle/
│   ├── 0000_wakeful_omega_red.sql  ← DID events migration
│   └── 0001_youthful_speed.sql     ← VC events migration
├── .env.example
├── Dockerfile
├── package.json
├── tsconfig.json
└── drizzle.config.ts               ← Drizzle ORM config
```
