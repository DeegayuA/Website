import { skills } from "@/data/site";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";

/**
 * Premium logo/skill strip bridging the hero and About. Decorative — the
 * canonical skills list lives in the About section for screen readers.
 * The track is duplicated so the -50% translate loops seamlessly.
 */
export function SkillsMarquee() {
  return (
    <div
      aria-hidden="true"
      className="marquee relative select-none border-y border-(--glass-border) py-6"
    >
      <div className="marquee__track flex shrink-0 items-center gap-3 pr-3" style={{ "--marquee-items": skills.length } as React.CSSProperties}>
        {/* Original copy */}
        {skills.map((skill) => (
          <span
            key={`${skill}-original`}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-(--glass-border) bg-(--surface) px-4 py-2 text-sm font-medium text-foreground/80"
          >
            {hasBrandIcon(skill) ? (
              <BrandIcon name={skill} size={17} brand />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-spark" />
            )}
            {skill}
          </span>
        ))}
        {/* Duplicated copy for seamless loop */}
        <div className="marquee__copy--dup flex shrink-0 items-center gap-3" aria-hidden="true">
          {skills.map((skill) => (
            <span
              key={`${skill}-dup`}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-(--glass-border) bg-(--surface) px-4 py-2 text-sm font-medium text-foreground/80"
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
    </div>
  );
}
