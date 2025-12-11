---
sidebarTitle: Fork Logic
---

# Technical Spec: GitHub Org Integration via GitHub App

## Objective

Enable users (referred to as targets) to install a GitHub App into their organization. This grants scoped access to fork a template repository into their org, which is later used for deployment.

---

## System Components

### GitHub App

- Installed by the target into their GitHub organization.
- Grants permission to read and write to repositories.
- GitHub redirects back to a specified callback URL with an `installation_id` query parameter.

---

## User Flow

### Multi-Step Frontend Form (Next.js)

1. **Step 2: GitHub Connection**
   - User clicks the "Connect GitHub" button.
   - Opens the GitHub App install URL in a popup window.
   - On successful install, GitHub redirects to `/github/callback?installation_id=...`.
   - The callback page posts the `installation_id` back to the main window.
   - The main window stores the `installationId` in the Zustand store (`useDeployStore`).

2. **Step 3: Final Deploy**
   - When the user clicks "Deploy", the stored `installationId` is used by the backend to fork the repo into the target org.

---

## Auth & Token Flow

- Backend uses `Octokit` with GitHub App authentication.
- Uses `getInstallationOctokit(installationId)` to access the GitHub API on behalf of the installed app.
- No personal access tokens (PATs) or manual token scopes are required from the user.
- The installation ID is sufficient to authenticate for authorized actions.

---

## Forking Logic

```ts
import { Octokit } from '@octokit/rest';
import { getInstallationOctokit } from '@/lib/github';

interface ForkRepoOptions {
    installationId: number;
    repoUrl: string;
    targetOrg: string;
    newRepoName?: string;
}

export async function forkRepo({
    installationId,
    repoUrl,
    targetOrg,
    newRepoName,
}: ForkRepoOptions): Promise<{ htmlUrl: string; repoName: string }> {
    const octokit: Octokit = await getInstallationOctokit(installationId);

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\.git)?/);
    if (!match) {
        throw new Error(`Invalid GitHub repo URL: ${repoUrl}`);
    }

    const [_, sourceOwner, sourceRepo] = match;

    const { data: forkedRepo } = await octokit.rest.repos.createFork({
        owner: sourceOwner,
        repo: sourceRepo,
        organization: targetOrg,
        name: newRepoName ?? sourceRepo,
    });

    return {
        htmlUrl: forkedRepo.html_url,
        repoName: forkedRepo.name,
    };
}
```

---

## State Management

Zustand store (`useDeployStore`) tracks the following:

* GitHub method (`fork` or `clone`)
* Target organization name
* Repository name override (optional)
* GitHub installation ID (`installationId`)

This state is used across multiple steps in the frontend and eventually passed to the backend deploy handler.

---

## Security and UX Notes

* `postMessage` is origin-validated to ensure communication only comes from trusted URLs.
* GitHub installation flow opens in a popup to preserve the main app state.
* Callback window automatically closes after successful authentication and confirms status visually to the user.
