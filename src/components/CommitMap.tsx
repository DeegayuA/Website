import type { RepoActivity } from "@/lib/github";

/**
 * Development-phase map for one repo — a GitHub-style day heatmap
 * (7 rows × active weeks, last 52 weeks max) showing when the project was
 * actually built. Falls back to the weekly bar strip while GitHub is still
 * computing daily stats. Data arrives from the server; pure markup here.
 *
 * variant="compact" (default) — small inline figure with its own caption,
 * used inside project cards.
 * variant="panel" — fills the width of a stats panel (case-study pages);
 * the surrounding panel owns the numbers, so no caption.
 *
 * Short repos (fewer than MIN_HEATMAP_WEEKS of history) render a
 * full-width daily bar strip in both variants — a 3-week repo as a
 * 3-column heatmap was an unreadable postage stamp.
 */

const CELL = [
  "bg-foreground/[0.08]",
  "bg-emerald-500/30",
  "bg-emerald-500/55",
  "bg-emerald-500/80",
  "bg-emerald-500",
];

const BAR = [
  "bg-foreground/10",
  "bg-emerald-500/35",
  "bg-emerald-500/55",
  "bg-emerald-500/80",
  "bg-emerald-500",
];

const DAY_MS = 86_400_000;

/* A heatmap needs enough columns to read as a calendar; below this the
   panel variant falls back to full-width weekly bars. */
const MIN_HEATMAP_WEEKS = 14;

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

export function CommitMap({
  activity,
  variant = "compact",
}: {
  activity: RepoActivity;
  variant?: "compact" | "panel";
}) {
  const { weeks, dailyWeeks, totalCommits, startDate, lastPush } = activity;
  const panel = variant === "panel";
  const hasDaily = dailyWeeks.length > 0;
  if (!hasDaily && weeks.length === 0) return null;

  const showHeatmap = hasDaily && dailyWeeks.length >= MIN_HEATMAP_WEEKS;

  /* Bar fallback: daily bars when we have day data (a short span still
     yields a readable full-width strip), weekly totals otherwise. Edge
     all-zero days are trimmed so the strip starts and ends on activity. */
  let barsAreDaily = false;
  let barOffsetDays = 0;
  let bars: number[];
  if (!showHeatmap && hasDaily) {
    barsAreDaily = true;
    bars = dailyWeeks.flat();
    while (bars.length > 1 && bars[0] === 0) {
      bars.shift();
      barOffsetDays++;
    }
    while (bars.length > 1 && bars[bars.length - 1] === 0) bars.pop();
  } else {
    bars = weeks.length > 0 ? weeks : dailyWeeks.map((w) => w.reduce((a, b) => a + b, 0));
  }

  const flat = showHeatmap ? dailyWeeks.flat() : bars;
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
      className={panel ? undefined : "mt-1"}
    >
      {showHeatmap ? (
        /* Day heatmap — columns are weeks, rows Sun→Sat. Width is capped so a
           young repo with few weeks doesn't inflate into giant cells. */
        <div
          aria-hidden="true"
          className={panel ? "mx-auto grid w-full gap-[2px]" : "grid w-full gap-px"}
          style={{
            gridTemplateColumns: `repeat(${dailyWeeks.length}, minmax(0, 1fr))`,
            maxWidth: `${dailyWeeks.length * (panel ? 1.15 : 0.875)}rem`,
          }}
        >
          {dailyWeeks.map((week, w) => (
            <div
              key={w}
              className={panel ? "flex flex-col gap-[2px]" : "flex flex-col gap-px"}
            >
              {week.map((count, d) => (
                <span
                  key={d}
                  title={dayTitle(w, d, count)}
                  className={`aspect-square w-full ${panel ? "rounded-[2px]" : "rounded-[1px]"} ${CELL[level(count)]}`}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Bar strip — daily for short repos, weekly otherwise; fills the
           available width so young projects don't render as a stamp */
        <div
          className={
            panel ? "flex h-16 items-end gap-[2px]" : "flex h-7 items-end gap-px"
          }
          aria-hidden="true"
        >
          {bars.map((count, i) => (
            <span
              key={i}
              title={
                barsAreDaily && start
                  ? `${count} commit${count === 1 ? "" : "s"} on ${new Date(
                      start.getTime() + (barOffsetDays + i) * DAY_MS,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : `${count} commit${count === 1 ? "" : "s"}`
              }
              className={`w-full min-w-px rounded-[2px] ${BAR[level(count)]}`}
              style={{
                height:
                  count > 0 ? `${Math.max(18, (count / max) * 100)}%` : "10%",
              }}
            />
          ))}
        </div>
      )}
      {!panel && (
        <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          {totalCommits.toLocaleString()} commits
          {range ? ` · ${range}` : ""}
        </figcaption>
      )}
    </figure>
  );
}
