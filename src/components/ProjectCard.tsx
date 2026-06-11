"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { SocialIcon } from "./SocialIcon";
import { cn } from "@/lib/utils";

const MAX_TILT = 5;

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
    // Feed the cursor-tracked sheen (pure CSS paint, no React re-render)
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const primaryLink = project.links[0];

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1000,
      }}
      className="group h-full"
    >
      <article
        className={cn(
          "glass glass-lens glass-sheen relative flex h-full flex-col overflow-hidden rounded-3xl",
        )}
      >
        {/* Cursor-tracked specular sheen — lights up on hover */}
        <div aria-hidden="true" className="card-spot" />
        {/* Image fills the remaining height of the bento cell, so tall tiles
            show a taller crop and wide tiles a cinematic one */}
        <div className="relative min-h-[7rem] flex-1 overflow-hidden">
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>

        <div className="flex flex-col gap-3 p-6">
          <div>
            <p className="text-sm font-semibold text-accent">{project.tagline}</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight">
              {primaryLink ? (
                <a
                  href={primaryLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 after:rounded-3xl hover:text-accent"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
          </div>

          <p className="line-clamp-3 text-pretty text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-(--glass-border) px-2.5 py-1 text-xs font-medium text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          {project.links.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-4 pt-1">
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
