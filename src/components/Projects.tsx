"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { projects, categories, type Category } from "@/data/projects";
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

/* Bento tile sizes (lg, 6-col grid + 6.5rem auto-rows). Featured projects get
   the hero tile; the rest cycle through a mix of wide/tall/standard so the
   grid never looks like a uniform deck. Index-based so any filtered set still
   tiles cleanly. */
const BENTO = [
  "lg:col-span-2 lg:row-span-3",
  "lg:col-span-2 lg:row-span-4",
  "lg:col-span-3 lg:row-span-3",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-2 lg:row-span-3",
  "lg:col-span-4 lg:row-span-3",
];
function tileClass(i: number, featured?: boolean) {
  return featured
    ? "sm:col-span-2 lg:col-span-4 lg:row-span-5"
    : `sm:col-span-1 ${BENTO[i % BENTO.length]}`;
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  return (
    <Section id="projects" eyebrow="Selected work" title="Projects">
      <Reveal>
        <div
          className="glass glass-lens mb-8 inline-flex max-w-full flex-wrap items-center gap-1 rounded-full p-1.5 sm:mb-12"
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
                  "relative rounded-full px-4 py-2 text-sm font-medium transition active:scale-95",
                  isActive ? "text-white" : "text-muted hover:text-foreground",
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
      <motion.ul
        key={filter}
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6 lg:auto-rows-[6.5rem]"
        aria-live="polite"
        aria-label={`${visible.length} projects shown`}
      >
        {visible.map((project, i) => (
          <motion.li
            key={project.title}
            variants={cell}
            className={cn("min-w-0", tileClass(i, project.featured))}
          >
            <ProjectCard project={project} />
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
