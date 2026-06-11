/**
 * ─────────────────────────────────────────────────────────────────
 *  PROJECTS — to add a project, copy one block, drop its screenshot
 *  into /public/images and list it here. First items appear first;
 *  `featured: true` renders a wider card.
 *  Categories: "web" | "ai" | "iot" | "software" | "other"
 * ─────────────────────────────────────────────────────────────────
 */

export type Category = "web" | "ai" | "iot" | "software" | "other";

export interface Project {
  title: string;
  tagline: string;
  description: string;
  image: string;
  categories: Category[];
  tech: string[];
  links: { label: string; href: string }[];
  featured?: boolean;
}

export const categories: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Web", value: "web" },
  { label: "AI / ML", value: "ai" },
  { label: "IoT", value: "iot" },
  { label: "Software", value: "software" },
  { label: "Other", value: "other" },
];

export const projects: Project[] = [
  {
    title: "SCADA for Renewable Power Plants",
    tagline: "Drag-and-drop SCADA with a best-in-class UI/UX",
    description:
      "A highly configurable SCADA interface for renewable energy systems featuring a React Flow based drag-and-drop editor for custom monitoring layouts. Talks to industrial devices over OPC UA and generates UI components dynamically, with an AI-enhanced user experience.",
    image: "/images/scada.jpg",
    categories: ["web", "ai", "iot", "software"],
    tech: ["Next.js", "React Flow", "TypeScript", "OPC UA", "Tailwind CSS", "shadcn/ui"],
    links: [{ label: "GitHub", href: "https://github.com/DeegayuA/AV_SCADA_RPP" }],
    featured: true,
  },
  {
    title: "LifeSight",
    tagline: "AI-powered vision assistance for visually impaired people",
    description:
      "Enhances accessibility for visually and hearing-impaired users with AI, OCR and voice recognition. WCAG 2.2 compliant with customizable interfaces and interactive tools.",
    image: "/images/lifesight.jpg",
    categories: ["web", "ai"],
    tech: ["React", "Next.js", "Google Cloud Vision", "Web Speech API", "Vercel"],
    links: [{ label: "Live site", href: "https://lifesight.vercel.app/" }],
    featured: true,
  },
  {
    title: "NIC Validation & Location Finder",
    tagline: "Real-time, scalable data-validation platform",
    description:
      "Microservices-based web app for real-time National Identity Card validation and location lookup. Firebase Realtime Database for instant sync, engineered for batch processing and data-science workflows.",
    image: "/images/nicvalidator.jpg",
    categories: ["web", "software"],
    tech: ["Microservices", "Firebase", "REST APIs", "Batch Processing"],
    links: [],
  },
  {
    title: "Queue Management for Healthcare",
    tagline: "Patient-queue optimization for IDH Sri Lanka",
    description:
      "Built for the National Institute of Infectious Diseases, Sri Lanka. Reduces wait times and optimizes patient flow with machine learning and secure encryption.",
    image: "/images/idh.jpg",
    categories: ["web", "ai"],
    tech: ["PHP", "SQLite3", "AES-256", "Random Forest", "ESP32"],
    links: [{ label: "GitHub", href: "https://github.com/DeegayuA/idh" }],
  },
  {
    title: "MoodCheer",
    tagline: "AI-powered mood booster & data-awareness experiment",
    description:
      "Generates uplifting comments with Gemini AI while anonymously logging interactions to highlight online privacy in a playful way.",
    image: "/images/flowers.jpg",
    categories: ["web", "ai"],
    tech: ["JavaScript", "Gemini AI", "Firebase"],
    links: [{ label: "Live site", href: "https://deegayua.github.io/Flowers/" }],
  },
  {
    title: "GreenWing",
    tagline: "Quad-copter based intelligent irrigation system",
    description:
      "Research project combining IoT, machine learning, drones and image processing for precision irrigation.",
    image: "/images/greenwing.jpg",
    categories: ["iot", "ai"],
    tech: ["IoT", "ML", "Drones", "Image Processing"],
    links: [{ label: "GitHub", href: "https://github.com/DeegayuA/GreenWing" }],
  },
  {
    title: "SnapLearn",
    tagline: "AI-based assignment solver for Android",
    description:
      "Android app that solves assignments from a photo using AI.",
    image: "/images/snaplearn.jpeg",
    categories: ["software", "ai"],
    tech: ["Android", "Java", "AI"],
    links: [{ label: "GitHub", href: "https://github.com/DeegayuA/SnapLearn" }],
  },
  {
    title: "TalkWave",
    tagline: "React chat application front end",
    description:
      "A clean, modern chat application interface built with React.",
    image: "/images/talkwave.jpg",
    categories: ["web"],
    tech: ["React", "CSS"],
    links: [{ label: "GitHub", href: "https://github.com/DeegayuA/TalkWave" }],
  },
  {
    title: "COST CAFE",
    tagline: "Cafe management software with access control",
    description:
      "Desktop cafe-management system with role-based access control, built in Java.",
    image: "/images/costcafe.jpg",
    categories: ["software"],
    tech: ["Java"],
    links: [{ label: "GitHub", href: "https://github.com/DeegayuA/COST_CAFE" }],
  },
  {
    title: "ASSA | UOK",
    tagline: "Applied Statistics Students' Association website",
    description:
      "Official website of the ASSA society of the University of Kelaniya.",
    image: "/images/assa.jpg",
    categories: ["web"],
    tech: ["HTML", "CSS", "JavaScript", "Netlify"],
    links: [{ label: "Live site", href: "https://assauok.netlify.app/" }],
  },
  {
    title: "SCSSA | UOK",
    tagline: "Statistics & Computer Science Students' Association",
    description:
      "Website for the Statistics and Computer Science Students' Association of the University of Kelaniya.",
    image: "/images/scssa.jpg",
    categories: ["web"],
    tech: ["HTML", "CSS", "JavaScript", "Netlify"],
    links: [{ label: "Live site", href: "https://scssa.netlify.app/" }],
  },
  {
    title: "ESS | UOK",
    tagline: "Electronics Students' Society website",
    description:
      "Website for the Electronics Students' Society of the University of Kelaniya.",
    image: "/images/ess.jpg",
    categories: ["web"],
    tech: ["HTML", "CSS", "JavaScript", "Netlify"],
    links: [{ label: "Live site", href: "https://essuok.netlify.app/" }],
  },
  {
    title: "DSCS Website, FOS, UOK",
    tagline: "Department of Statistics & Computer Science",
    description:
      "Website for the Department of Statistics and Computer Science, Faculty of Science, University of Kelaniya.",
    image: "/images/dscs.jpg",
    categories: ["web"],
    tech: ["HTML", "CSS", "JavaScript", "Netlify"],
    links: [
      { label: "Live site", href: "https://stat-cs-consultant-service.netlify.app/" },
    ],
  },
  {
    title: "Sagawunu Muthukata",
    tagline: "Short film — a chance encounter at a train station",
    description:
      "A gripping short film I produced — a chance encounter at a train station changes everything.",
    image: "/images/shortfilm.jpg",
    categories: ["other"],
    tech: ["Film", "Direction", "Editing"],
    links: [
      { label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=uFFbtAG7TzI" },
    ],
  },
];
