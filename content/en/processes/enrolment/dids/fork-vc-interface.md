---
sidebarTitle: 'Fork: VC Interface'
---
# VC Interface Fork Guide

How to fork, customize, and deploy the Prisma DIDs **VC Interface** for your organization.

---

## Overview

The VC Interface (`apps/vc-interface/`) is a Next.js 16 app that lets users issue, hold, present, and verify Verifiable Credentials. Each organization runs its own instance with custom branding, credential types, and authorized issuers.

**Architecture:**
```
org-config.ts (your customization)
       ↓
resolve-config.ts (merges env vars at runtime)
       ↓
ThemeProvider → CSS custom properties → Tailwind classes
       ↓
Pages: /credentials, /issue, /manage, /verify
```

---

## Quick Start

```bash
# 1. Clone the monorepo
git clone https://github.com/your-org/prisma-DIDs.git
cd prisma-DIDs

# 2. Install dependencies
pnpm install

# 3. Build workspace packages (required before running)
pnpm --filter @prisma-events/dids-types build
pnpm --filter @prisma-events/dids-schemas build
pnpm --filter @prisma-events/dids-sdk build

# 4. Configure your instance
cp apps/vc-interface/.env.example apps/vc-interface/.env.local
# Edit .env.local with your values

# 5. Customize org-config.ts (see below)

# 6. Run dev server
pnpm --filter @prisma-events/dids-vc-interface dev
```

---

## Step 1: Customize `org-config.ts`

This is the **primary file you modify**. Located at `apps/vc-interface/config/org-config.ts`.

### Minimal Fork

Change the `defaultConfig` export:

```typescript
export const defaultConfig: VCInterfaceConfig = {
  // --- REQUIRED: Change these ---
  ORG_NAME: 'Your Organization',
  CREDENTIAL_TYPES: ['ContributionCredential'],    // Must match your schemas
  ISSUER_DIDS: ['did:cardano:stake_test1u...'],    // DIDs authorized to issue
  INDEXER_ENDPOINT: 'https://your-vc-indexer.up.railway.app',

  // --- USUALLY UNCHANGED ---
  DID_INDEXER_ENDPOINT: 'https://prisma-didsindexer-production.up.railway.app',
  NETWORK: 'preprod',

  // --- CUSTOMIZE: Brand colors ---
  THEME: {
    primary: '#7C3AED',       // Main accent color
    secondary: '#A855F7',     // Secondary accent
    background: '#0F0A1A',    // Page background
    surface: '#1A1425',       // Card/panel background
    text: {
      primary: '#F5F3FF',     // Main text
      secondary: '#C4B5FD',   // Secondary text
      muted: '#8B7AAF',       // Muted text
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
};
```

### What Each Field Does

| Field | Purpose | Example |
|-------|---------|---------|
| `ORG_NAME` | Displayed in navbar, page titles, metadata | `'Action Learning Journey'` |
| `CREDENTIAL_TYPES` | Which credential types users can issue | `['ContributionCredential']` |
| `ISSUER_DIDS` | Wallet DIDs authorized to see the Issue page | `['did:cardano:stake_test1u...']` |
| `INDEXER_ENDPOINT` | Your organization's VC Indexer URL | `'https://alj-vc-indexer-production.up.railway.app'` |
| `DID_INDEXER_ENDPOINT` | Global DID resolver (shared, rarely changed) | `'https://prisma-didsindexer-production.up.railway.app'` |
| `NETWORK` | Cardano network | `'preprod'` or `'mainnet'` |
| `THEME` | Full color scheme (see Theming below) | See example above |

### Example: ALJ Fork Config

```typescript
export const exampleALJConfig: VCInterfaceConfig = {
  ORG_NAME: 'Action Learning Journey',
  CREDENTIAL_TYPES: ['ContributionCredential'],
  ISSUER_DIDS: [
    'did:cardano:stake_test1uzalj_admin_1...',
    'did:cardano:stake_test1uzalj_admin_2...',
  ],
  INDEXER_ENDPOINT: 'https://alj-vc-indexer-production.up.railway.app',
  DID_INDEXER_ENDPOINT: 'https://prisma-didsindexer-production.up.railway.app',
  NETWORK: 'preprod',
  THEME: {
    primary: '#2563EB',       // Blue instead of purple
    secondary: '#3B82F6',
    background: '#0A0F1A',
    surface: '#111827',
    text: {
      primary: '#F9FAFB',
      secondary: '#93C5FD',
      muted: '#6B7280',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
};
```

---

## Step 2: Set Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Your organization's VC Indexer (deploy your own — see [VC Indexer Fork Guide](/processes/enrolment/dids/fork-vc-indexer))
NEXT_PUBLIC_VC_INDEXER_ENDPOINT=https://your-vc-indexer.up.railway.app

# Global DID Indexer (shared Prisma-operated instance, usually unchanged)
NEXT_PUBLIC_DID_INDEXER_ENDPOINT=https://prisma-didsindexer-production.up.railway.app

# Cardano network: preprod or mainnet
NEXT_PUBLIC_NETWORK=preprod

# Blockfrost API key (required for on-chain anchoring)
# Get one at https://blockfrost.io — must match NETWORK
NEXT_PUBLIC_BLOCKFROST_API_KEY=preprodXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Note:** `NEXT_PUBLIC_` prefix makes these available in both server and client code. Environment variables override `org-config.ts` values at runtime via `resolve-config.ts`.

---

## Step 3: Theming

### How It Works

```
org-config.ts THEME → ThemeProvider (React context)
       ↓
CSS custom properties (--theme-primary, --theme-background, ...)
       ↓
globals.css @theme block → Tailwind utility classes (bg-primary, text-surface, ...)
```

The `ThemeProvider` (from `@prisma-events/dids-ui`) sets CSS custom properties on `document.documentElement`. Tailwind v4's `@theme` block in `globals.css` maps these to utility classes:

```css
@theme {
  --color-primary: var(--theme-primary, #7C3AED);
  --color-secondary: var(--theme-secondary, #A855F7);
  --color-background: var(--theme-background, #0F0A1A);
  --color-surface: var(--theme-surface, #1A1425);
  /* ... etc */
}
```

### Available Theme Colors

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| `primary` | `--theme-primary` | Buttons, links, active states |
| `secondary` | `--theme-secondary` | Hover states, gradients |
| `background` | `--theme-background` | Page background |
| `surface` | `--theme-surface` | Cards, panels, modals |
| `text.primary` | `--theme-text-primary` | Headings, main content |
| `text.secondary` | `--theme-text-secondary` | Descriptions, labels |
| `text.muted` | `--theme-text-muted` | Timestamps, hints |
| `status.success` | `--theme-success` | Active status, confirmations |
| `status.warning` | `--theme-warning` | Pending status |
| `status.error` | `--theme-error` | Errors, revoked status |

### Tips

- Use sufficient contrast between `background` and `textPrimary` (WCAG AA)
- `surface` should be slightly lighter than `background` for card elevation
- `primary` is used extensively — pick your brand's primary color

---

## Step 4: Internationalization (Optional)

The app supports 3 locales: English (en), Portuguese (pt-BR), and Spanish (es).

**Message files:** `apps/vc-interface/messages/`
- `en.json` — 160 translation keys
- `pt-BR.json`
- `es.json`

### Customizing Translations

Edit the relevant JSON file. Key sections:

```json
{
  "common": { "loading": "Loading...", "error": "Error" },
  "nav": { "credentials": "My Credentials", "issue": "Issue" },
  "issuance": { "title": "Issue Credential", "submit": "Issue & Anchor" },
  "types": { "ContributionCredential": "Contribution" }
}
```

### Adding a New Locale

1. Create `messages/fr.json` with all keys
2. Update `i18n/request.ts` to include `'fr'` in the supported locales array
3. Update `LanguageSwitcher` component if needed

---

## Step 5: Adding Custom Credential Types

If your organization uses credential types beyond `ContributionCredential`:

1. **Define the schema** in `packages/schemas/` (see [Credential Schemas](/processes/enrolment/dids/credential-schemas))
2. **Register** it in the schema registry
3. **Update `org-config.ts`** — add the type to `CREDENTIAL_TYPES`
4. **Update UI forms** — add issuance form fields for the new type
5. **Update translations** — add `types.YourCredential` to all locale files

---

## Deployment to Vercel

### Prerequisites
- Vercel account linked to your Git repo
- Environment variables set in Vercel dashboard

### Steps

```bash
# 1. Push your fork to GitHub
git push origin main

# 2. Import project in Vercel
# - Root Directory: apps/vc-interface
# - Framework: Next.js (auto-detected)
# - Build Command: (use default)
# - Install Command: pnpm install

# 3. Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_VC_INDEXER_ENDPOINT
# NEXT_PUBLIC_DID_INDEXER_ENDPOINT
# NEXT_PUBLIC_NETWORK
# NEXT_PUBLIC_BLOCKFROST_API_KEY
```

### Monorepo Build Settings

Since this is a Turborepo monorepo, Vercel needs to build workspace dependencies. The `next.config.js` already configures `transpilePackages`:

```javascript
transpilePackages: [
  '@prisma-events/dids-types',
  '@prisma-events/dids-schemas',
  '@prisma-events/dids-sdk',
  '@prisma-events/dids-ui',
],
```

### Custom Domain

In Vercel project settings, add your custom domain (e.g., `vc.your-org.io`).

---

## What NOT to Modify

To preserve upstream compatibility and easy updates:

| File/Area | Reason |
|-----------|--------|
| `services/vcService.ts` | Core SDK integration — shared VC logic |
| `services/credentialStore.ts` | localStorage persistence — standard format |
| `contexts/WalletContext.tsx` | CIP-30 wallet standard — universal |
| `app/api/verify/route.ts` | Server-side COSE_Sign1 verification |
| `VCInterfaceConfig` interface | Breaking the interface breaks resolve-config |
| Package imports from `@prisma-events/*` | Upstream SDK compatibility |

---

## File Reference

```
apps/vc-interface/
├── config/
│   ├── org-config.ts          ← YOUR MAIN CUSTOMIZATION FILE
│   └── resolve-config.ts      ← Merges env vars (don't modify)
├── .env.example               ← Template for .env.local
├── app/
│   ├── layout.tsx             ← Root layout (ThemeProvider, WalletProvider)
│   ├── page.tsx               ← Home page (hero, nav cards)
│   ├── credentials/page.tsx   ← Holder's credential inbox
│   ├── issue/page.tsx         ← Issuer's credential form
│   ├── manage/page.tsx        ← Revocation management
│   ├── verify/page.tsx        ← Verifier's verification page
│   └── api/verify/route.ts    ← Server-side COSE_Sign1 verify
├── components/                ← Page-specific components
├── contexts/
│   └── WalletContext.tsx      ← CIP-30 wallet integration
├── services/
│   ├── vcService.ts           ← SDK wrappers (issue, present, verify, revoke)
│   └── credentialStore.ts     ← localStorage credential persistence
├── messages/
│   ├── en.json                ← English translations
│   ├── pt-BR.json             ← Portuguese translations
│   └── es.json                ← Spanish translations
├── i18n/
│   └── request.ts             ← Locale configuration
├── types/
│   └── vc.ts                  ← UI types (re-exports from @prisma-events/dids-schemas)
├── next.config.js             ← WASM support, transpile workspace packages
├── package.json
└── postcss.config.mjs         ← Tailwind v4 PostCSS plugin
```
