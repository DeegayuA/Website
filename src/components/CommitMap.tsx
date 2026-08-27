import type { RepoActivity } from "@/lib/github";

/**
 * Development-phase map for one repo — a GitHub-style day heatmap
 * (7 rows × active weeks, last 52 weeks max) showing when the project was
 * actually built. Falls back to the weekly bar strip while GitHub is still
 * computing daily stats. Data arrives from the server; pure markup here.
 */

const CELL = [
  "bg-foreground/[0.08]",
  "bg-emerald-500/30",
  "bg-emerald-500/55",
  "bg-emerald-500/80",
  "bg-emerald-500",
];

const DAY_MS = 86_400_000;

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

export function CommitMap({ activity }: { activity: RepoActivity }) {
  const { weeks, dailyWeeks, totalCommits, startDate, lastPush } = activity;
  const hasDaily = dailyWeeks.length > 0;
  if (!hasDaily && weeks.length === 0) return null;

  const flat = hasDaily ? dailyWeeks.flat() : weeks;
  const max = Math.max(...flat, 1);
  const level = (count: number) => {
    if (count <= 0) return 0;
    const r = count / max;
    if (r > 0.75) return 4;
    if (r > 0.5) return 3;
    if (r > 0.25) return 2;
    return 1;
  };

  const start = hasDaily && startDate ? new Date(startDate) : null;
  const dayTitle = (w: number, d: number, count: number) => {
    const base = `${count} commit${count === 1 ? "" : "s"}`;
    if (!start) return base;
    const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
    return `${base} on ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const started = startDate ? fmtMonth(startDate) : null;
  const lastActive = lastPush ? fmtMonth(lastPush) : null;
  const range =
    started && lastActive
      ? started === lastActive
        ? started
        : `${started} — ${lastActive}`
      : lastActive;

  return (
    <figure
      aria-label={`Development activity: ${totalCommits} commits${
        range ? `, ${range}` : ""
      }`}
      className="mt-1"
    >
      {hasDaily ? (
        /* Day heatmap — columns are weeks, rows Sun→Sat. Width is capped so a
           young repo with few weeks doesn't inflate into giant cells. */
        <div
          aria-hidden="true"
          className="grid w-full gap-px"
          style={{
            gridTemplateColumns: `repeat(${dailyWeeks.length}, minmax(0, 1fr))`,
            maxWidth: `${dailyWeeks.length * 0.875}rem`,
          }}
        >
          {dailyWeeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-px">
              {week.map((count, d) => (
                <span
                  key={d}
                  title={dayTitle(w, d, count)}
                  className={`aspect-square w-full rounded-[1px] ${CELL[level(count)]}`}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Weekly bars while GitHub still computes the daily stats */
        <div className="flex h-7 items-end gap-px" aria-hidden="true">
          {weeks.map((count, i) => (
            <span
              key={i}
              title={`${count} commit${count === 1 ? "" : "s"}`}
              className={
                count > 0
                  ? "w-full min-w-px rounded-[1px] bg-emerald-500/70"
                  : "w-full min-w-px rounded-[1px] bg-foreground/10"
              }
              style={{
                height:
                  count > 0 ? `${Math.max(18, (count / max) * 100)}%` : "12%",
              }}
            />
          ))}
        </div>
      )}
      <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
        {totalCommits.toLocaleString()} commits
        {range ? ` · ${range}` : ""}
      </figcaption>
    </figure>
  );
}
