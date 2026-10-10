import { Hero } from "@/components/Hero";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { site, skills, socials } from "@/data/site";
import { work, education } from "@/data/experience";
import { projects } from "@/data/projects";
import {
  getRepoActivity,
  getUserContributions,
  githubRepoFromLinks,
  type RepoActivity,
} from "@/lib/github";

/* GitHub data refreshes every 6h via ISR — the page re-renders itself in the
   background on Vercel, keeping commit maps current for every repo (owned,
   contributed, open source) with no per-repo webhook setup. */
export const revalidate = 21600;

export const metadata = {
  alternates: { canonical: "/" },
};

/** Structured data for rich search results — a linked @graph so crawlers
    and AI agents resolve person/website/page as one entity. */
function JsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
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
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Kelaniya" },
      { "@type": "CollegeOrUniversity", name: "University of Moratuwa" },
    ],
    // Primary employer first; work[0] is the visiting-lecturer post
    worksFor: [
      { "@type": "Organization", name: "Alta Vision PLC" },
      { "@type": "Organization", name: work[0].org },
    ],
    knowsAbout: [
      ...new Set([
        "Web Development",
        "Machine Learning",
        "Artificial Intelligence",
        "Internet of Things",
        "Electronics",
        ...skills,
      ]),
    ],
    sameAs: socials.map((s) => s.href),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": `${site.url}/#person` },
    description: `Portfolio of ${site.name} — ${education[0].title} student at ${education[0].org}.`,
  };
  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${site.url}/#profile`,
    url: site.url,
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: { "@id": `${site.url}/#person` },
  };
  const graph = { "@context": "https://schema.org", "@graph": [person, website, profilePage] };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
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

  // The About graph uses the user's real GitHub contribution calendar — the
  // exact data behind the profile graph (all repos, only their activity).
  // Null without GITHUB_TOKEN; the section hides itself then.
  const combined = await getUserContributions("DeegayuA");

  return (
    <>
      <JsonLd />
      <Hero />
      <SkillsMarquee />
      <About contributions={combined} />
      <Projects activity={activity} />
      <Experience />
      <Certifications />
      <Contact />
    </>
  );
}
