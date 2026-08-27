"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { projects, categories, type Category } from "@/data/projects";
import type { RepoActivity } from "@/lib/github";
import { ProjectCard } from "./ProjectCard";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Filter = Category | "all";

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/* Bento widths only — each card grows to fit its own content (no fixed row
   height), so nothing ever clips. Featured/wide cards span two columns for
   emphasis; dense flow packs the single-column cards around them. */
const BENTO = [
  "sm:col-span-2 lg:col-span-2", // wide (featured)
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-2 lg:col-span-2", // wide
  "sm:col-span-1 lg:col-span-1",
];
function tileClass(i: number) {
  return BENTO[i % BENTO.length];
}

function isCompactTile(i: number) {
  return BENTO[i % BENTO.length].includes("col-span-1");
}

/** Cards shown on phones before the "Show all" expander. */
const MOBILE_LIMIT = 3;

export function Projects({
  activity,
}: {
  activity?: Record<string, RepoActivity>;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  const visible = [...filtered].sort((a, b) => {
    const aFeatured = a.featured ? 1 : 0;
    const bFeatured = b.featured ? 1 : 0;
    return bFeatured - aFeatured;
  });

  return (
    <Section id="projects" eyebrow="Selected work" title="Projects" index="02 / Work">
      <Reveal>
        <div
          className="glass glass-lens bevel mb-8 inline-flex max-w-full flex-wrap items-center gap-1 rounded-[1.4rem] p-1.5 sm:mb-12 sm:rounded-full"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((category) => {
            const isActive = filter === category.value;
            return (
              <button
                key={category.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(category.value)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-[color,transform] active:scale-95",
                  isActive ? "text-background" : "text-muted hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent shadow-md shadow-accent/30"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Keyed by filter: the grid re-enters with a staggered rise on change */}
      <p className="sr-only" aria-live="polite">Showing {visible.length} projects</p>
      <motion.ul
        id="projects-grid"
        key={filter}
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        aria-label={`${visible.length} projects shown`}
      >
        {visible.map((project, i) => (
          <motion.li
            key={project.title}
            variants={cell}
            className={cn(
              "min-w-0",
              tileClass(i),
              // Phones start collapsed; sm+ always shows everything
              !expanded && i >= MOBILE_LIMIT && "hidden sm:block",
            )}
          >
            <ProjectCard
              project={project}
              compact={isCompactTile(i)}
              activity={activity?.[project.title]}
            />
          </motion.li>
        ))}
      </motion.ul>

      {visible.length > MOBILE_LIMIT && (
        <div className="mt-6 flex justify-center sm:hidden">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="projects-grid"
            onClick={() => setExpanded((v) => !v)}
            className="glass glass-lens rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-[color,transform] active:scale-95"
          >
            {expanded ? "Show less" : `Show all ${visible.length} projects`}
          </button>
        </div>
      )}
    </Section>
  );
}
