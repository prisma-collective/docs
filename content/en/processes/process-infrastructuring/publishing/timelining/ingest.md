---
sidebarTitle: Ingest
---

# Ingest

First stage of the [core pipeline](/processes/process-infrastructuring/publishing/timelining/pipeline): accept webhook payloads and write graph entries to Neo4j.

## Flow

```
POST /api/story/webhook
  → optional forward (see Resolvers)
  → lpush timelining::ingest::backlog
  → dispatch /api/story/ingest?limit=1&mode=chain
  → Neo4j Entry (+ Voice, Participant, Chat, …)
  → post-ingest actions (transcribe chain or resolve trigger)
```

Non-reply messages are queued and ingested. Replies may forward to siblings but skip the backlog.

## Webhook filter

Messages are processed when the chat is private, the topic name contains `_bot`, or the topic is `prisma_events_storying` (messages sent to bot directly).

## Ingest worker

`/api/story/ingest` pops the Redis backlog (`services/ingest/`):

- Maps Telegram payload → `FullEntryInputData` (`lib/db/mappers.ts`)
- Creates nodes via `entryService` / `lib/db/models/`
- Runs `pipelineActionsAfterIngest` — transcribe dispatch or resolve trigger

Modes: `chain` (one message, inline continuation), `batch` (cron sweep), `retry` (failed queue).

## Durability

| Queue | Purpose |
|-------|---------|
| `timelining::ingest::backlog` | Pending messages |
| `timelining::ingest::failed` | Write failures (retry cron) |

Redis is provisioned via propagate (`upstash.kv`). No separate setup doc needed.

## Code

`src/app/api/story/webhook/`, `src/services/ingest/`, `src/services/pipeline/routing.ts`
