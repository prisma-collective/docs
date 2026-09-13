// app/api/contributors/route.ts

import { NextResponse } from 'next/server';

type ContributorData = {
  user: string;
  history: { week: string; commits: number }[];
};

async function fetchGitHubContributors(): Promise<ContributorData[]> {
  const token = process.env.PRISMA_DOCS_GITHUB_TOKEN;
  const owner = process.env.PRISMA_DOCS_GITHUB_OWNER;
  const repo = process.env.PRISMA_DOCS_GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error('Missing environment variables.');
  }

  let retries = 5;
  let delay = 3000; // 3 seconds between retries

  while (retries > 0) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 600 }, // Cache GitHub API for 10 min
    });

    if (response.status === 202) {
      // GitHub is still generating stats
      console.log('GitHub is processing contributor stats, waiting...');
      retries--;
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const contributors = await response.json();

    const result: ContributorData[] = contributors
      .filter((contributor: any) => {
        const user = contributor.author?.login || '';
        // Filter out dependabot and bots generally (optional stricter)
        return user && !user.toLowerCase().includes('dependabot') && !user.toLowerCase().includes('[bot]');
      })
      .map((contributor: any) => {
        const user = contributor.author.login;
        const history = contributor.weeks.map((week: any) => {
          const date = new Date(week.w * 1000);
          const weekLabel = date.toISOString().split('T')[0];
          return {
            week: weekLabel,
            commits: week.c,
          };
        });

      return {
        user,
        history,
      };
    });

    return result;
  }

  throw new Error('GitHub still processing after multiple retries.');
}

export async function GET() {
  try {
    const contributors = await fetchGitHubContributors();
    return NextResponse.json(contributors, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
