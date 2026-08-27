import { Hero } from "@/components/Hero";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { site, socials } from "@/data/site";
import { work, education } from "@/data/experience";
import { projects } from "@/data/projects";
import {
  getRepoActivity,
  githubRepoFromLinks,
  type RepoActivity,
} from "@/lib/github";

/* GitHub data refreshes every 6h via ISR — the page re-renders itself in the
   background on Vercel, keeping commit maps current for every repo (owned,
   contributed, open source) with no per-repo webhook setup. */
export const revalidate = 21600;

/** Structured data for rich search results. */
function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: `${site.url}/images/profile.webp`,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    jobTitle: site.roles,
    description: site.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kadawatha",
      addressCountry: "LK",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Kelaniya" },
    worksFor: { "@type": "Organization", name: work[0].org },
    knowsAbout: [
      "Web Development",
      "Machine Learning",
      "Artificial Intelligence",
      "Internet of Things",
      "Electronics",
    ],
    sameAs: socials.map((s) => s.href),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: `Portfolio of ${site.name} — ${education[0].title} student at ${education[0].org}.`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([person, website]).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function Home() {
  // Commit activity for every project with a GitHub link; failures skip silently
  const activity: Record<string, RepoActivity> = {};
  await Promise.all(
    projects.map(async (project) => {
      const repo = githubRepoFromLinks(project.links);
      if (!repo) return;
      const result = await getRepoActivity(repo);
      if (result) activity[project.title] = result;
    }),
  );

  return (
    <>
      <JsonLd />
      <Hero />
      <SkillsMarquee />
      <About />
      <Projects activity={activity} />
      <Experience />
      <Certifications />
      <Contact />
    </>
  );
}
