---
sidebarTitle: Client Coordinator
---

# Deployment Workflow Orchestration (Client-Driven, Server-Validated)

## Context

- The application supports deploying multiple "apps" (e.g., App A, App B, App C).
- Each app runs the same workflow: a series of actions (e.g., fork GitHub repo, deploy to Vercel, present DNS entries).
- Vercel serverless function limits (10s execution cap) prevent running full workflows in a single server invocation.

## Problem

- Full workflows for all apps exceed the time limits of Vercel's serverless functions.
- Server-side orchestration is not possible without introducing external queueing systems (e.g., Upstash, Supabase), which is undesirable.
- Workflow definitions and validations must live on the server for correctness and reusability.
- The client must initiate and orchestrate the workflow but cannot hardcode workflow logic.

## Solution Overview

### Architecture: Client-Orchestrated, Server-Validated Workflow

1. **Client Initialization**  
   - Sends a POST request to `/api/deploy` with mode `'init'` and the full config/envVars.
   - Server validates the request, resolves the workflow using `resolveWorkflowActions`, and returns a list of actions.
   - Server caches the workflow context keyed by `workflowId`.

2. **Client Execution Loop**  
   - For each app:
     - For each action:
       - Calls the server with `mode: 'trigger'` to run the step.
       - Polls the server with `mode: 'status'` until the step is complete.

3. **Server API Modes**  
   - `init`: Validate inputs, resolve and return actions, cache context.
   - `trigger`: Start a specific action for a specific app.
   - `status`: Check completion state for a given app/action pair.

### Server-Side Implementation

- Centralized under a single Next.js API route: `/api/deploy`
- Uses `NextRequest` and `NextResponse` from `next/server`
- Accepts three `mode`s via the request body
- Stores resolved workflows and input state in a simple in-memory or edge-cache store

### Client-Side Logic

- Tracks state with:
  - `isDeploying: boolean`
  - `currentAppIndex: number`
  - `currentActionIndex: number`
  - `actions: string[]` (fetched from server during `init`)
- Loops through apps and actions in order
- Disables UI and shows progress while deployment is active

## DeploymentProgress UI Component

### Behavior

- Shows each app as a vertical list item
- Expands current app to reveal actions
- Visual indicators:
  - Green check: completed
  - Amber spinner: currently in progress
  - Gray dot: not yet started
- Completed apps collapse, current app remains expanded
- Rendered in second column of page on larger screens
- Max height: 500px, scrollable when necessary

### Technologies

- Built with React and Tailwind CSS
- Uses `react-icons` for visual indicators (`FaCheckCircle`, `FaSpinner`, `FaCircle`)

## Benefits

- Avoids the need for background job infrastructure
- Maintains server as the source of truth for workflow logic and validation
- Ensures scalability by breaking down long tasks into isolated, short-lived steps
- Allows recovery, retries, and step-by-step visibility
- Keeps the client flexible while the server handles sensitive logic

## Considerations

- Requires stateful client page to orchestrate and display progress
- Needs storage mechanism (in-memory or edge cache) to persist config/actions
- Future improvement could include resumable workflows and error recovery

