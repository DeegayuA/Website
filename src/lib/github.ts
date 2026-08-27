/**
 * GitHub repo activity for project cards.
 *
 * Fetches are cached with 6-hourly ISR revalidation, so
 * on Vercel the data refreshes itself once a week in the background — no
 * separate cron needed. Every helper fails soft (returns null) so a GitHub
 * outage or rate limit can never break the page build.
 *
 * Optional: set GITHUB_TOKEN in the environment to raise the API rate limit.
 */

/* 6h — fresh enough to track active development on every repo (owned,
   contributed, open source) without any per-repo webhook setup. */
const REFRESH_SECONDS = 21600;

export interface RepoActivity {
  /** "owner/name" */
  repo: string;
  /** Weekly commit totals, oldest → newest. Empty while GitHub computes.
      For repos: the full first-commit → last-commit span. */
  weeks: number[];
  /** Daily counts per week (Sun→Sat) — only for the user calendar heatmap. */
  dailyWeeks: number[][];
  totalCommits: number;
  /** ISO date of the first tracked week (project start), or null. */
  startDate: string | null;
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

/**
 * The user's own contribution calendar — the exact data behind the graph on
 * their GitHub profile (all repos, all contribution types, only their
 * activity). Requires GITHUB_TOKEN (GraphQL has no anonymous access); callers
 * fall back to the per-repo aggregate when this returns null.
 */
export async function getUserContributions(
  login: string,
): Promise<RepoActivity | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...apiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { contributionCount date } }
              }
            }
          }
        }`,
        variables: { login },
      }),
      next: { revalidate: REFRESH_SECONDS, tags: ["github"] },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions: number;
              weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
            };
          };
        };
      };
    };
    const calendar =
      json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    // The calendar spans up to 53 partial weeks — keep the most recent 52
    const weeks = calendar.weeks.slice(-52);
    const dailyWeeks = weeks.map((w) =>
      w.contributionDays.map((d) => d.contributionCount),
    );
    const lastActiveDay = weeks
      .flatMap((w) => w.contributionDays)
      .filter((d) => d.contributionCount > 0)
      .at(-1);

    return {
      repo: "all GitHub activity",
      weeks: dailyWeeks.map((w) => w.reduce((a, b) => a + b, 0)),
      dailyWeeks,
      totalCommits: calendar.totalContributions,
      startDate: weeks[0]?.contributionDays[0]?.date ?? null,
      lastPush: lastActiveDay ? `${lastActiveDay.date}T00:00:00Z` : null,
    };
  } catch {
    return null;
  }
}

export async function getRepoActivity(
  repo: string,
): Promise<RepoActivity | null> {
  try {
    const [metaRes, statsRes, activityRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        headers: apiHeaders(),
        next: { revalidate: REFRESH_SECONDS, tags: ["github"] },
      }),
      // stats/contributors covers the repo's ENTIRE history (unlike
      // stats/commit_activity, which is capped to the last 52 weeks)
      fetch(`https://api.github.com/repos/${repo}/stats/contributors`, {
        headers: apiHeaders(),
        next: { revalidate: REFRESH_SECONDS, tags: ["github"] },
      }),
      // commit_activity adds per-DAY counts (Sun→Sat) for the last 52 weeks —
      // what the heatmap renders when available
      fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, {
        headers: apiHeaders(),
        next: { revalidate: REFRESH_SECONDS, tags: ["github"] },
      }),
    ]);

    if (!metaRes.ok) return null;
    const meta = (await metaRes.json()) as { pushed_at?: string };

    // 202 = GitHub is still computing stats; ship without the map this pass.
    let weeks: number[] = [];
    let startDate: string | null = null;
    if (statsRes.status === 200) {
      const stats = (await statsRes.json()) as
        | { weeks: { w: number; c: number }[] }[]
        | null;
      if (Array.isArray(stats) && stats.length > 0) {
        // Same week buckets for every contributor — sum commit counts per week
        const buckets = new Map<number, number>();
        for (const contributor of stats) {
          for (const wk of contributor.weeks) {
            buckets.set(wk.w, (buckets.get(wk.w) ?? 0) + wk.c);
          }
        }
        const sorted = [...buckets.entries()].sort((a, b) => a[0] - b[0]);
        // Trim to the active span: first commit → last commit
        const first = sorted.findIndex(([, c]) => c > 0);
        const last = sorted.findLastIndex(([, c]) => c > 0);
        if (first !== -1) {
          const span = sorted.slice(first, last + 1);
          weeks = span.map(([, c]) => c);
          startDate = new Date(span[0][0] * 1000).toISOString();
        }
      }
    }

    // Daily grid for the last 52 weeks, trimmed to the repo's active span
    let dailyWeeks: number[][] = [];
    let dailyStart: string | null = null;
    if (activityRes.status === 200) {
      const act = (await activityRes.json()) as
        | { total: number; week: number; days: number[] }[]
        | null;
      if (Array.isArray(act) && act.length > 0) {
        const firstActive = act.findIndex((w) => w.total > 0);
        if (firstActive !== -1) {
          const span = act.slice(firstActive);
          dailyWeeks = span.map((w) => w.days);
          dailyStart = new Date(span[0].week * 1000).toISOString();
        }
      }
    }

    return {
      repo,
      weeks,
      dailyWeeks,
      totalCommits:
        weeks.length > 0
          ? weeks.reduce((a, b) => a + b, 0)
          : dailyWeeks.flat().reduce((a, b) => a + b, 0),
      // The heatmap maps dates off the grid it renders — keep them in sync
      startDate: dailyWeeks.length > 0 ? dailyStart : startDate,
      lastPush: meta.pushed_at ?? null,
    };
  } catch {
    return null;
  }
}
