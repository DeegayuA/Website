"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky chapter rail for case-study pages. Scroll-spies the section
 * headings via IntersectionObserver; plain anchors so it works without JS.
 * Hidden below lg — the document order carries the story on phones.
 */
export function CaseStudyNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study chapters" className="hidden lg:block">
      <ol className="sticky top-28 flex flex-col gap-1 border-l border-line">
        {items.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors duration-200",
                  isActive
                    ? "border-foreground font-semibold text-foreground"
                    : "border-transparent text-muted hover:text-foreground",
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
