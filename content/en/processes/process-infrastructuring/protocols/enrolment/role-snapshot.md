---
sidebarTitle: Role Snapshot
---

```json
{
  "intent": "<extracted>"
}
```

Populated by the resolver (not extracted from user text):

- `protocolDomain`, `protocolVersion`, `protocolCommitSha` — protocol channel identity at interpretation time
- `nodeSchemaCommitShas` — git commit per node schema file used (`role`, `role_snapshot`, `participant`, `organisation`)
- `protocolNodes` — node schema definitions used during extraction
- `extractedByNode` — full per-node extraction result
- `sourceKind` — `voice` or `text`
- `recordedAt` — when the snapshot was written
