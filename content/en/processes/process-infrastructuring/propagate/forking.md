---
sidebarTitle: Fork Logic
---

# GitHub repository provisioning

Propagate forks upstream Prisma app repos into the operator's target GitHub organisation before linking them to Vercel.

## Objective

For each selected app, create (or reuse) a fork of the upstream repository in `provider.github.targetOrg`. The fork naming convention is:

```
{deployment.slug}-{appSlug}
```

Example: `acme-corp-timelining` in org `client-org`.

## Authentication

Forking uses the **Propagate GitHub App** installed on the target org — not an operator PAT.

During `propagate create`, `propagate apply`, or `propagate auth github`, the operator installs the app via a browser flow on [propagate.prisma.events](https://propagate.prisma.events). The CLI stores the installation record in `.propagate/credentials.json`:

```json
{
  "github": {
    "installationId": 12345678,
    "targetOrg": "client-org",
    "credentialRef": "...",
    "installedAt": "..."
  }
}
```

At `apply` and `destroy`, the CLI requests a short-lived **installation access token** from the auth server and passes it to Pulumi as `GITHUB_TOKEN`. The token is scoped to the installed org and expires after ~1 hour.

The app must have permission to create and delete repositories in the target organisation. Public upstream repos (`prisma-collective/*`) do not require a separate install on the source org.

For apps with [deploy codemods](/processes/process-infrastructuring/propagate/codemods), the GitHub App also needs **Actions: Read and write** on the target org to dispatch workflows on forks. The workflow commits using its own scoped `GITHUB_TOKEN` inside GitHub Actions — propagate does not need `contents: write` on forks.

## Implementation

Forking is handled by a Pulumi dynamic resource (`GitHubFork` in `packages/infra`) that calls the GitHub REST API:

```
POST /repos/{owner}/{repo}/forks
```

with `organization` set to the target org.

## Flow

1. CLI ensures GitHub App is installed on `provider.github.targetOrg`
2. CLI mints installation token from auth server
3. Pulumi `GitHubFork` checks if `{targetOrg}/{forkName}` already exists — reuse if so
4. Otherwise fork from upstream `sourceUrl` (from `catalog/apps.yaml`)
5. If `deploy.workflow` is set: dispatch codemods workflow on the fork (see [Deploy codemods](/processes/process-infrastructuring/propagate/codemods))
6. Return `fullName`, `htmlUrl`, and `defaultBranch` as Pulumi outputs
7. Vercel project links to the forked repo via `gitRepository`, deploy pinned to codemod commit when applicable

## What was removed

These earlier approaches are **no longer used**:

| Approach | Status |
|----------|--------|
| `GITHUB_FORK_PAT` + service-account org invite | Removed (v1 web wizard) |
| Operator-supplied `GITHUB_TOKEN` PAT | Removed |
| GitHub OAuth user token for forking | Removed |

## Upstream sources

| App slug | Upstream repo |
|----------|---------------|
| `docs` | `prisma-collective/docs` |
| `timelining` | `prisma-collective/timelining` |
| `enacting` | `prisma-collective/enact` |
| `registering` | `prisma-collective/enrol` |
| `evaluating` | `prisma-collective/evaluate` |

## Security notes

- Installation metadata is stored in `.propagate/credentials.json` (gitignored)
- `credentialRef` is required to mint tokens — arbitrary callers cannot request tokens with only an installation ID
- The GitHub App private key lives on the hosted auth server, not in the CLI
- Pulumi stack config can encrypt secrets for remote backends

## Vercel linkage

After fork, `VercelDeploy` creates a Vercel project named `{deployment.slug}-{appSlug}`, links it to `{targetOrg}/{forkName}`, injects resolved env vars, assigns the nested domain, and triggers a production deployment on `main`.

The target org must also have the **Vercel GitHub App** installed for git-linked deploys to succeed.
