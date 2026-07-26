import { skills } from "@/data/site";

/**
 * Infinite marquee bridging the hero and About. Decorative — the
 * canonical skills list lives in the About section for screen readers.
 */
export function SkillsMarquee() {
  const row = (key: string) => (
    <div
      key={key}
      className="marquee__track flex shrink-0 items-center gap-10 pr-10"
    >
      {skills.map((skill, i) => (
        <span
          key={skill}
          className={
            i % 2 === 0
              ? "text-2xl font-bold tracking-tight text-foreground/70 sm:text-3xl"
              : "text-outline text-2xl font-bold tracking-tight sm:text-3xl"
          }
        >
          {skill}
          <span className="ml-10 inline-block h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accent-3 align-middle" />
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="marquee select-none py-6 sm:py-8">
      {row("a")}
      {row("b")}
    </div>
  );
}
