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
    title: "Solar SCADA & Mini-Grid Management Platform (Alta Vision)",
    tagline: "Commercial SCADA & multi-plant monitoring platform for solar power plants",
    description:
      "Engineered Alta Vision's commercial SCADA & mini-grid management platform, actively deployed across multiple utility-scale solar farms and mini-grid installations. Built with React + Next.js, featuring real-time GoodWe 120HT Series inverter telemetry, SEC3000 controllers, weather station IoT, AI-assisted configuration, and multi-source load optimization.",
    image: "/images/web_scada.png",
    categories: ["web", "ai", "iot", "software"],
    tech: ["Next.js", "React", "TypeScript", "OPC UA", "GoodWe SEC3000", "AI Optimization"],
    links: [
      { label: "Live SCADA Demo", href: "https://av-scada-demo.netlify.app/" },
      { label: "GitHub", href: "https://github.com/DeegayuA/AV_SCADA_RPP" },
    ],
    featured: true,
  },
  {
    title: "AmpereArc Production Floor Management System",
    tagline: "Production floor & factory management software for BESS battery manufacturing",
    description:
      "Engineered AmpereArc's digital production floor management platform for battery energy storage systems (BESS) manufacturing, workflow automation, quality control tracking, and real-time factory analytics.",
    image: "/images/web_amperearc.png",
    categories: ["web", "software"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "BESS Energy Systems"],
    links: [{ label: "Live Site", href: "https://production.amperearc.com/" }],
    featured: true,
  },
  {
    title: "Alta Vision Solar Portals (LK & UK)",
    tagline: "Official solar energy portals for Sri Lanka & United Kingdom",
    description:
      "Web applications driving commercial and residential solar adoption across Sri Lanka and the UK. Features custom solar ROI calculators, yield estimation, and clean energy solution showcases.",
    image: "/images/web_solar.png",
    categories: ["web"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    links: [
      { label: "Solar Sri Lanka", href: "https://solar.altavision.lk" },
      { label: "Alta Vision UK", href: "https://altavision.co.uk" },
    ],
    featured: true,
  },
  {
    title: "Alta Vision Power Systems",
    tagline: "Industrial power monitoring & grid telemetry portal",
    description:
      "Industrial power management portal providing utility operators and enterprise clients with real-time solar yield metrics, grid power telemetry, and load balance analytics.",
    image: "/images/web_power.png",
    categories: ["web", "iot"],
    tech: ["React", "Next.js", "REST APIs", "IoT Data Viz"],
    links: [{ label: "Power Portal", href: "https://power.altavision.lk" }],
  },
  {
    title: "Alta Vision Workforce Attendance System",
    tagline: "Internal employee attendance & workforce management portal",
    description:
      "Custom internal workforce management portal for Alta Vision PLC managing staff check-ins, duty logs, leave approvals, schedule tracking, and workforce analytics.",
    image: "/images/web_attendance.png",
    categories: ["web", "software"],
    tech: ["Next.js", "React", "Database", "Authentication", "Analytics"],
    links: [{ label: "Attendance Portal", href: "http://attendance.altavision.lk/" }],
  },
  {
    title: "LifeSight",
    tagline: "AI-powered vision assistance for visually impaired people",
    description:
      "Enhances accessibility for visually and hearing-impaired users with AI, OCR and voice recognition. WCAG 2.2 compliant with customizable interfaces and interactive tools.",
    image: "/images/web_lifesight.png",
    categories: ["web", "ai"],
    tech: ["React", "Next.js", "Google Cloud Vision", "Web Speech API", "Vercel"],
    links: [{ label: "Live site", href: "https://lifesight.vercel.app/web" }],
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
