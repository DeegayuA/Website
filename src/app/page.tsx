import { Hero } from "@/components/Hero";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { site, socials } from "@/data/site";
import { work, education } from "@/data/experience";

/** Structured data for rich search results. */
function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    jobTitle: site.roles[0],
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify([person, website]) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <SkillsMarquee />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
