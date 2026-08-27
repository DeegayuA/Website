/**
 * ─────────────────────────────────────────────────────────────────
 *  CASE STUDIES — deep pages at /work/[slug] for flagship projects.
 *  `projectTitle` must exactly match a title in projects.ts; the page
 *  pulls image, tech and links from there so nothing is duplicated.
 *  Content was researched from the live products and repo READMEs —
 *  every metric here is verifiable, none are invented.
 * ─────────────────────────────────────────────────────────────────
 */

export interface CaseStudyChapter {
  title: string;
  body: string;
}

export interface CaseStudyOutcome {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  projectTitle: string;
  /** Short display title for headings and next/prev navigation. */
  displayTitle: string;
  headline: string;
  problem: string;
  role: string;
  approach: CaseStudyChapter[];
  architecture: string[];
  outcomes: CaseStudyOutcome[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "logpup",
    projectTitle: "LogPup",
    displayTitle: "LogPup",
    headline:
      "An internal engineering operations platform for Alta Vision — app portfolio, team capacity with burnout thresholds, kanban sprints, and AI meeting intelligence that understands both English and Sinhala.",
    problem:
      "Small engineering studios juggle project status, team allocation, sprint progress, and meeting follow-ups across disconnected tools, and overload tends to surface only after someone is already burnt out. Meetings at Alta Vision happen in a mix of English and Sinhala, which mainstream transcription tools handle poorly. LogPup consolidates all of it into one operational hub built around an \"Engineers First. Zero Spyware\" stance — daily outcome logging instead of keystroke tracking.",
    role: "I designed and built LogPup end to end: the data model, the Server Actions write layer with role-gated authorization, the capacity and burnout visualization, the Gemini-powered bilingual meeting pipeline, and the \"watchdog calm\" design system. It runs in production for Alta Vision's teams in Colombo.",
    approach: [
      {
        title: "No REST layer — Server Components read, Server Actions write",
        body: "Every read happens in React Server Components querying Neon Postgres through Drizzle, and every mutation is a Server Action returning a typed result. Role checks (admin vs member) are enforced server-side on every mutation, so the kanban board's drag-and-drop permissions aren't just UI hints. Optimistic updates keep the boards feeling instant while the action round-trips.",
      },
      {
        title: "Capacity that goes amber before anyone burns out",
        body: "Team members get allocation percentages per application, and the capacity bars shift from pine green to ember amber at 80% and to red overflow above 100%. The point is to make overload visible to the whole team before it becomes a resignation letter — paired with per-person contribution graphs and a Sri Lanka-aware calendar that knows Poya days and Mercantile holidays.",
      },
      {
        title: "Bilingual meeting intelligence without storing audio",
        body: "Meetings are recorded in-browser (mic or screen + mic) and transcribed by Google Gemini in mixed English and Sinhala. The pipeline extracts per-person notes, action items with deadlines, a software terminology glossary, and follow-up questions that resurface at the next meeting. Audio is never stored — only the structured output.",
      },
      {
        title: "BYO Gemini keys, encrypted and pooled",
        body: "Rather than a shared paid API key, each user registers up to five personal free-tier Gemini keys, stored with AES-256-GCM encryption under a dedicated secret. The system rotates requests across active keys when rate limits hit — engineering the pooling fairly was its own small scheduling problem.",
      },
    ],
    architecture: [
      "Next.js 16 App Router with React 19; Server Components for reads, Server Actions for all writes — no REST layer",
      "Neon Postgres via Drizzle ORM; nightly encrypted database backups on a cron",
      "Auth.js v5 with Google, Notion, and password sign-in, gated by allowed email domains",
      "Google Gemini for bilingual EN/Sinhala transcription and structured note extraction",
      "AES-256-GCM encryption for user-supplied Gemini API keys, up to 5 pooled per account",
      "Spotlight-style ⌘K command center with universal search and g+key navigation shortcuts",
      "One-way sprint export to Notion; role-gated drag-and-drop kanban with optimistic updates",
      "Tailwind v4 + shadcn UI; Vitest and Playwright for testing; deployed on Vercel",
    ],
    outcomes: [
      { value: "In production", label: "Running daily for Alta Vision teams in Colombo" },
      { value: "EN + සිංහල", label: "Bilingual meeting transcription via Gemini" },
      { value: "80 / 100%", label: "Amber and red-overflow burnout thresholds" },
      { value: "0 audio stored", label: "Meetings reduced to structured notes only" },
    ],
  },
  {
    slug: "solar-scada",
    projectTitle: "Solar SCADA & Mini-Grid Management Platform (Alta Vision)",
    displayTitle: "Solar SCADA Platform",
    headline:
      "A configuration-driven SCADA platform for Alta Vision's solar plants and mini-grids in Sri Lanka — live OPC UA and MQTT telemetry from GoodWe inverters and SEC3000 controllers, on web, desktop, and mobile.",
    problem:
      "Alta Vision operates solar assets that range from a 25 kW office mini-grid in Athurugiriya to the 2 MW Ranna solar plant, each with different inverters, controllers, and data protocols. Off-the-shelf SCADA packages tie the operator to one vendor's hardware and assume reliable connectivity, which rural Sri Lankan sites do not have. The company needed one dashboard that could be re-pointed at any plant's OPC UA address space and keep running on-site even when connectivity drops.",
    role: "I architected and built the platform end to end at Alta Vision: the Next.js application, the OPC UA/MQTT/WebSocket data layer, the per-plant configuration system, the AI-assisted datapoint generation, and the Electron and Capacitor packaging that puts the same codebase on plant PCs and phones.",
    approach: [
      {
        title: "One codebase, many plants: configuration as the product",
        body: "Every screen is generated from a typed DataPoint config — OPC UA node ID, data type, scaling factor, unit, UI widget, category. Commissioning a new site means producing a new config file, not new React code: the repo carries per-plant configs for the Colombo office mini-grid, the Ranna 2 MW plant, and a university research site, with inject scripts that swap the active plant. The Colombo config alone maps roughly 270 node IDs covering GoodWe inverter and SEC3000 controller registers.",
      },
      {
        title: "Talking to industrial hardware from Node",
        body: "The data layer runs node-opcua against the plant's OPC UA server, with MQTT subscriptions and raw WebSockets feeding the browser in real time. Inverter registers arrive as scaled integers (5163 meaning 51.63 V), so every datapoint declares its factor and OPC UA data type explicitly — getting a type wrong corrupts a reading silently, which is why the config is the single source of truth rather than ad-hoc parsing in components.",
      },
      {
        title: "AI-assisted commissioning instead of hand-typing register maps",
        body: "Mapping hundreds of registers per site by hand was the slowest part of every deployment, so I added an AI configuration path: an OPC UA discovery pass dumps the server's address space, and a Gemini-backed API route generates candidate DataPoint definitions — names, units, scaling, widget types — for an engineer to review. A configurable AI assistant with plant telemetry in its context also answers operator questions on the dashboard.",
      },
      {
        title: "Offline-first, because the grid edge has bad internet",
        body: "Sites cannot depend on connectivity, so the app runs as a local PWA served from a plant PC, with SQLite/IndexedDB persistence, backup and restore endpoints, and Windows installer scripts for non-technical deployment. The same build packages as an Electron desktop app and a Capacitor mobile app that points at a configurable backend URL, so operators get identical dashboards on the control-room PC and their phone.",
      },
    ],
    architecture: [
      "Next.js App Router + React 19 + TypeScript, with Zustand for client state",
      "node-opcua client against plant OPC UA servers; MQTT and raw WebSocket streams to the browser",
      "Typed per-plant DataPoint configs (node ID, data type, scale factor, widget) drive all UI rendering",
      "Google Gemini API routes for AI datapoint generation and a telemetry-aware operator assistant",
      "Single-line-diagram editor built on React Flow; drag-and-drop dashboards; Recharts for history",
      "better-sqlite3 + IndexedDB for local persistence, with backup/restore API routes",
      "Offline PWA plus Electron (Windows/macOS/Linux) and Capacitor (Android/iOS) packaging",
      "Radix UI + Tailwind CSS v4, light/dark themes, alarm system with visual and audio alerts",
    ],
    outcomes: [
      { value: "2 MW", label: "Largest plant on the platform, beside a 25 kW mini-grid" },
      { value: "~270", label: "OPC UA datapoints mapped in one plant config" },
      { value: "3 form factors", label: "Offline PWA, Electron desktop, Capacitor mobile" },
      { value: "In production", label: "Deployed across Alta Vision sites in Sri Lanka" },
    ],
  },
  {
    slug: "amperearc",
    projectTitle: "AmpereArc Production Floor Management System",
    displayTitle: "AmpereArc Factory ERP",
    headline:
      "A production-floor ERP for AmpereArc's battery energy storage factory — inventory, overseas procurement, GRN processing, QC inspections, and project material tracking with a six-role permission matrix.",
    problem:
      "AmpereArc manufactures battery energy storage systems, inverters, and LV panel boards in-house — cells, enclosures, power electronics, and assemblies. Running that factory means tracking materials from overseas proforma invoice through customs and landed cost, into stores, through QC inspection, and out to specific build projects, with every movement accountable. Spreadsheets and paper GRNs cannot enforce approval chains, role permissions, or an audit trail across that many hands.",
    role: "I designed and built the entire platform: data model, Firestore security rules, role-based permission system, every module from purchase orders to QC workflows, and the production deployment. It is a single-engineer, full-stack build.",
    approach: [
      {
        title: "Six roles, one permission matrix",
        body: "The factory has distinct jobs — admin, procurement manager, storekeeper, supervisor, quality engineer, technician — and the system encodes who can do what as a permission matrix rather than ad-hoc checks. Only admins delete records; PO approval sits with procurement; material requests need dual approval from a supervisor and then the storekeeper, with mandatory image proof attached. The same matrix is enforced twice: in the UI and in Firestore security rules, so a bypassed frontend still can't write.",
      },
      {
        title: "Landed cost for overseas procurement",
        body: "Batteries and power electronics arrive via overseas POs priced in USD, so a GRN's true unit cost isn't the invoice line. The GRN module allocates transport cost proportionally across received items, and the overseas flow computes landed cost from CIF value plus customs duty and CESS at the recorded exchange rate. VAT handling is date-aware — the system switches from 18% to 20.5% on the configured changeover date instead of relying on someone editing a constant.",
      },
      {
        title: "QC as a gate, not a checkbox",
        body: "Quality inspection sits at both ends of the store: incoming goods off a GRN and outgoing issues to a project each pass through a pass/reject/hold workflow owned by the quality engineer role. Hold is a real state — material can sit quarantined without being either accepted into stock or bounced back to the supplier, which matches how battery cell inspection actually works.",
      },
      {
        title: "Traceability by default",
        body: "Every inventory item carries QR codes with serial and batch tracking, and a label generator prints scannable tags for the shelf. Underneath, an immutable audit log records every system action — who moved stock, who approved what, when — so disputes resolve from history rather than memory. Analytics sit on top: KPI dashboard, stock-movement trends, and spend analysis from the same Firestore data.",
      },
    ],
    architecture: [
      "Next.js App Router with React 19 and TypeScript throughout",
      "Firebase: Authentication, Firestore database, Storage for documents and images",
      "Firestore security rules mirror the app's role permission matrix server-side",
      "Radix UI primitives with custom shadcn-style components, Tailwind CSS, dark/light themes",
      "Recharts for the KPI dashboard and spend/stock-movement analytics",
      "QR and barcode generation plus printable labels via jsPDF",
      "CSV/Excel export; drag-and-drop GRN document uploads",
      "Trilingual UI — English, Sinhala, and Tamil",
      "Deployed to production behind role-gated authentication",
    ],
    outcomes: [
      { value: "In production", label: "Running AmpereArc's factory floor daily" },
      { value: "6 roles", label: "Permission matrix from admin to technician" },
      { value: "EN / සිං / த", label: "Trilingual UI — English, Sinhala, Tamil" },
      { value: "Immutable", label: "Full audit log of every system action" },
    ],
  },
  {
    slug: "lifesight",
    projectTitle: "LifeSight",
    displayTitle: "LifeSight",
    headline:
      "A web-based vision assistant that lets visually impaired users point a camera at the world, ask a question by voice or text, and hear a spoken answer generated by a multimodal AI model — no app install, no special hardware.",
    problem:
      "Visually impaired people constantly face small reading and orientation tasks — a product label, a sign, a bus stop, the layout of a desk — that sighted people resolve in a glance. Dedicated assistive hardware is expensive and scarce in markets like Sri Lanka, while a smartphone or laptop with a camera and a browser is far more common. LifeSight turns that browser into the assistive device: camera in, spoken guidance out.",
    role: "I built LifeSight end to end: the Next.js web app, the camera-to-AI pipeline that sends frames and questions to Gemini, the voice interaction layer on the Web Speech API, and the accessibility settings system that reshapes the whole UI. It is deployed in production on Vercel.",
    approach: [
      {
        title: "Camera frame to answer in one round trip",
        body: "The assistant captures the live video element to a canvas, encodes the frame as JPEG, and sends it alongside the user's question as a single multimodal request to Gemini. The prompt frames the model as an assistant helping someone work independently, instructed to give clear step-by-step guidance from what it sees and hears. One request carries both image and text, so there is no separate OCR pass — reading a label and describing a scene are the same code path.",
      },
      {
        title: "Voice as the primary interface, text as fallback",
        body: "Input uses the browser's SpeechRecognition (with the webkit-prefixed fallback), and every response is spoken back through speechSynthesis, so the core loop never requires looking at the screen. Voice commands also drive the app itself — toggling the camera and microphone and cycling between devices. When speech recognition isn't supported, a text input with rotating example prompts covers the same flow.",
      },
      {
        title: "Accessibility settings that reshape the whole app",
        body: "A settings context threads font size, line height, letter spacing, accent color, high contrast, reduced motion, screen-reader mode, and anti-flicker through every component — text sizes are computed from the user's base font setting rather than hard-coded. Not one high-contrast page, but a UI whose typography, motion, and color the user tunes once and keeps everywhere.",
      },
      {
        title: "Shipping as a browser-first web app",
        body: "The product is built to run wherever a browser runs: the camera comes from getUserMedia, speech from the Web Speech API, and every capability degrades gracefully when an API is missing. That made deployment trivial and the app reachable from any modern device with no install — the constraint that mattered most for the people it serves.",
      },
    ],
    architecture: [
      "Next.js App Router frontend (React), deployed on Vercel",
      "Google Gemini multimodal model for image + text understanding and OCR-style reading",
      "getUserMedia camera capture; frames drawn to canvas and encoded as JPEG for the model",
      "Web Speech API: SpeechRecognition for voice input and commands, speechSynthesis for spoken replies",
      "Settings context: font size, line height, letter spacing, accent color, contrast, motion, anti-flicker",
      "Multi-device handling — cycles through available cameras and microphones by voice or UI",
      "Landing page with onboarding, volunteer sign-up, and a recorded demo walkthrough",
    ],
    outcomes: [
      { value: "Live", label: "In production at lifesight.vercel.app" },
      { value: "Tunable a11y", label: "Type, contrast, motion and speech, user-adjustable" },
      { value: "Zero install", label: "Runs in any modern browser with a camera" },
      { value: "Voice-first", label: "Full loop usable without looking at the screen" },
    ],
  },
  {
    slug: "greenwing",
    projectTitle: "GreenWing",
    displayTitle: "GreenWing",
    headline:
      "A university research project pairing a quadcopter, a YOLOv8 crop-detection model, and an ESP32 weather and irrigation network — so a field gets water only where its crops actually need it.",
    problem:
      "Conventional irrigation waters a whole field on a schedule, regardless of what is planted where or what the weather is doing, wasting both water and the energy spent pumping it. GreenWing set out to match water distribution to the specific crop species in each zone and the current weather conditions — and to make that level of precision usable by people without farming expertise. Built as a research project at the University of Kelaniya.",
    role: "I worked across the full stack of the system: the machine-learning crop-detection models, the Arduino/ESP32 firmware for the weather station and irrigation hardware, and the web dashboard that ties the sensor data and irrigation controls together.",
    approach: [
      {
        title: "Seeing the field from a drone",
        body: "Instead of burying soil sensors across an entire field, the system flies a quadcopter over it and identifies what is growing where. A YOLOv8 model, backed by an OpenCV pipeline, detects and classifies crops from the aerial imagery, so the irrigation plan knows which species sits in each zone. Flight range and energy use were explicit constraints in how the drone platform was specified.",
      },
      {
        title: "Weather as an input, not an afterthought",
        body: "A dedicated weather station built on ESP32 microcontrollers feeds live environmental data into the system. Irrigation decisions combine that weather data with per-species water requirements, so the system skips or scales watering when conditions already cover the crop's needs.",
      },
      {
        title: "Firmware and valves on ESP32",
        body: "The irrigation side is its own embedded subsystem: Arduino-based firmware driving valves and pumps, taking commands derived from the crop map and sensor readings. Splitting the repo into separate modules — crop ML, irrigation firmware, weather firmware — kept the embedded code and the ML pipeline independently testable.",
      },
      {
        title: "A dashboard for non-farmers",
        body: "Because the project's stated aim was letting people without farming expertise run effective agriculture, the web dashboard mattered as much as the hardware. Built with React on a Django backend over MySQL, it shows weather and irrigation data in real time and exposes the controls, and it shipped with a public demo and a recorded presentation.",
      },
    ],
    architecture: [
      "YOLOv8 + OpenCV computer-vision pipeline for crop detection from quadcopter imagery",
      "ESP32 microcontrollers running Arduino firmware for the weather station and irrigation hardware",
      "Quadcopter platform specified around flight range and energy constraints",
      "Python for the ML and processing layer",
      "React front end with a Django backend and MySQL database for the real-time dashboard",
      "Repo split into independent modules: crop ML/DL, irrigation firmware, weather firmware",
    ],
    outcomes: [
      { value: "YOLOv8", label: "Crop detection model trained and integrated" },
      { value: "3 subsystems", label: "Drone/ML, weather station, irrigation firmware" },
      { value: "Silicon → UI", label: "ESP32 firmware to web dashboard, one project" },
      { value: "Research", label: "Built at the University of Kelaniya" },
    ],
  },
  {
    slug: "solar-battery-solucion",
    projectTitle: "Solar Battery Solucion (SBS)",
    displayTitle: "Solar Battery Solucion",
    headline:
      "A bilingual Spanish/English platform for SBS, Madrid — commercial and industrial battery energy storage: containerized BESS, UPS systems, all-in-one units, and cloud energy monitoring, powered by AmpereArc technology.",
    problem:
      "Spanish factories, hospitals, data centers, and offices face rising peak-demand charges and real exposure to grid interruptions, but industrial energy storage is usually sold through opaque spec sheets in the wrong language. SBS needed a market-facing platform that explains BESS, UPS, and all-in-one storage lines to a Spanish-speaking commercial audience, pairs them with cloud monitoring, and converts operational anxiety — \"protege tus operaciones críticas\" — into concrete product inquiries.",
    role: "I built the platform end to end for the Spanish market launch: information architecture across the BESS/UPS/AIO product lines, the bilingual Spanish/English content structure, and the Next.js implementation tuned for fast first paint on commercial connections.",
    approach: [
      {
        title: "Product lines as the navigation spine",
        body: "The catalogue is organized the way an energy manager thinks: containerized systems for scale, commercial all-in-one units for compact sites, UPS for continuity, and the monitoring software that ties them together. Each line carries its value case — peak-demand reduction, grid-services revenue, renewable integration — rather than raw cell chemistry tables.",
      },
      {
        title: "Spanish-first, English alongside",
        body: "The market speaks Spanish; procurement often reads English. The platform is written Spanish-first with English navigation available, keeping technical vocabulary consistent across both so a spec discussed on a call matches what the site says in either language.",
      },
      {
        title: "AmpereArc under the hood",
        body: "SBS builds on AmpereArc battery technology — the same ecosystem behind the AmpereArc production-floor platform in this portfolio — so the storefront, the manufacturing line, and the monitoring cloud share one hardware story from cell to dashboard.",
      },
    ],
    architecture: [
      "Next.js with image-optimized product imagery for fast loads on commercial connections",
      "Bilingual Spanish/English information architecture with consistent technical vocabulary",
      "Product-line catalogue: containerized BESS, commercial all-in-one, UPS, monitoring software",
      "Cloud-based energy monitoring story integrated with the AmpereArc hardware ecosystem",
    ],
    outcomes: [
      { value: "Live", label: "In production at solarbatterysolucion.com" },
      { value: "ES + EN", label: "Bilingual platform for the Spanish market" },
      { value: "4 product lines", label: "Containerized BESS, AIO, UPS, monitoring" },
      { value: "Madrid", label: "Serving Spanish commercial & industrial buyers" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudySlugFor(projectTitle: string): string | undefined {
  return caseStudies.find((c) => c.projectTitle === projectTitle)?.slug;
}
