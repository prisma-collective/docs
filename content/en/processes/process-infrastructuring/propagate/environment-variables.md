# Propagate environment variables

Definitive reference derived from the [`propagate`](https://github.com/prisma-collective/propagate) monorepo source (not from any local `.env.local`). Variables are grouped by **where they must be set**.

| Where | Package / runtime | Purpose |
|-------|-------------------|---------|
| **Auth server** | `packages/web` on `propagate.prisma.events` | Browser OAuth, CLI session polling, GitHub App token minting |
| **Operator CLI** | `packages/cli` on the facilitator machine | Point CLI at auth server, DNS hostname, optional local GitHub App fallback |
| **Pulumi apply** | `packages/infra` (injected by CLI during `apply` / `destroy`) | Fork repos, create Vercel projects, inject app env |
| **Deployed apps** | Per-app Vercel projects | From `values.yaml` capabilities — **not** Propagate runtime env |

Credential files (`.propagate/credentials.json`) store OAuth results and installation refs; they are documented in [CLI reference](/processes/process-infrastructuring/propagate/cli).

---

## Auth server (`packages/web`)

Required for production at **https://propagate.prisma.events**. Set in the Vercel project that hosts `@propagate/web`.

### Session store (required)

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `KV_REST_API_URL` | **Yes** | Upstash Redis REST endpoint for short-lived CLI sessions (GitHub install, Vercel connect, wallet login poll state) | `packages/web/src/lib/redis.ts` |
| `KV_REST_API_TOKEN` | **Yes** | Bearer token for Upstash | `packages/web/src/lib/redis.ts` |

### Propagate GitHub App (required)

Used to mint **installation access tokens** for `POST /api/github/cli/token` (called by `propagate apply`).

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `GITHUB_APP_ID` | **Yes** | Numeric GitHub App ID | `packages/web/src/lib/github-app.ts`, `packages/core/src/github-app-token.ts` |
| `GITHUB_PRIVATE_KEY` | **Yes** | PEM private key for the app (multiline or `\n`-escaped single line; PKCS#1 or PKCS#8). Normalized by `normalizeGithubPrivateKey()` | `packages/web/src/lib/github-app.ts`, `packages/core/src/github-app-key.ts` |
| `GITHUB_APP_SLUG` | No | GitHub App **slug** for install URLs (e.g. `Potentialise-Deploy`). Default: `Potentialise-Deploy` | `packages/web/src/lib/github-session.ts` → `getGithubInstallUrl()` |

**Install URL pattern:** `https://github.com/apps/{slug}/installations/new`

**GitHub App Setup URL / callback:** `{PROPAGATE_PUBLIC_URL}/api/github/install/callback`

### GitHub user OAuth (required for Vercel connect browser step)

Classic OAuth app credentials used on `/cli-vercel-connect` to verify the Vercel GitHub App on the target org via the **user’s** token (not the Propagate App PEM).

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `GITHUB_OAUTH_CLIENT_ID` | **Yes** | OAuth App client ID (authorize URL built server-side) | `packages/web/src/lib/github-user-oauth.ts` |
| `GITHUB_OAUTH_CLIENT_SECRET` | **Yes** | OAuth App client secret (server token exchange) | `packages/web/src/lib/github-user-oauth.ts` |

**Callback URL to register on the OAuth App:** `{PROPAGATE_PUBLIC_URL}/github/oauth/callback`

### Vercel integration OAuth (required for `propagate auth vercel`)

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `VERCEL_INTEGRATION_CLIENT_ID` | **Yes** | Integration OAuth client ID | `packages/web/src/lib/vercel-oauth.ts` |
| `VERCEL_INTEGRATION_CLIENT_SECRET` | **Yes** | Integration OAuth client secret (token exchange) | `packages/web/src/lib/vercel-oauth.ts` |
| `VERCEL_INTEGRATION_SLUG` | No | If set, authorize via `vercel.com/integrations/{slug}/new` instead of raw OAuth URL | `packages/web/src/lib/vercel-oauth.ts` |
| `VERCEL_OAUTH_SCOPE` | No | OAuth scopes requested from Vercel. Default: `read write`. Must include marketplace/storage permissions configured on the integration for Upstash provisioning | `packages/web/src/lib/vercel-oauth.ts` |
| `PROPAGATE_PUBLIC_URL` | **Recommended** | Canonical base URL for OAuth redirect URIs and CLI browser links. Default: `https://propagate.prisma.events` | `packages/web/src/lib/vercel-oauth.ts`, `packages/web/src/app/api/*/cli/init/route.ts`, `packages/web/src/app/api/vercel/cli/session/route.ts` |

**Redirect URI registered on the Vercel integration:** `{PROPAGATE_PUBLIC_URL}/vercel/oauth/callback`

The operator's Vercel OAuth token (stored in `credentials.json` after `propagate auth vercel`) must be allowed to call Vercel marketplace/storage APIs. Enable Integrations / Marketplace scopes on the Propagate integration in the [Vercel Integrations Console](https://vercel.com/dashboard/integrations), then re-run `propagate auth vercel`.

### Railway connect (required for `propagate auth railway`)

Browser wizard at `/cli-railway-connect`. Session endpoints mirror the GitHub/Vercel CLI flows:

| Route | Role |
|-------|------|
| `POST /api/railway/cli/init` | Create connect session; return browser URL |
| `GET /api/railway/cli/session` | Poll session state from browser page |
| `POST /api/railway/cli/complete` | Submit Railway GitHub App install + API token |
| `GET /api/railway/cli/status` | CLI polling until connect complete |

The wizard guides installation of the [Railway GitHub App](https://github.com/apps/railway-app/installations/new) and collection of a Railway account API token (**No workspace** scope). No auth-server env vars beyond the shared session store (`KV_REST_*`) are required for Railway connect.

### Wallet login / register API (required in production)

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `REGISTER_API_TOKEN` | **Yes** | Bearer token for `register.prisma.events` wallet authorization API (enrol app). Required in production **and** local dev | `packages/web/src/lib/register-auth.ts` |
| `REGISTER_API_URL` | No | Base URL for register API. Default: `https://register.prisma.events` | `packages/web/src/lib/register-auth.ts` |
| `PROPAGATE_AUTH_ACCESS` | No | Query param `access=` when calling register API. Default: `propagate` | `packages/web/src/lib/register-auth.ts` |

Wallet authorization is checked via the enrol/register API only — there is no local static allowlist or database.

---

## Operator CLI (`packages/cli` + `packages/core`)

Set on the facilitator machine (shell env or `~/.propagate/config.yaml` for some values).

### Auth server targeting

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `PROPAGATE_AUTH_URL` | No | Base URL for all remote auth API calls (`/api/github/cli/*`, `/api/vercel/cli/*`, `/api/auth/cli/*`). Default: `https://propagate.prisma.events` or `authUrl` in `~/.propagate/config.yaml` | `packages/core/src/config.ts` → `getAuthUrl()`; consumed by `packages/cli/src/auth/*.ts` |

Use the **same** value for `login`, `auth github`, `auth vercel`, and `apply` in a given session.

### DNS / stack metadata

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `PROPAGATE_HOST_NAME` | No | Base domain for deployed app URLs: `https://{appSlug}.{eventCode}.{hostName}`. Written into workspace metadata during `propagate init` | `packages/core/src/dns.ts`, `packages/core/src/workspace.ts`, `packages/core/src/capability.ts` (via resolved `NEXT_PUBLIC_APP_URL` on apps) |

### Vercel token fallback

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `VERCEL_TOKEN` | No | Fallback if `.propagate/credentials.json` has no `vercelToken`. Normally set by `propagate auth vercel` into credentials | `packages/cli/src/auth/ensure-vercel.ts`, `packages/cli/src/commands/apply.ts`, `packages/cli/src/commands/destroy.ts`, `packages/core/src/credentials.ts`, `packages/core/src/validate.ts` |

Prefer credentials file after successful `auth vercel`.

### Local GitHub App token mint (dev fallback)

When the auth server cannot mint tokens (e.g. broken `GITHUB_PRIVATE_KEY` on production), the CLI falls back to local signing.

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `GITHUB_APP_ID` | No* | Same as auth server | `packages/core/src/github-app-token.ts` |
| `GITHUB_PRIVATE_KEY` | No* | Same as auth server | `packages/core/src/github-app-token.ts` |

\*Required only for local fallback. In monorepo dev, `loadGithubAppEnvFromDevFile()` also reads `GITHUB_APP_ID` and `GITHUB_PRIVATE_KEY` from `packages/web/.env.local` or repo-root `.env.local` if unset in the environment.

### Pulumi CLI tooling

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `PULUMI_BIN` | No | Absolute path to `pulumi` binary if not on `PATH` | `packages/core/src/pulumi.ts` |
| `PULUMI_CONFIG_PASSPHRASE` | No | Overrides passphrase file at `.propagate/pulumi-passphrase`. If unset, CLI auto-generates and persists a passphrase file | `packages/core/src/paths.ts` → `ensurePulumiPassphrase()`; set by CLI when spawning Pulumi in `apply`, `destroy`, `status`, `diff` |

`PULUMI_BACKEND_URL` is **computed** by the CLI (`file://…/.propagate/pulumi-state`) and passed to the Pulumi subprocess — operators do not set it directly.

### OS / home directory

| Variable | Required | Role | Used in |
|----------|----------|------|---------|
| `HOME` / `USERPROFILE` | No | Locates `~/.propagate/config.yaml` and `~/.propagate/session.json` | `packages/core/src/paths.ts` |

---

## Pulumi runtime (`packages/infra`)

Set **only by the CLI** when running `propagate apply` or `propagate destroy`. Operators do not configure these manually except indirectly via credentials + stack.

| Variable | Required | Role | Set by | Used in |
|----------|----------|------|--------|---------|
| `PROPAGATE_RESOLVED_PATH` | **Yes** | Absolute path to `.propagate/resolved.json` | `packages/cli/src/commands/apply.ts`, `destroy.ts` | `packages/infra/src/index.ts` |
| `PROPAGATE_CATALOG_PATH` | No | Path to `catalog/apps.yaml`. Default: repo catalog | `apply.ts`, `destroy.ts` | `packages/infra/src/index.ts` |
| `GITHUB_TOKEN` | **Yes** | GitHub App **installation** token (minted via auth server or local fallback) | `apply.ts`, `destroy.ts` | `packages/infra/src/index.ts`, `github-fork.ts` |
| `VERCEL_API_TOKEN` | **Yes** | Vercel API token for team in `stack.yaml` | `apply.ts`, `destroy.ts` | `packages/infra/src/index.ts`, `vercel-deploy.ts` |
| `RAILWAY_API_TOKEN` | Conditional | Railway account token when Neo4j provisioning is required. Create with **No workspace** scope at [railway.com/account/tokens](https://railway.com/account/tokens). Do not use project tokens (`RAILWAY_TOKEN` from `railway link`). | `apply.ts`, `destroy.ts` | `packages/infra/src/index.ts`, `railway-neo4j.ts` |
| `VERCEL_TOKEN` | No | Alias accepted by infra if `VERCEL_API_TOKEN` unset | `destroy.ts` (conditional) | `packages/infra/src/index.ts` |
| `PULUMI_BACKEND_URL` | **Yes** | Local file backend for stack state | CLI (`getPulumiBackendUrl`) | Pulumi subprocess |
| `PULUMI_CONFIG_PASSPHRASE` | **Yes** | Encrypt local Pulumi secrets | CLI (`ensurePulumiPassphrase`) | Pulumi subprocess |

---

## Deployed application env (not Propagate runtime)

These are **not** read by Propagate itself. They are collected during `propagate create` into `.propagate/values.yaml` and injected into **deployed** Vercel projects via Pulumi.

Examples from `packages/cli/src/commands/create.ts` when `timelining` is selected:

| Capability key | Env vars injected | Purpose |
|----------------|-------------------|---------|
| `telegram.bot_token` | `TELEGRAM_BOT_TOKEN` | Timelining bot |
| `openai.api_key` | `OPENAI_API_KEY` | Timelining LLM |
| `upstash.kv` | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Timelining Redis — **provisioned on apply** unless overridden in values |
| `neo4j.connection` | `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` | Timelining graph DB — **provisioned on Railway** unless overridden in values |

Per-app requirements are declared in each repo’s `app.manifest.yaml`. See `AGENT_PREPARE_APPS.md` in the propagate repo and [Manifests](/processes/process-infrastructuring/propagate/manifests).

During capability resolution, apps that **provide** a `.web` route get `NEXT_PUBLIC_APP_URL` set to their computed deploy URL (`packages/core/src/capability.ts`).

---

## Credentials file vs environment

| Mechanism | Location | Holds |
|-----------|----------|--------|
| `.propagate/credentials.json` | Client workspace | `github` (installationId, credentialRef), `vercelToken`, `vercelConnection`, `railwayToken`, `railwayConnection` |
| `~/.propagate/session.json` | User home | Wallet login session after `propagate login` |
| `~/.propagate/config.yaml` | User home | Optional `authUrl`, `hostName` overrides |

Legacy fields still parsed: `githubToken` (PAT), `vercelGithubApp` (partial Vercel state).

---

## Production auth server checklist

Minimum env vars on the **propagate.prisma.events** Vercel project:

1. `KV_REST_API_URL`, `KV_REST_API_TOKEN`
2. `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, `GITHUB_APP_SLUG` (optional; default slug)
3. `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`
4. `VERCEL_INTEGRATION_CLIENT_ID`, `VERCEL_INTEGRATION_CLIENT_SECRET`, optional `VERCEL_INTEGRATION_SLUG`, optional `VERCEL_OAUTH_SCOPE`
5. `PROPAGATE_PUBLIC_URL=https://propagate.prisma.events`
6. `REGISTER_API_TOKEN` (+ optional `REGISTER_API_URL`, `PROPAGATE_AUTH_ACCESS`)

**Dashboard callbacks** must match `PROPAGATE_PUBLIC_URL`:

| Integration | URL |
|-------------|-----|
| Propagate GitHub App | `https://propagate.prisma.events/api/github/install/callback` |
| GitHub user OAuth App | `https://propagate.prisma.events/github/oauth/callback` |
| Vercel integration | `https://propagate.prisma.events/vercel/oauth/callback` |

After changing env vars on Vercel, **redeploy** the web app. Verify token mint:

```http
POST /api/github/cli/token
{ "installationId": <id>, "credentialRef": "<ref from credentials.json>" }
```

Success: `{ "token", "expiresAt" }`. Failure with PEM/DECODER detail: fix `GITHUB_PRIVATE_KEY` formatting.

---

## Local development

| Goal | Set |
|------|-----|
| Use local auth server | `PROPAGATE_AUTH_URL=http://localhost:3000` on CLI; run `pnpm dev:web` |
| Auth server env file | `packages/web/.env.local` (Next.js does not read repo-root `.env.local`) |
| Wallet login locally | `REGISTER_API_TOKEN` in `packages/web/.env.local`; wallet registered on register.prisma.events |
| Local OAuth redirects | `PROPAGATE_PUBLIC_URL=http://localhost:3000` if integration callbacks point at localhost |
| Local GitHub token mint | `GITHUB_APP_ID` + `GITHUB_PRIVATE_KEY` in `packages/web/.env.local` |
| Consistent auth host | Use the same `PROPAGATE_AUTH_URL` for `login`, `auth github`, `auth vercel`, and `apply` |
| Valid PEM formatting | `GITHUB_PRIVATE_KEY` must be valid PEM; bad formatting causes `DECODER routines::unsupported` |

---

## Migration (hard break)

Rename or remove legacy env vars on the auth server Vercel project:

| Remove / rename from | Set to |
|----------------------|--------|
| `NEXT_PUBLIC_GITHUB_APP_NAME` | `GITHUB_APP_SLUG` |
| `NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID` (+ other OAuth ID fallbacks) | `GITHUB_OAUTH_CLIENT_ID` |
| `GITHUB_CLIENT_SECRET` / `GITHUB_CLIENT_SECRET_OAUTH` | `GITHUB_OAUTH_CLIENT_SECRET` |
| `VERCEL_INTEGRATION_SECRET` | `VERCEL_INTEGRATION_CLIENT_SECRET` |
| `NEXT_PUBLIC_VERCEL_INTEGRATION_CLIENT_ID` | `VERCEL_INTEGRATION_CLIENT_ID` |
| `NEXT_PUBLIC_VERCEL_INTEGRATION_SLUG` | `VERCEL_INTEGRATION_SLUG` |
| `VERCEL_OAUTH_REDIRECT_URI(S)` | delete; set `PROPAGATE_PUBLIC_URL` |
| `PRISMA_POSTGRES_*` | delete (unused) |

---

## Variables **not** used by Propagate source

The following may appear in old operator notes but are **not referenced** in `packages/cli`, `packages/core`, `packages/web`, or `packages/infra`:

- `GITHUB_FORK_PAT`, `GITHUB_FORK_USERNAME`, `GITHUB_FORK_EMAIL` (legacy wizard / manual fork)
- `GITHUB_TOKEN` as a long-lived PAT on the operator machine (apply uses minted installation tokens instead)
- `NEXT_PUBLIC_APP_URL` on the auth server for OAuth (use `PROPAGATE_PUBLIC_URL`)

If adding new env vars, update this document and the auth server checklist above.
