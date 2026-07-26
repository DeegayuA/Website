import { Code2, BrainCircuit, Cpu, GraduationCap } from "lucide-react";
import { site, skills } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";

const focus = [
  {
    icon: <Code2 size={18} aria-hidden="true" />,
    title: "Software Engineering",
    body: "Production web platforms and internal tools, end to end.",
  },
  {
    icon: <BrainCircuit size={18} aria-hidden="true" />,
    title: "AI & Data Science",
    body: "ML models, forecasting, and computer-vision research.",
  },
  {
    icon: <Cpu size={18} aria-hidden="true" />,
    title: "Electronics & IoT",
    body: "Embedded firmware, sensors, and connected devices.",
  },
  {
    icon: <GraduationCap size={18} aria-hidden="true" />,
    title: "Teaching",
    body: "Lecturing web, mobile, and AI at university level.",
  },
];

const facts = [
  { k: "Now", v: "R&D Engineer · Alta Vision PLC" },
  { k: "Reading", v: "MSc Data Science & AI · UoM" },
  { k: "Reading", v: "Master of IT · UoK" },
  { k: "Teaching", v: "Visiting Lecturer · GWUIM" },
];

export function About() {
  return (
    <Section id="about" eyebrow="Profile" title="About" index="01 / Profile">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile card */}
        <Reveal className="lg:col-span-1">
          <div className="glass glass-lens bevel flex h-full flex-col gap-6 rounded-[1.6rem] p-7">
            <div className="flex items-center gap-4">
              <span className="orb flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-accent">
                DA
              </span>
              <div>
                <p className="font-display text-lg font-bold">{site.name}</p>
                <p className="font-mono text-xs text-muted">{site.location}</p>
              </div>
            </div>
            <dl className="flex flex-col gap-3">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-3 border-t border-(--glass-border) pt-3"
                >
                  <dt className="label text-muted">{f.k}</dt>
                  <dd className="text-right text-sm font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Bio + focus + stack */}
        <Reveal className="lg:col-span-2" delay={0.08}>
          <div className="glass glass-lens bevel flex h-full flex-col gap-8 rounded-[1.6rem] p-7 sm:p-9">
            <p className="text-pretty text-lg leading-relaxed sm:text-xl">
              {site.bio}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {focus.map((f) => (
                <div
                  key={f.title}
                  className="glass glint-host group relative overflow-hidden rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-accent">
                      {f.icon}
                    </span>
                    <h3 className="text-sm font-bold">{f.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted">{f.body}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="label mb-4 text-muted">Tools I reach for</h3>
              <ul className="flex flex-wrap gap-2" aria-label="Skills">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-(--glass-border) bg-accent-soft px-3.5 py-1.5 text-sm font-medium"
                  >
                    {hasBrandIcon(skill) && (
                      <BrandIcon name={skill} size={15} brand />
                    )}
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
