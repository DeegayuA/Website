import type { RepoActivity } from "@/lib/github";
import { SocialIcon } from "./SocialIcon";

/**
 * GitHub-style contribution calendar — bordered card, month labels along the
 * top, weekday rail on the left, five-level green cells, Less→More legend.
 * Pure markup; data arrives from the server (the user's real contribution
 * calendar via GraphQL).
 */

const DAY_MS = 86_400_000;

export function ContributionGraph({
  activity,
  githubUrl,
}: {
  activity: RepoActivity;
  githubUrl: string;
}) {
  const { dailyWeeks, weeks, totalCommits, startDate } = activity;
  /* GitHub's calendar ends mid-week on every day but Saturday — accept a
     partial trailing week instead of silently degrading to the weekly strip */
  const hasDaily =
    dailyWeeks.length > 0 &&
    dailyWeeks.every(
      (w, i) =>
        w.length === 7 || (i === dailyWeeks.length - 1 && w.length > 0),
    );
  const grid = hasDaily ? dailyWeeks : weeks.map((t) => [t]);

  const flat = grid.flat();
  const max = Math.max(...flat, 1);
  const level = (count: number) => {
    if (count <= 0) return 0;
    const r = count / max;
    if (r > 0.75) return 4;
    if (r > 0.5) return 3;
    if (r > 0.25) return 2;
    return 1;
  };
  /* Ramp in the site's own accent — magenta into violet — instead of
     default GitHub green */
  const CELL = [
    "bg-foreground/[0.08]",
    "bg-[#B600A8]/25",
    "bg-[#B600A8]/50",
    "bg-[#7621B0]/75",
    "bg-[#7621B0]",
  ];

  const start = startDate ? new Date(startDate) : null;
  const dateOf = (w: number, d: number) =>
    start ? new Date(start.getTime() + (w * 7 + d) * DAY_MS) : null;

  // Month label at every column where the month changes
  const monthLabels: { week: number; label: string }[] = [];
  if (start) {
    let prev = -1;
    grid.forEach((_, w) => {
      const m = dateOf(w, 0)!.getMonth();
      if (m !== prev) {
        monthLabels.push({
          week: w,
          label: dateOf(w, 0)!.toLocaleDateString("en-US", { month: "short" }),
        });
        prev = m;
      }
    });
    // Drop a cramped first label when the second sits within two columns
    if (monthLabels.length > 1 && monthLabels[1].week - monthLabels[0].week < 3) {
      monthLabels.shift();
    }
  }

  /* Weekend-agnostic stats — streaks punish a Mon–Fri rhythm */
  const activeDays = hasDaily ? flat.filter((c) => c > 0).length : 0;
  const bestWeek = Math.max(
    ...(weeks.length > 0 ? weeks : grid.map((w) => w.reduce((a, b) => a + b, 0))),
    0,
  );
  const busiest = Math.max(...flat, 0);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-foreground/[0.02] p-5 sm:p-6">
      {/* Headline */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-black leading-none text-[clamp(1.8rem,3.5vw,2.6rem)]">
            {totalCommits.toLocaleString()}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted">
            contributions · last 12 months
          </p>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="See the contributions on GitHub"
          className="inline-flex items-center gap-2 rounded-full bg-slab px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-slab-fg transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-95"
        >
          <SocialIcon name="github" size={14} />
          @{githubUrl.split("/").pop()}
        </a>
      </div>

      {/* Fluid calendar — cells scale with the container, no horizontal scroll */}
      <div className="w-full">
        {/* Month labels */}
        {monthLabels.length > 0 && (
          <div aria-hidden="true" className="relative ml-8 h-4">
            {monthLabels.map(({ week, label }, i) => (
              <span
                key={week}
                className={`absolute top-0 font-mono text-[9px] uppercase text-muted ${
                  i % 3 === 0 ? "" : "hidden sm:inline"
                }`}
                style={{ left: `${(week / grid.length) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-stretch gap-[3px]">
          {/* Weekday rail — flex-1 rows mirror the fluid cell heights */}
          <div
            aria-hidden="true"
            className="mr-1 flex w-7 flex-col gap-[3px] text-right font-mono text-[9px] uppercase text-muted"
          >
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i} className="flex flex-1 items-center justify-end">
                {d}
              </span>
            ))}
          </div>

          {/* Cells */}
          <div
            aria-hidden="true"
            className="grid min-w-0 flex-1 gap-[2px] sm:gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((week, w) => (
              <div key={w} className="flex flex-col gap-[2px] sm:gap-[3px]">
                {week.map((count, d) => {
                  const date = dateOf(w, d);
                  return (
                    <span
                      key={d}
                      title={
                        date
                          ? `${count} contribution${count === 1 ? "" : "s"} on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                          : `${count} contribution${count === 1 ? "" : "s"}`
                      }
                      className={`aspect-square w-full rounded-[2px] ${CELL[level(count)]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak stats + legend */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--line)] pt-4">
        <div className="flex gap-8">
          {hasDaily && (
            <div>
              <p className="flex items-center gap-1.5 font-black leading-none text-xl">
                {activeDays}
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B600A8]" />
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
                active days
              </p>
            </div>
          )}
          <div>
            <p className="font-black leading-none text-xl">{bestWeek}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
              best week
            </p>
          </div>
          <div>
            <p className="font-black leading-none text-xl">{busiest}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
              busiest {hasDaily ? "day" : "week"}
            </p>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="flex items-center gap-1 font-mono text-[9px] uppercase text-muted"
        >
          Less
          {CELL.map((c) => (
            <span key={c} className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
          ))}
          More
        </span>
      </div>
      <p className="sr-only">
        {totalCommits} contributions in the last year across {activity.repo}
      </p>
    </div>
  );
}
