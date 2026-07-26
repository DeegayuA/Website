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

/* Bento tile sizes (lg = 4-col track + auto-rows). These six shapes — big,
   small, two tall, wide, small — tile a perfect 4×5 block, so the grid mixes
   sizes yet always fills four across with no empty cells. Assigned by index,
   so every block (and every filtered set) starts fresh and packs cleanly. */
const BENTO = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-3", // big
  "sm:col-span-1 lg:col-span-1 lg:row-span-2", // small
  "sm:col-span-1 lg:col-span-1 lg:row-span-3", // tall
  "sm:col-span-1 lg:col-span-1 lg:row-span-3", // tall
  "sm:col-span-2 lg:col-span-2 lg:row-span-2", // wide
  "sm:col-span-1 lg:col-span-1 lg:row-span-2", // small
];
function tileClass(i: number) {
  return BENTO[i % BENTO.length];
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  return (
    <Section id="projects" eyebrow="Selected work" title="Projects" index="02 / Work">
      <Reveal>
        <div
          className="glass glass-lens bevel mb-8 inline-flex max-w-full flex-wrap items-center gap-1 rounded-full p-1.5 sm:mb-12"
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
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95",
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
      <motion.ul
        key={filter}
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[9rem]"
        aria-live="polite"
        aria-label={`${visible.length} projects shown`}
      >
        {visible.map((project, i) => (
          <motion.li
            key={project.title}
            variants={cell}
            className={cn("min-w-0", tileClass(i))}
          >
            <ProjectCard project={project} />
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
