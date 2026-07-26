import { projects } from "./projects";
import { certifications } from "./certifications";

/**
 * ─────────────────────────────────────────────────────────────────
 *  SITE-WIDE CONTENT — edit this file to update your name, links,
 *  contact details, stats and skills. No code changes needed.
 * ─────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Deeghayu Adhikari",
  sinhalaName: "දීඝායු සුවහස් අධිකාරි",
  /** Shown under your name in the hero — rotates through these. */
  roles: [
    "Software Engineer",
    "Electronic Engineer",
    "AI / ML Engineer",
    "IoT & Embedded Systems",
    "Visiting Lecturer",
  ],
  tagline:
    "Software + electronic engineer crafting AI-driven platforms, embedded IoT systems, and premium web products.",
  bio: "Software and electronic engineer from Sri Lanka. I build production web platforms, AI/ML models, and embedded IoT systems end to end — from silicon to interface — as an R&D Engineer at Alta Vision PLC. Alongside the work I lecture in web, mobile, and AI, while completing a Master of Data Science & AI at the University of Moratuwa (CSE) and a Master of IT at the University of Kelaniya (FOS), both pending graduation.",
  location: "Kadawatha, Sri Lanka",
  locationUrl: "https://goo.gl/maps/gNUBb7oCYTCLjALT8",
  email: "deeghayuadhikari01@gmail.com",
  phone: "+94 70 220 70 70",
  phoneHref: "tel:+94702207070",
  whatsapp: "https://wa.link/x3r32z",
  telegram: "https://t.me/MrDrac01",
  /** Path inside /public — replace the PDF to update your CV. */
  cv: "/cv/Deeghayu_Adhikari_CV.pdf",
  url: "https://deeghayu.netlify.app",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/DeegayuA", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/deeghayu-adhikari-1994051a3/",
    icon: "linkedin",
  },
  { label: "X (Twitter)", href: "https://twitter.com/DeegayuA", icon: "twitter" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_mr.drac_/",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/Deeghayuadhikari",
    icon: "facebook",
  },
] as const;

/** Dynamic Stats calculated automatically from array lengths and current year */
export const stats = [
  { value: projects.length, suffix: "+", label: "Projects shipped" },
  { value: certifications.length, suffix: "+", label: "Certifications" },
  { value: new Date().getFullYear() - 2021, suffix: "+", label: "Years building" },
];

export const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Machine Learning",
  "TensorFlow",
  "IoT / ESP32",
  "Firebase",
  "Tailwind CSS",
  "PHP",
  "Java",
  "SQL",
  "OPC UA",
] as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
] as const;
