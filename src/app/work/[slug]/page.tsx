import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import {
  getRepoActivity,
  githubRepoFromLinks,
  type RepoActivity,
} from "@/lib/github";
import { CommitMap } from "@/components/CommitMap";
import { CaseStudyNav } from "@/components/CaseStudyNav";
import { BrandIcon, hasBrandIcon } from "@/components/BrandIcon";
import { SocialIcon } from "@/components/SocialIcon";

/* Same 6-hour ISR cadence as the home page, for the commit map. */
export const revalidate = 21600;

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

/* Pushed within the last 90 days (evaluated at ISR render, 6h cadence). */
const isActive = (lastPush: string | null) =>
  !!lastPush && Date.now() - new Date(lastPush).getTime() < 90 * 86_400_000;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const project = projects.find((p) => p.title === study.projectTitle);
  return {
    title: `${study.displayTitle} — Case Study`,
    description: study.headline,
    alternates: { canonical: `/work/${slug}` },
    /* openGraph merges shallowly — the layout's url/siteName/locale would
       vanish unless restated here */
    openGraph: {
      type: "article",
      url: `/work/${slug}`,
      siteName: site.name,
      locale: "en_US",
      title: `${study.displayTitle} — Case Study — ${site.name}`,
      description: study.headline,
      authors: [site.name],
      images: project
        ? [
            {
              url: project.image,
              width: 1600,
              height: 880,
              alt: `Screenshot of ${project.title}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.displayTitle} — Case Study`,
      description: study.headline,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const project = projects.find((p) => p.title === study.projectTitle);
  if (!project) notFound();

  const repo = githubRepoFromLinks(project.links);
  const activity: RepoActivity | null = repo ? await getRepoActivity(repo) : null;

  const index = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  const navItems = [
    { id: "context", label: "Context" },
    ...study.approach.map((chapter, i) => ({
      id: `chapter-${i + 1}`,
      label: chapter.title.split(/[—:,]/)[0].trim(),
    })),
    { id: "stack", label: "Stack" },
    { id: "outcomes", label: "Outcomes" },
  ];

  // Rich-results eligibility: breadcrumb + article nodes per case study
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: study.displayTitle,
          item: `${site.url}/work/${slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: study.displayTitle,
      description: study.headline,
      image: `${site.url}${project.image}`,
      url: `${site.url}/work/${slug}`,
      author: { "@type": "Person", name: site.name, url: site.url },
    },
  ];

  return (
    <article className="mx-auto w-[min(72rem,calc(100%-2.5rem))] pb-24 pt-28 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* ── Masthead ─────────────────────────────────────────── */}
      <header>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          All work
        </Link>

        <p className="label mt-8 uppercase tracking-widest text-muted">
          Case study · {String(index + 1).padStart(2, "0")} /{" "}
          {String(caseStudies.length).padStart(2, "0")}
        </p>
        <h1 className="hero-heading mt-3 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight">
          {study.displayTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
          {study.headline}
        </p>

        {/* Outcome stats */}
        <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {study.outcomes.map((outcome) => (
            <div
              key={outcome.label}
              /* flex makes the order-* value-first swap actually apply */
              className="glass glass-lens bevel flex flex-col rounded-2xl p-4 sm:p-5"
            >
              <dt className="order-2 mt-1.5 text-xs leading-snug text-muted sm:text-sm">
                {outcome.label}
              </dt>
              <dd className="order-1 font-display text-xl font-black leading-tight sm:text-2xl">
                {outcome.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ── Hero screenshot ──────────────────────────────────── */}
      <div className="relative mt-10 overflow-hidden rounded-[1.6rem] ring-1 ring-[var(--line)] sm:mt-14">
        <Image
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          width={1600}
          height={900}
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="h-auto w-full object-cover"
        />
      </div>

      {/* ── Body: chapter rail + prose ───────────────────────── */}
      <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[13rem_1fr] lg:gap-16">
        <CaseStudyNav items={navItems} />

        <div className="min-w-0 max-w-3xl">
          <section id="context" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Context
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted">
              {study.problem}
            </p>
            <p className="mt-4 border-l-2 border-foreground pl-4 text-pretty font-medium leading-relaxed">
              {study.role}
            </p>
          </section>

          {study.approach.map((chapter, i) => (
            <section
              key={chapter.title}
              id={`chapter-${i + 1}`}
              className="mt-14 scroll-mt-28"
            >
              <p className="label uppercase tracking-widest text-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {chapter.title}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted">
                {chapter.body}
              </p>
            </section>
          ))}

          <section id="stack" className="mt-14 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Stack &amp; architecture
            </h2>
            <ul className="mt-5 space-y-2.5">
              {study.architecture.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-foreground"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--glass-border) px-2.5 py-1 font-mono text-[11px] font-medium text-muted"
                >
                  {hasBrandIcon(tech) && <BrandIcon name={tech} size={12} />}
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          <section id="outcomes" className="mt-14 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Where it stands
            </h2>

            <div className="glass glass-lens bevel mt-5 rounded-2xl p-5 sm:p-7">
              {activity && (
                <>
                  {/* Repo vitals */}
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Commits
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-black leading-none sm:text-3xl">
                        {activity.totalCommits.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Started
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-black leading-none sm:text-3xl">
                        {activity.startDate ? fmtMonth(activity.startDate) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Last push
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-black leading-none sm:text-3xl">
                        {activity.lastPush ? fmtMonth(activity.lastPush) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Status
                      </dt>
                      <dd className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <span
                          aria-hidden="true"
                          className={
                            isActive(activity.lastPush)
                              ? "h-2 w-2 rounded-full bg-emerald-500"
                              : "h-2 w-2 rounded-full bg-foreground/30"
                          }
                        />
                        {isActive(activity.lastPush)
                          ? "In active development"
                          : "Stable · maintained"}
                      </dd>
                    </div>
                  </dl>

                  {/* Full development span */}
                  <div className="mt-7">
                    <CommitMap activity={activity} variant="panel" />
                  </div>
                </>
              )}

              {project.links.length > 0 && (
                <div
                  className={`flex flex-wrap gap-3 ${activity ? "mt-7 border-t border-line pt-6" : ""}`}
                >
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slab px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-slab-fg shadow-lg transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-95"
                    >
                      {link.label.toLowerCase().includes("github") ? (
                        <SocialIcon name="github" size={14} />
                      ) : (
                        <ArrowUpRight size={14} aria-hidden="true" />
                      )}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ── Next case study ──────────────────────────────────── */}
      <footer className="mt-20 border-t border-line pt-10 sm:mt-24">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between gap-4"
        >
          <div>
            <p className="label uppercase tracking-widest text-muted">
              Next case study
            </p>
            <p className="mt-2 font-display text-2xl font-black uppercase tracking-tight sm:text-4xl">
              {next.displayTitle}
            </p>
          </div>
          <ArrowRight
            size={28}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-2"
          />
        </Link>
      </footer>
    </article>
  );
}
