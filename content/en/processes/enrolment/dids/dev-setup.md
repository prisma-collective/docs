---
sidebarTitle: Developer Setup
---
# Prisma DIDs — Developer Environment Setup

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **PostgreSQL** 15+ (local or Docker — only needed if running the indexer locally)
- **Cardano wallet** browser extension (Nami, Eternl, Lace, etc.) with Preprod tADA

### Shared API Keys (Preprod)

Obtain team-shared keys from the project password manager or request access from the DIDs maintainers.

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd prisma-DIDs
pnpm install
```

## 2. Build Packages (required before running any app)

```bash
pnpm build
```

Or individually (order matters):

```bash
pnpm --filter @prisma-events/dids-types build
pnpm --filter @prisma-events/dids-schemas build
pnpm --filter @prisma-events/dids-sdk build
pnpm --filter @prisma-events/dids-ui build
```

---

## 3. Environment Files

### `apps/dashboard/.env.local`

Copy-paste ready:

```env
BLOCKFROST_PREPROD_KEY=preprodYOUR_BLOCKFROST_KEY
NEXT_PUBLIC_BLOCKFROST_PREPROD_KEY=preprodYOUR_BLOCKFROST_KEY
NEXT_PUBLIC_PINATA_JWT=YOUR_PINATA_JWT
INDEXER_URL_PREPROD=https://prisma-didsindexer-production.up.railway.app
NEXT_PUBLIC_DEFAULT_NETWORK=preprod
```

### `apps/vc-interface/.env.local`

Copy-paste ready:

```env
NEXT_PUBLIC_VC_INDEXER_ENDPOINT=https://alj-vc-indexer-production.up.railway.app
NEXT_PUBLIC_DID_INDEXER_ENDPOINT=https://prisma-didsindexer-production.up.railway.app
NEXT_PUBLIC_NETWORK=preprod
NEXT_PUBLIC_BLOCKFROST_API_KEY=preprodYOUR_BLOCKFROST_KEY
NEXT_PUBLIC_PINATA_JWT=YOUR_PINATA_JWT
```

### `apps/indexer/.env`

Copy-paste ready (for local development — uses local Postgres):

```env
DATABASE_URL=postgresql://postgres:test@localhost:5432/prisma_dids
BLOCKFROST_API_KEY=preprodYOUR_BLOCKFROST_KEY
INDEXER_CONFIG=did
PORT=3001
HOST=0.0.0.0
POLL_INTERVAL_MS=30000
CONFIRMATION_DEPTH=10
```

---

## 4. Running the Apps

### DID Dashboard (port 3000)

```bash
pnpm --filter dashboard dev
```

### VC Interface (port 3001)

```bash
pnpm --filter vc-interface dev
```

### Indexer (port 3001, local — needs Postgres)

```bash
# Create the database
createdb prisma_dids

# Run migrations
cd apps/indexer && npx drizzle-kit push && cd ../..

# Start
pnpm --filter indexer dev
```

> **Note:** You likely don't need to run the indexer locally — the deployed instances on Railway are live and can be used directly via the URLs above.

---

## 5. Variable Reference

### Dashboard

| Variable | Visibility | Required | Default | Purpose |
|----------|-----------|----------|---------|---------|
| `NEXT_PUBLIC_BLOCKFROST_PREPROD_KEY` | Client | Yes | — | Blockfrost Preprod key for Lucid tx submission |
| `NEXT_PUBLIC_BLOCKFROST_MAINNET_KEY` | Client | No | — | Blockfrost Mainnet key (when running on mainnet) |
| `NEXT_PUBLIC_PINATA_JWT` | Client | Yes | — | Pinata JWT for DID document IPFS pinning |
| `NEXT_PUBLIC_DEFAULT_NETWORK` | Client | No | `preprod` | Which Cardano network to use |
| `INDEXER_URL_PREPROD` | Server | Yes | — | DID Indexer API for Preprod (used by `/api/did/[did]` proxy) |
| `INDEXER_URL_MAINNET` | Server | No | — | DID Indexer API for Mainnet |

### VC Interface

| Variable | Visibility | Required | Default | Purpose |
|----------|-----------|----------|---------|---------|
| `NEXT_PUBLIC_VC_INDEXER_ENDPOINT` | Client | Yes | org-config.ts | VC Indexer URL (overrides org-config) |
| `NEXT_PUBLIC_DID_INDEXER_ENDPOINT` | Client | Yes | org-config.ts | Global DID Indexer URL (for verification flow) |
| `NEXT_PUBLIC_NETWORK` | Client | No | `preprod` | Cardano network |
| `NEXT_PUBLIC_BLOCKFROST_API_KEY` | Client | Yes | — | Blockfrost key for VC anchor transactions |
| `NEXT_PUBLIC_PINATA_JWT` | Client | Yes | — | Pinata JWT for VC credential IPFS pinning |
| `NEXT_PUBLIC_DASHBOARD_URL` | Client | No | `http://localhost:3000` | DID Dashboard link in credential details |

### Indexer

| Variable | Visibility | Required | Default | Purpose |
|----------|-----------|----------|---------|---------|
| `DATABASE_URL` | Server | Yes | — | PostgreSQL connection string |
| `BLOCKFROST_API_KEY` | Server | Yes | — | Blockfrost key (must match network) |
| `INDEXER_CONFIG` | Server | No | `did` | Config to load: `did`, `vc`, or `alj-vc-indexer` |
| `NETWORK` | Server | No | `preprod` | Cardano network |
| `PORT` | Server | No | `3001` | HTTP server port |
| `HOST` | Server | No | `0.0.0.0` | HTTP server bind address |
| `POLL_INTERVAL_MS` | Server | No | `30000` | Chain polling interval (ms) |
| `CONFIRMATION_DEPTH` | Server | No | `10` / `112` | Blocks behind tip for confirmation |
| `LOG_LEVEL` | Server | No | `info` | Pino log level |
| `NODE_ENV` | Server | No | — | `production` disables pretty logging |

---

## 6. Live Deployments (Railway)

| Service | URL | Config |
|---------|-----|--------|
| **DID Indexer** | `https://prisma-didsindexer-production.up.railway.app` | `INDEXER_CONFIG=did` |
| **ALJ VC Indexer** | `https://alj-vc-indexer-production.up.railway.app` | `INDEXER_CONFIG=alj-vc-indexer` |

Both indexers expose `/health` for status checks.

---

## 7. Quick Smoke Test

```bash
# Check DID Indexer is live
curl https://prisma-didsindexer-production.up.railway.app/health

# Check VC Indexer is live
curl https://alj-vc-indexer-production.up.railway.app/health

# Resolve a DID
curl https://prisma-didsindexer-production.up.railway.app/did/did:cardano:stake_test1uqpy925r2vmmfagf2de5xjqa360gaz5c7xlsl5a3zy7klscjvwfdp
```

---

## 8. Project Structure

```
prisma-DIDs/
├── apps/
│   ├── dashboard/        # DID Dashboard (Next.js 16, port 3000)
│   ├── vc-interface/     # VC Interface (Next.js 16, port 3001)
│   └── indexer/          # DID/VC Indexer (Fastify 5, Drizzle, PostgreSQL)
├── packages/
│   ├── ui/               # Shared Tailwind component library
│   ├── sdk/              # Core DID + VC SDK
│   ├── schemas/          # VC credential schemas + registry
│   └── types/            # Shared TypeScript types
└── documentation/        # Technical design, plans, checklists
```
