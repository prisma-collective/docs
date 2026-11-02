---
sidebarTitle: Validation
---

# Stack validation and capability resolution

Propagate owns integrity of the whole deployment stack. `propagate validate` checks schemas, dependencies, and capability closure before any `apply`.

## Validation modes

### Full validation

```
propagate validate
```

Runs all checks and writes `.propagate/resolved.json` on success.

### Schema only

```
propagate validate --schema-only
```

Validates `stack.yaml` structure only. Useful before `app.manifest.yaml` files exist in app repos.

## Checks performed

1. **Stack schema** — `stack.yaml` conforms to Zod schema (`apiVersion`, metadata, `dns.eventCode`, provider, apps)
2. **Catalog membership** — each app slug exists in `catalog/apps.yaml` and is deployable
3. **App manifests** — `app.manifest.yaml` present at each app repo root
4. **Dependency graph** — `dependsOn` is acyclic; topological sort produces deploy order
5. **Capability closure** — every `requires` capability has a matching `provides` (or user/generated source)
6. **User values** — all `source: user` capabilities have entries in `values.yaml`
7. **Provider credentials** — warning if GitHub App not installed, legacy PAT present, org mismatch, or no Vercel token in `credentials.json` / `VERCEL_TOKEN` env
8. **Deploy codemods** — warning if `deploy.codemods` declared without `deploy.workflow`, or codemod files missing on disk

## Capability resolution

After validation passes, the resolver:

1. Sorts apps by `dependsOn` (docs before timelining)
2. Derives per-app URLs: `https://{appSlug}.{eventCode}.{hostName}`
3. Fills `derivable` env vars (e.g. `DOCS_APP_URL` from `docs.web`)
4. Generates shared tokens (e.g. `PRIVATE_API_TOKEN` for infra API auth between apps)
5. Maps `capability` sources across apps (timelining `DOCS_APP_URL` ← docs deploy URL)

### Example resolution (docs + timelining)

| App | Key env vars | Source |
|-----|--------------|--------|
| docs | `PRIVATE_API_TOKEN` | generated |
| timelining | `DOCS_APP_URL` | capability ← docs.web |
| timelining | `PRIVATE_API_TOKEN` | generated (same token as docs) |
| timelining | `TELEGRAM_BOT_TOKEN` | user (`values.yaml`) |
| timelining | `KV_REST_*` | provisioned (override via `upstash.kv` in values) |
| timelining | `NEO4J_*` | provisioned (override via `neo4j.connection` in values) |

## `resolved.json` output

Written to `.propagate/resolved.json` and consumed by `propagate apply`:

```json
{
  "stack": { "...": "..." },
  "deploymentOrder": ["docs", "timelining"],
  "apps": [
    {
      "slug": "docs",
      "url": "https://docs.argentina-alj.prisma.events",
      "domain": "docs.argentina-alj.prisma.events",
      "env": { "PRIVATE_API_TOKEN": "..." },
      "workflow": null,
      "codemods": []
    },
    {
      "slug": "timelining",
      "url": "https://timelining.argentina-alj.prisma.events",
      "domain": "timelining.argentina-alj.prisma.events",
      "env": { "DOCS_APP_URL": "...", "TELEGRAM_BOT_TOKEN": "..." },
      "workflow": "propagate-codemods",
      "codemods": ["propagate/codemods/01-hobby-cron.mjs"],
      "provision": [
        { "id": "upstash.kv", "provisioner": "vercel.upstash-kv" },
        { "id": "neo4j.connection", "provisioner": "railway.neo4j", "dockerPath": ".docker" }
      ]
    }
  ],
  "generated": { "docs.infra_token": "..." },
  "errors": [],
  "warnings": []
}
```

## Dependencies

timelining **hard-depends** on docs APIs (`dependsOn: [docs]`). Deploy docs first, then timelining. There is no reverse dependency from docs to timelining.

## Failure messages

Common validation failures:

| Error | Remedy |
|-------|--------|
| Missing `app.manifest.yaml` | Run agent task (`AGENT_PREPARE_APPS.md`) |
| Cyclic `dependsOn` | Fix manifest dependency graph |
| Missing user capability | Re-run `propagate create` or edit `values.yaml` |
| No provider for capability | Add `provides` in another app's manifest |
| GitHub App not installed | Run `propagate auth github` |
| GitHub App org mismatch | Re-install on correct target org |
| Invalid `eventCode` | Must be DNS-safe lowercase `[a-z0-9-]` |

## Diff and drift

```
propagate diff
```

Two comparisons:

1. **Manifest** — current `stack.yaml` vs `.propagate/last-applied/stack.yaml`
2. **Infrastructure** — `pulumi preview` against live GitHub/Vercel state
