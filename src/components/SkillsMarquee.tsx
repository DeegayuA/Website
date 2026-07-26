import { skills } from "@/data/site";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";

/**
 * Premium logo/skill strip bridging the hero and About. Decorative — the
 * canonical skills list lives in the About section for screen readers.
 * The track is duplicated so the -50% translate loops seamlessly.
 */
export function SkillsMarquee() {
  const items = [...skills, ...skills];
  return (
    <div
      aria-hidden="true"
      className="marquee relative select-none border-y border-(--glass-border) py-6"
    >
      <div className="marquee__track flex shrink-0 items-center gap-3 pr-3">
        {items.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="glass glass-lens inline-flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/80"
          >
            {hasBrandIcon(skill) ? (
              <BrandIcon name={skill} size={17} brand />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-spark" />
            )}
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
