import type { RepoActivity } from "@/lib/github";

/**
 * 52-week commit sparkline — a compact "development phase map" showing when a
 * project was actively built vs. dormant. Data arrives from the server via
 * props; the component itself is pure markup.
 */
export function CommitMap({ activity }: { activity: RepoActivity }) {
  const { weeks, totalCommits, lastPush } = activity;
  if (weeks.length === 0) return null;

  const max = Math.max(...weeks, 1);
  const lastActive = lastPush
    ? new Date(lastPush).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <figure
      aria-label={`Commit activity: ${totalCommits} commits in the last year${
        lastActive ? `, last push ${lastActive}` : ""
      }`}
      className="mt-1"
    >
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
              height: count > 0 ? `${Math.max(18, (count / max) * 100)}%` : "12%",
            }}
          />
        ))}
      </div>
      <figcaption className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
        <span>{totalCommits} commits · past year</span>
        {lastActive && <span>last push {lastActive}</span>}
      </figcaption>
    </figure>
  );
}
