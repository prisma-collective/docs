---
sidebarTitle: Workflows
---

# Deployment Workflow Framework (Vercel/Next.js)

## Overview

A client-coordinated deployment system that executes multi-step workflows for provisioning client applications using third-party APIs (e.g., GitHub, Vercel). Workflows are defined statically but executed dynamically with user-provided inputs. The system is serverless-compatible, modular, and supports asynchronous step execution.

---

## Architecture Summary

| Layer       | Role                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| **Client**  | Triggers and polls actions for each app using a workflow ID               |
| **API**     | `/api/deploy` handles triggering and polling per action                   |
| **Runtime** | Actions execute with isolated context (args/config/env)                   |
| **Store**   | Inputs, secrets, config, and per-app state cached or persisted externally |

---

## Execution Flow

### Client-Side

```ts
await triggerAndPollAction(workflowId, appId, actionId);
```

* Sends a trigger request to start action execution.
* Polls every 2 seconds until the action is `done` or `error`.

### Server-Side (`/api/deploy.ts`)

```ts
if (mode === 'trigger') {
  const resolvedAction = resolveActionFromWorkflow(workflow, actionId, req.body);
  updateAppState(appId, actionId, 'running');

  runAction(appId, resolvedAction, config, envVars)
    .then(() => updateAppState(appId, actionId, 'done'))
    .catch(() => updateAppState(appId, actionId, 'error'));
}
```

---

## Workflow System Design

### WorkflowDefinition

```ts
type WorkflowDefinition = WorkflowDefinitionStep[];

interface WorkflowDefinitionStep<TArgs = any> {
  id: string;
  definition: ActionDefinition<TArgs>;
  inputKey: string;
}
```

Defined in: `/lib/workflows/definitions/*.ts`

---

### ActionDefinition

```ts
interface ActionDefinition<TArgs = any> {
  id: string;
  run: (args: TArgs) => Promise<void>;
  validate?: (args: TArgs) => void;
}
```

Defined in: `/lib/workflows/actions/*.ts`

---

### ResolvedAction

```ts
interface ResolvedAction<TArgs = any> {
  id: string;
  args: TArgs;
  run: (args: TArgs) => Promise<void>;
}
```

Created at runtime using user input and workflow metadata.

## Features and Considerations

* No central action registry; actions are statically imported and passed directly to the runner.
* Status tracking handled via `getAppActionStatus()` and `updateAppState()`.
* Supports parallel deployments across multiple apps (`appId` scoped).
* Secrets, config, and env vars injected via cached payloads (design finalization pending).
* Compatible with Vercel's serverless execution model; actions execute asynchronously and non-blocking.
