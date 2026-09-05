---
sidebarTitle: Pipeline
---

# Core pipeline

Timelining ingests Telegram contributions, stores them in Neo4j, and vectorises text for retrieval. That is the **core workflow**. Dispatch to sibling resolvers is separate — see [Resolvers](/processes/process-infrastructuring/publishing/timelining/resolver-examples).

## Overview

```
Telegram (_bot* topic)
  → Ingest webhook → Redis → Neo4j Entry
  → Vectorise transcribe → chunk → embed
  → Neo4j (graph + vector index)
       ↳ consumed by evaluate (RAG), visualise APIs, etc.
```

Chained HTTP (`mode=chain`) handles the happy path; Vercel crons sweep backlogs and failed queues.

## Modules

| Page | Stage | Code |
|------|-------|------|
| [Ingest](/processes/process-infrastructuring/publishing/timelining/ingest) | Webhook, Redis backlog, Neo4j write | `services/ingest/`, `api/story/webhook` |
| [Vectorise](/processes/process-infrastructuring/publishing/timelining/vectorise) | Transcribe, chunk, embed | `services/vectorise/` |
| [Organising config](/processes/process-infrastructuring/publishing/timelining/organising-config) | Topic → sibling routing | `organising.config.ts` |
| [Resolvers](/processes/process-infrastructuring/publishing/timelining/resolver-examples) | Forward + resolve dispatch | `services/resolve/`, `services/webhook/` |

Shared infrastructure: `services/pipeline/` (routing, execute, retry), `lib/db/neo4j.ts`.

## Infrastructure

| Dependency | Role |
|------------|------|
| Upstash Redis | Backlog + failed queues |
| Neo4j (Railway) | Graph + embeddings |
| OpenAI | Whisper + embeddings |
| Vercel | Serverless routes + crons |

Deploy via [propagate](/processes/process-infrastructuring/propagate) (`app.manifest.yaml`).

## Evolution from earlier docs

Previous documentation described webhook → Redis worker → Neo4j as a two-step ingest. Purpose unchanged; current version adds inline chaining, vector stages, Neo4j vector indexes, and [organising config](/processes/process-infrastructuring/publishing/timelining/organising-config) for sibling integration. Older references to PostgreSQL/pgvector or S3-first storage are superseded.
