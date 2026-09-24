---
sidebarTitle: Resolver Examples
asIndexPage: true
---
## Resolvers

Resolvers extend timelining by defining and writing node types for certain actions to be resolved to. While timelining forwards live webhooks or triggers resolve (`POST ?entryId=`), the process of extraction from the transcripts with the use of channel-specific schemas lives in these domain-specific sibling apps. These sibling apps, containing resolvers, have their own logic, yet all share the same [neo4j](/en/processes/process-infrastructuring/propagate/neo4j) graph database that's part of the hub's [publishing stack](/en/patterns/case-study).

Which channels are dedicated to which resolvers is defined in the [organising config](/processes/process-infrastructuring/publishing/timelining/organising-config). The role of the resolvers is to discretize the free-form UX of sending an audio into distinct channel-specific artefacts, whose shape is defined by the channel-specific schemas. These schemas define the shape of the nodes in the graph database. 

![resolvers](/resolvers.png)
## Examples

These sibling apps have been built to resolve contributions within the domains of our [core organising processes](/processes), which have been developed over time by multiple event facilitators contributing to the underlying design logic. However, timelining can be applied to all kinds of domains, with resolver logic living in sovereign apps. 

- [Enrol](/en/processes/process-infrastructuring/publishing/timelining/resolver-examples/enrol)
- [Enact](/en/processes/process-infrastructuring/publishing/timelining/resolver-examples/enact)
- [Evaluate](/en/processes/process-infrastructuring/publishing/timelining/resolver-examples/evaluate)
## Boundary summary

| Concern                                                      | Owner                                |
| ------------------------------------------------------------ | ------------------------------------ |
| Webhook, backlog, Neo4j entry, transcription, embeddings     | **timelining**                       |
| Live Telegram UX, forms, auxiliary services (luma, rag etc.) | **sibling** (forward)                |
| Schema extraction, domain graph, resolve backlog             | **sibling** (resolve)                |

