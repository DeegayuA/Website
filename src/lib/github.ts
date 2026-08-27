/**
 * GitHub repo activity for project cards.
 *
 * Fetches are cached with weekly ISR revalidation (`revalidate: 604800`), so
 * on Vercel the data refreshes itself once a week in the background — no
 * separate cron needed. Every helper fails soft (returns null) so a GitHub
 * outage or rate limit can never break the page build.
 *
 * Optional: set GITHUB_TOKEN in the environment to raise the API rate limit.
 */

const WEEK_SECONDS = 604800;

export interface RepoActivity {
  /** "owner/name" */
  repo: string;
  /** 52 weekly commit totals, oldest → newest. Empty while GitHub computes. */
  weeks: number[];
  totalCommits: number;
  /** ISO timestamp of the last push, or null. */
  lastPush: string | null;
}

function apiHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/** Extract "owner/repo" from the first github.com link, if any. */
export function githubRepoFromLinks(
  links: { href: string }[],
): string | null {
  for (const { href } of links) {
    const m = href.match(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git|\/|$)/i);
    if (m) return `${m[1]}/${m[2]}`;
  }
  return null;
}

export async function getRepoActivity(
  repo: string,
): Promise<RepoActivity | null> {
  try {
    const [metaRes, statsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        headers: apiHeaders(),
        next: { revalidate: WEEK_SECONDS },
      }),
      fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, {
        headers: apiHeaders(),
        next: { revalidate: WEEK_SECONDS },
      }),
    ]);

    if (!metaRes.ok) return null;
    const meta = (await metaRes.json()) as { pushed_at?: string };

    // 202 = GitHub is still computing stats; ship without the map this week.
    let weeks: number[] = [];
    if (statsRes.status === 200) {
      const stats = (await statsRes.json()) as { total: number }[] | null;
      if (Array.isArray(stats)) weeks = stats.map((w) => w.total);
    }

    return {
      repo,
      weeks,
      totalCommits: weeks.reduce((a, b) => a + b, 0),
      lastPush: meta.pushed_at ?? null,
    };
  } catch {
    return null;
  }
}
