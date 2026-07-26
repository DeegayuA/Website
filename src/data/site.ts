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
    "Full-Stack Developer",
    "AI & ML Engineer",
    "IoT Builder",
    "Researcher",
  ],
  tagline:
    "I design and build AI-powered web platforms, IoT systems and accessible digital experiences.",
  bio: "Developer and researcher from Sri Lanka with a background spanning computer science, electronics and physics. Currently teaching electronics and reading for a Master's in IT at the University of Kelaniya — while shipping projects that mix the web, machine learning and hardware.",
  location: "Kadawatha, Sri Lanka",
  locationUrl: "https://goo.gl/maps/gNUBb7oCYTCLjALT8",
  email: "Deeghayuadhikari01@gmail.com",
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

export const stats = [
  { value: 14, suffix: "+", label: "Projects shipped" },
  { value: 4, suffix: "+", label: "Certifications" },
  { value: 5, suffix: "+", label: "Years building" },
] as const;

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
  { label: "Contact", href: "#contact" },
] as const;
