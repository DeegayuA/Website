"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Star } from "lucide-react";
import type { Project } from "@/data/projects";
import { caseStudySlugFor } from "@/data/caseStudies";
import type { RepoActivity } from "@/lib/github";
import { SocialIcon } from "./SocialIcon";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";
import { CommitMap } from "./CommitMap";
import { cn } from "@/lib/utils";

const MAX_TILT = 5;

export function ProjectCard({
  project,
  compact,
  activity,
}: {
  project: Project;
  compact?: boolean;
  activity?: RepoActivity;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Cursor-tracked specular glint (pure CSS paint, no re-render)
    ref.current.style.setProperty(
      "--spot-x",
      `${((e.clientX - rect.left) / rect.width) * 100}%`,
    );
    ref.current.style.setProperty(
      "--spot-y",
      `${((e.clientY - rect.top) / rect.height) * 100}%`,
    );
    if (reduced || e.pointerType !== "mouse") return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
  };

  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const primaryLink = project.links[0];
  const studySlug = caseStudySlugFor(project.title);

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className="group glint-host h-full"
    >
      <article className="glass glass-lens glass-sheen bevel relative flex h-full flex-col overflow-hidden rounded-[1.4rem]">
        <span aria-hidden="true" className="glint" />

        {/* Whole-card click target. A pseudo-element on the title link can't
            reach the screenshot (its containing block is the inner
            `relative z-[4]` div), so a real overlay spans the article instead.
            aria-hidden + tabIndex -1: the title link below stays the one
            accessible/tabbable name for the card. */}
        {(studySlug || primaryLink) && (
          studySlug ? (
            <Link
              href={`/work/${studySlug}`}
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 z-[1] rounded-[1.4rem]"
            />
          ) : (
            <a
              href={primaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 z-[1] rounded-[1.4rem]"
            />
          )
        )}

        {/* Screenshot */}
        <div
          className={cn(
            "relative flex-1 overflow-hidden",
            compact ? "min-h-[11rem]" : "min-h-[13rem] sm:min-h-[16rem]",
          )}
        >
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          {/* Soft foot-fade only — keeps the shot legible, blends into the card */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/60 to-transparent"
          />
          {project.featured && (
            <span className="absolute left-3 top-3 z-[4] inline-flex items-center gap-1.5 rounded-full bg-spark-soft px-2.5 py-1 text-xs font-semibold text-spark backdrop-blur-md">
              <Star size={12} aria-hidden="true" className="fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* No z-index here: inert text lets taps fall through to the
            whole-card overlay; real links below raise themselves to z-[5] */}
        <div className="relative flex flex-col gap-3 p-6">
          <div>
            <p className="label text-accent">{project.tagline}</p>
            <h3 className="mt-1.5 font-display text-xl font-bold leading-snug">
              {studySlug ? (
                /* Card body opens the in-site case study; external links sit
                   below. z-[5] keeps the real link above the tap overlay. */
                <Link
                  href={`/work/${studySlug}`}
                  className="relative z-[5] hover:text-accent"
                >
                  {project.title}
                </Link>
              ) : primaryLink ? (
                <a
                  href={primaryLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-[5] hover:text-accent"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
          </div>

          <p className={cn("text-pretty text-sm leading-relaxed text-muted", compact ? "line-clamp-2" : "line-clamp-3")}>
            {project.description}
          </p>

          <ul
            className={cn("mt-auto flex flex-wrap gap-1.5 pt-2", compact && "hidden")}
            aria-label="Technologies"
          >
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-full border border-(--glass-border) px-2.5 py-1 font-mono text-[11px] font-medium text-muted transition-colors duration-300 hover:border-foreground/50 hover:text-foreground"
              >
                {hasBrandIcon(tech) && <BrandIcon name={tech} size={12} />}
                {tech}
              </li>
            ))}
          </ul>

          {/* Development-phase map — 52 weeks of commit activity */}
          {!compact && activity && <CommitMap activity={activity} />}

          {(project.links.length > 0 || studySlug) && (
            <div className="relative z-[5] flex flex-wrap gap-4 pt-1">
              {studySlug && (
                <Link
                  href={`/work/${studySlug}`}
                  className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  <BookOpen size={15} aria-hidden="true" />
                  Case study
                  <span className="sr-only"> — {project.title}</span>
                </Link>
              )}
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {link.label.toLowerCase().includes("github") ? (
                    <SocialIcon name="github" size={15} />
                  ) : (
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  )}
                  {link.label}
                  <span className="sr-only"> — {project.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}
