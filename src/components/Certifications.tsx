"use client";

import { certifications, type Certification } from "@/data/certifications";
import { FadeIn } from "./FadeIn";
import { BrandIcon } from "./BrandIcon";
import { ParallaxDrift } from "./ParallaxDrift";

/* Group by issuer, preserving data order (newest cert first) both for the
   group sequence and the rows inside each group. */
function groupByIssuer(certs: Certification[]) {
  const groups = new Map<string, Certification[]>();
  for (const cert of certs) {
    const list = groups.get(cert.issuer);
    if (list) list.push(cert);
    else groups.set(cert.issuer, [cert]);
  }
  return Array.from(groups, ([issuer, items]) => ({ issuer, items }));
}

/* "Amazon Web Services (AWS)" → "AWS" for the card header */
const shortIssuer = (issuer: string) =>
  /\(([^)]+)\)/.exec(issuer)?.[1] ?? issuer;

/* Repeating the program prefix on every AWS row is what made the list read
   as clutter — the card header already says who issued it. */
const displayTitle = (title: string) =>
  title.replace(/^AWS Academy Graduate - (AWS Academy )?/, "");

const stripIssued = (issued: string) => issued.replace(/^Issued\s+/i, "");

export function Certifications() {
  const groups = groupByIssuer(certifications);

  return (
    <section
      id="certifications"
      className="cv-section px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28"
    >
      <FadeIn>
        <ParallaxDrift distance={30}>
          <h2
            className="hero-heading font-black uppercase text-center mb-3"
            style={{ fontSize: "clamp(2.4rem, 9vw, 120px)" }}
          >
            Certifications
          </h2>
          <p className="label mb-10 text-center text-muted sm:mb-12 md:mb-14">
            {certifications.length} credentials · {groups.map((g) => shortIssuer(g.issuer)).join(" / ")}
          </p>
        </ParallaxDrift>
      </FadeIn>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-4 sm:gap-5 lg:grid-cols-3">
        {groups.map((group, gi) => (
          <FadeIn
            key={group.issuer}
            delay={gi * 0.08}
            className="h-full"
          >
            <div className="glass glass-lens bevel flex h-full flex-col rounded-2xl p-5 sm:p-6">
              {/* Issuer header */}
              <div className="flex items-center gap-3">
                {group.items[0].issuerIcon && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] ring-1 ring-[var(--line)]">
                    <BrandIcon
                      name={group.items[0].issuerIcon}
                      size={22}
                      title={`${group.issuer} icon`}
                    />
                  </span>
                )}
                <h3 className="font-display text-lg font-bold leading-none">
                  {shortIssuer(group.issuer)}
                </h3>
                <span className="ml-auto rounded-full border border-(--glass-border) px-2.5 py-1 font-mono text-[11px] font-medium text-muted">
                  ×{group.items.length}
                </span>
              </div>

              {/* Credential rows */}
              <ul className="mt-4 flex-1 divide-y divide-[var(--line)]">
                {group.items.map((cert) => (
                  <li key={cert.title} className="py-3.5 first:pt-2 last:pb-0">
                    <p className="text-sm font-medium leading-snug sm:text-[15px]">
                      {displayTitle(cert.title)}
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                      {stripIssued(cert.issued)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
