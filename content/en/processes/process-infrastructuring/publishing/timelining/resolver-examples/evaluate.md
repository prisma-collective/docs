### Evaluate

Repo: [evaluate](https://github.com/prisma-collective/evaluate). Topic: `_botEvaluation` (ingest only in config today).

Evaluate reads the same Neo4j embeddings timelining writes — `/api/rag` runs retrieval presets over voice, page, and enrolment subgraphs. It does not receive resolve triggers from timelining; it is a **downstream consumer** of the core pipeline.

This will soon be upgraded to write resolved `evaluation` nodes to the database also.