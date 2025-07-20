
sidebarTitle: Deploy
asIndexPage: true
---

# DeployStack Orchestration UI — Technical Specification

## Purpose

To build a minimal, elegant front-end interface for deploying a preconfigured suite of event-related applications (`register`, `docs`, `evaluation`, `enact`) using the Vercel and GitHub APIs. This app acts as a guide for configuring, provisioning, and deploying the full event stack on a client-specific domain.

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** TailwindCSS (black background, white content area)
- **State Management:** Zustand (ephemeral, in-session state)
- **Forms:** React Hook Form + Zod (validation schema)
- **Deployment Targets:** Vercel (client-owned or partner-owned accounts)
- **Git Operations:** GitHub API (fork workflow only - no clone)
- **UI Patterns:** Multi-step progress with a top progress bar and full-screen staged layouts

## Workflow Stages

1. **Metadata Collection**
   - Form to gather: client name, event name/date, domain, and repo prefix
   - Data stored client-side in Zustand store
   - Route: `/[ground_code]/1`

2. **GitHub Integration**
   - Form to collect personal access token & org/repo info
   - Radio to select method: `fork` or `clone`
   - Token stored only in memory (no cookies), passed directly to backend on submission
   - Route: `/[ground_code]/2`

3. **Vercel Integration**
   - Form to gather: Vercel token, team ID, and preferred deployment name
   - Token handled like GitHub’s — ephemeral in memory
   - Route: `/[ground_code]/3`

4. **App Selection**
   - Select from available apps (`register`, `docs`, `evaluation`, `enact`)
   - UI: Responsive cards with graphic, name, and "Selected" toggle state
   - Selected apps persisted in Zustand store
   - Route: `/[ground_code]/4`

5. **Deploy Stack**
   - Final confirmation screen
   - Displays summary of config + selected apps
   - User provides tokens again here (for single-use security)
   - On "Deploy" click:
     - Backend runs orchestrated deploy routine: fork/clone, create repos, configure env vars, deploy to Vercel, return DNS config

## Zustand Store Schema

```ts
type DeployState = {
  metadata: Metadata;
  github: GithubInfo;
  vercel: VercelInfo;
  apps: string[];
  setMetadata: (data: Partial<Metadata>) => void;
  setGithub: (data: Partial<GithubInfo>) => void;
  setVercel: (data: Partial<VercelInfo>) => void;
  setApps: (apps: string[]) => void;
  getFullConfig: () => FullConfig;
  clearAll: () => void;
}
````

Note: All data is client-side only. No refresh persistence for now.
