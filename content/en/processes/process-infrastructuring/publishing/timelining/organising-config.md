---
sidebarTitle: Organising Config
---

# Organising config

`organising.config.ts` at the repo root is the single registry for how Telegram topics connect timelining to sibling organising apps. It is imported as `@organising-config` across webhook, pipeline, and resolve code.

## Why it exists

Every `_bot*` message is ingested into Neo4j regardless of config. The config only declares **which topics also participate in the wider organising system** — forwarding live webhooks for interactive bots, or triggering resolve workers after ingest/transcribe.

Adding a channel here is the integration point; domain logic stays in the sibling repo.

## Shape

```ts
ORGANISING_CONFIG = {
  enact:    { domain: '…', channels: { … } },
  enrol:    { domain: '…', channels: { … } },
  evaluate: { domain: '…', channels: { … } },
  envision: { domain: '…', channels: { … } },
}
```

Each channel specifies:

| Field | Meaning |
|-------|---------|
| `channel` | Telegram topic name (e.g. `_botAgendar`) |
| `aliases` | Alternate topic names |
| `forward` | Live webhook relay to sibling (`mode`: `all`, `replies_only`, `none`) |
| `resolve` | POST target after entry is ready (`path` on sibling domain) |

Helper exports: `channelSpecForTopic`, `forwardRouteForTopic`, `resolveRouteForTopic`, `resolveTopics`, queue name constants.

## Current channels (illustrative)

| App | Topic | Forward | Resolve |
|-----|-------|---------|---------|
| **enrol** | `_botEnrolment` | all → `/api/webhook` | `/api/webhook/resolve` |
| **enact** | `_botDecidir` | — | `/api/webhook/resolve/decide` |
| **enact** | `_botAgendar` | replies → `/api/webhook/resolve/schedule/update` | `/api/webhook/resolve/schedule` |
| **enact** | `_botRecursos` | — | `/api/webhook/resolve/resource` |
| **evaluate** | `_botEvaluation` | — | — |
| **envision** | `_botEnvisioning` | — | — |

Domains and paths are hub-specific after [propagating](/en/processes/process-infrastructuring/propagate); the structure is stable.

## Pipeline consumption

`services/pipeline/routing.ts` reads config to build action lists:

- **On receipt** — optional `forward-webhook`, always `dispatch-ingest` (non-replies)
- **After ingest** — `trigger-resolve` for text on resolve channels; `dispatch-transcribe` for voice

Reply messages skip ingest but may still forward (e.g. schedule updates on `_botAgendar`).

## Scope of this doc

Config covers routing only. Schemas, eligibility, backlog handling, and UI for each domain live in sibling repos — see [Resolvers](/processes/process-infrastructuring/publishing/timelining/resolver-examples).
