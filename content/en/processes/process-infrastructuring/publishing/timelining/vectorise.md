---
sidebarTitle: Vectorise
---

# Vectorise

Second stage of the [core pipeline](/processes/process-infrastructuring/publishing/timelining/pipeline): turn stored text (and voice transcripts) into chunked vector embeddings in Neo4j.

## Voice path

After ingest creates a Voice node:

```
/api/story/voice-vectorise?voiceId=…&mode=chain
  → transcribe (Whisper, ≤180s inline)
  → triggerResolve (if channel has resolve route)
  → vectorise (chunk + embed)
```

Long voice (>180s): marked `deferred_long`, handled by Railway transcribe service (`.transcribe/`), then vectorised on return.

Cron routes: `/api/story/voice-vectorise`, `/api/story/transcribe` sweep pending and failed work.

## Other sources

Same embedding utilities (`services/vectorise/shared/`):

| Source | Ingest route | Vectorise route |
|--------|--------------|-----------------|
| Docs pages | `/api/docs/ingest` | `/api/story/page-vectorise` |
| Resources (e.g. YouTube) | via enact resolve | `/api/story/resource-vectorise` |

All write to Neo4j vector indexes for downstream apps like [evaluate](/processes/evaluation) (`/api/rag`).

## Storage

Embeddings and chunks live on Neo4j nodes — not a separate vector DB. Requires `OPENAI_API_KEY` for Whisper and embeddings.

Failed transcribe/vectorise stages queue to `timelining::transcribe::failed`.

## Code

`src/services/vectorise/` — `voice/`, `page/`, `resource/`, `shared/`
