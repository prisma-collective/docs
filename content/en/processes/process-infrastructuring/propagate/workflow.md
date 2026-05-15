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

### Event Organising
Events serve the purpose of creating exceptional circumstances for unlikely demonstrations of alternative futures. Our core event-organising framework centres action, which takes place as an in-person intensive after a long multi-stakeholder participatory design process. The aim is to embody organisational forms that represent life-centric economy, at bioregional scales, as a systemic intervention toward opening up whole-system transition pathways. These momentary embodiments aim to make real a systemic intervention into a given system of focus to unlock increasing orders of socio-ecological value. Crucially, what is of value and how that is represented, digitally, is defined by and for community. 
### Team Formation
Over 110 teams have been incubated with these organising frameworks, mostly in sub-Saharan Africa, both with Prisma core facilitation teams present and without, by remotely training facilitators of community centres via online calls. Feedback has consistently centred the following pattern: steep learning curve; significantly more meaningful than any other technology programme they have experienced; will and commitment to continue their project development, often regardless of the likelihood of future funding, although that remains a key enabler. 
### Story Publishing Infrastructure
Event organising centres on developing the capacities of hubs to publish a data-backed account of both the organising process and the intensive, as the start of an ongoing accounting of systems-change. This app-centric infrastructure is designed to create multiple perspectives into participatory action, with apps hosted in their own cloud environments to safeguard data sovereignty. Whilst being quantitatively rigorous, the publishing stack is designed to address multiple levels of story-telling abstraction. Several publishing apps and their user-experience have been designed to support reflections on the event experience, in order to make visible the learnings, including both inner and outer dimensions. 

This infrastructure setup step is crucial to be able to apprehend of a non-local network of locally grounded action, coordinating as one whole. For the protocol to be more economically viable, services are primarily aimed at the hub-network level rather than at the level of individual hubs.
### Hub Deployments
During the course of event organising, as part of developing self-publishing capacity, hubs deploy, configure and customise several publishing applications. Currently, we offer a third-party cloud service provider as an interim step on the way towards hubs self-hosting their own node. Over 45 cryptographically authenticated deployments have been made, distributing primarily two apps: 

1. A static-site generator for documentation
2. A telegram bot backed onto a graph database for agent-centric (mobile), real-time, voice-based contribution accounting. 
