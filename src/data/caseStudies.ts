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

export interface CaseStudyMilestone {
  title: string;
  status: string;
  body: string;
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
  /** Upcoming milestones, in delivery order — for projects still being built. */
  roadmap?: CaseStudyMilestone[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ppe-safety-platform",
    projectTitle: "PPE Safety Monitoring Platform",
    displayTitle: "PPE Safety Platform",
    headline:
      "A local-first, offline-capable PPE compliance platform that runs on one on-site server — it watches existing RTSP cameras, tracks every person, checks the PPE their zone requires over seconds rather than single frames, keeps snapshot-and-clip evidence for every confirmed miss, and learns from what the safety team reviews.",
    problem:
      "Industrial sites need to know who is on the floor without a helmet or vest, but cloud video analytics means streaming CCTV off-site, and naive detectors raise an alarm on every flickering frame until people stop looking. Off-the-shelf PPE models also confuse cloth caps with helmets and miss small items seen from high, wide camera angles. The brief: run entirely on one local server, never decide from a single frame, attach proof to every event, and get better on each site's own footage — without a model ever being swapped in behind a person's back.",
    role: "I lead the platform at Alta Vision as its architect and decision-maker — I set the product brief and requirements, signed off the architecture (Python vision and trainer services, a Bun + Hono API, a Next.js console, one-server deployment), and I make the product calls and own the milestone roadmap from the first client go-live to a white-label product.",
    approach: [
      {
        title: "Tracks, not frames — violations confirmed over seconds",
        body: "Each camera's light sub-stream runs person detection, ByteTrack tracking, then a PPE detector on batched person crops; an associator assigns every item to the right body region of the right track. Presence is smoothed per track and PPE type, and a person is judged by the smallest zone their feet stand in, after an entry grace period. A violation opens only after an item stays missing for 3 seconds and clears after 2 seconds of being seen, with one event per episode, a 60-second cooldown and an 80 px minimum person height — so a flicker never raises an alarm. Rules are a matrix of zone × PPE type, each with a severity and optional hours and weekdays.",
      },
      {
        title: "Evidence with every event",
        body: "The main stream is recorded continuously to local SSD as 60-second ffmpeg segments, stream-copied and never re-encoded. When an event closes, the recorder cuts a clip from 5 seconds before to 5 seconds after it, and annotated and raw snapshots come from a per-camera ring buffer of the last 3 seconds. Reviewers mark each event true or false positive, and false positives flow straight into the training queue. If the API is unreachable, events spool to disk and replay when it is back — detection never stops.",
      },
      {
        title: "A learning loop with a human at the gate",
        body: "The miner saves hard examples — PPE probabilities stuck in the uncertain band, low-confidence people, unusual-looking frames — rate-limited per person and camera. Reviewers correct boxes in a label editor and approve samples into immutable dataset versions. Training fine-tunes the active model during configured idle windows and pauses whenever live cameras need the GPU. Every candidate is scored against a permanent golden set it is never trained on, and activation stays manual: a passing score or a written reason, with one-click rollback.",
      },
      {
        title: "People across cameras, privacy by default",
        body: "Each confirmed track gets an appearance embedding, which re-attaches people after occlusion on the same camera and links them across cameras into a stable id such as P-1A2B3C4D with a journey of where they were seen. Face recognition is opt-in and matches only people an admin has named; face data of unnamed people is deleted after 7 days by default. PPE checking can be switched off per camera, which unloads the model and frees the GPU for security-only use.",
      },
      {
        title: "One codebase from a MacBook to a GPU server",
        body: "An InferenceProvider abstraction hides the backend behind one Detections contract — PyTorch on Apple Silicon MPS or CUDA, ONNX Runtime on CPU, CUDA or TensorRT — so it is developed on a Mac and deployed on Linux + NVIDIA with no code changes. Class maps let any model's vocabulary drive the configured PPE types, including \"no helmet\" classes counted as evidence of absence. Rule and setting changes hot-reload to every camera within 15 seconds, and go2rtc gives sub-second WebRTC live view with an annotated MJPEG fallback.",
      },
    ],
    architecture: [
      "Next.js 16 operator console: monitor wall with kiosk mode, zone editor, rules matrix, events, datasets, training, models, analytics, ⌘K palette",
      "Bun + Hono + Drizzle API: auth, four-role RBAC, audit log, WebSocket events, WebRTC signalling proxy, idle-training scheduler",
      "Zod contract package shared by the web app and the API",
      "Python vision service: decode → detect → ByteTrack → PPE association → temporal rules → events, plus recorder and hard-example miner",
      "Python trainer service: immutable dataset versions, idle-aware fine-tuning, golden-set evaluation, candidate registration",
      "Inference providers: PyTorch (MPS / CUDA), ONNX Runtime (CPU / CUDA / TensorRT), and a DeepStream integration point",
      "PostgreSQL 17 — or embedded, file-backed PGlite for single-box installs — with Redis for heartbeats, live frames and the training queue",
      "go2rtc for sub-second WebRTC live view; ffmpeg stream-copy recording to local SSD with retention by free space and age",
      "Caddy HTTPS (Let's Encrypt or an internal CA for offline sites), Docker Compose with the NVIDIA runtime, systemd units, one-click Windows and macOS installers",
    ],
    outcomes: [
      { value: "3 s", label: "Missing before a violation opens — never one frame" },
      { value: "0 cloud", label: "Video, evidence and models stay on the site server" },
      { value: "10 PPE types", label: "Helmet to harness, plus custom site types" },
      { value: "Human-gated", label: "No model goes live without a golden-set check" },
    ],
    roadmap: [
      {
        title: "Accounts",
        status: "In progress",
        body: "Request access from the sign-in page with admin approval, password reset that works offline through one-time admin links, invitations and change password. The server side is done; the screens are being built.",
      },
      {
        title: "Client go-live",
        status: "Next",
        body: "Camera presets, NVR bulk add and areas; one event for a person seen by overlapping cameras; visits and incidents with evidence packs; a storage view with disk forecast and 90-day retention; Test bench A/B compare; branded PDF and CSV reports; a load test and handover documents.",
      },
      {
        title: "Sell-ready white label",
        status: "Planned",
        body: "Signed licences with modules and camera limits, an Apps page that switches products on and off, and compiled releases with a licence server. The default model stack moves to licence-safe Apache-2.0 detectors such as RF-DETR, with every model's licence and provenance on record, plus a hygiene and food-safety PPE preset.",
      },
      {
        title: "Security system",
        status: "Later",
        body: "No-go zones with schedules, watchlist alerts, camera tamper, alarms and a site map — plus safety checks: fire and smoke early warning, person down, phone use, forklift proximity, safe corridors and occupancy limits.",
      },
      {
        title: "More apps",
        status: "Later",
        body: "A CCTV playback timeline with export and PTZ; people counting and area analytics with line counts, occupancy, heatmaps and dwell; vehicles and number plates; video search by text description; and time and attendance.",
      },
    ],
  },
  {
    slug: "fleet-flow",
    projectTitle: "Fleet Flow",
    displayTitle: "Fleet Flow",
    headline:
      "An IoT + ML fleet monitoring platform for a high-volume FMCG site — cameras at each station detect trucks and log every visit, and the platform turns those visits into live presence, turnaround durations and lost-time analysis so the site can optimise truck loading time.",
    problem:
      "Every minute a truck waits at a loading site is dispatch capacity lost, but without per-station data nobody can see where that time goes — which stations are busy or idle, how long each vehicle actually takes, and how much of it is lost time. Fleet Flow puts cameras at each station to detect trucks and record their visits, so turnaround becomes something the site can measure, report on and optimise instead of estimate.",
    role: "I led Fleet Flow as project manager and software architect: I owned scope and delivery, and made the technical decisions — the system architecture and stack, how camera data reaches the platform, the security model, and the quality gates the code has to pass.",
    approach: [
      {
        title: "Detection decoupled from the platform",
        body: "The camera side and the platform meet at the database, not in each other's code. Each station camera writes its detections into its own visit table — cam_1 through cam_10 — and the API derives live presence, visit history and durations from those rows. The detection model can be retrained or swapped without touching the API or the dashboards, and the platform runs and can be tested without a single live camera.",
      },
      {
        title: "From raw visits to lost time",
        body: "Visits only matter once they answer operational questions, so the platform rolls them up three ways: station views (availability, activity, which vehicles are on site right now), vehicle views (performance and duration insights per truck), and lost-time analysis that shows where turnaround time goes. Every registered vehicle gets a QR code, configurable reports preview in the browser and export to Excel or PDF, and Android-box wallboards put live station data on a screen at each station — served by the same Next.js app, so there is no second product to maintain.",
      },
      {
        title: "Security and operability are requirements",
        body: "Non-functional requirements are part of the design, not afterthoughts: JWT access tokens with refresh-token rotation, role-based access with granular permissions, an audit log and structured request logging, Helmet, a CORS allowlist and throttling, and liveness and readiness probes for monitoring. The API contract is published as Swagger/OpenAPI and checked into the repo, one validate script gates lint, formatting, type checks and the build, and a production checklist covers secrets, Swagger exposure and HTTPS.",
      },
      {
        title: "A modular, typed stack",
        body: "NestJS modules map one-to-one to the domain — auth, users, vehicles, stations, reports, health — over a Prisma schema with versioned migrations, and one setup command creates the database, migrates it and seeds the first admin and stations. The frontend is organised by feature, each with its own API client, hooks and types, with Redux Toolkit for state and React Hook Form + Zod for validated forms. Times default to the site's time zone, so durations and reports read in local time.",
      },
    ],
    architecture: [
      "Station cameras with IoT + ML truck detection, writing visits into per-camera tables (cam_1 … cam_10)",
      "NestJS 11 REST API under /api/v1 — auth, users, vehicles, stations, reports and health modules",
      "Prisma 6 on MySQL 8 or MariaDB, with versioned migrations and a one-command setup and seed",
      "Next.js 16 App Router + React 19 dashboard; Redux Toolkit, Tailwind CSS 4, Radix / shadcn UI, Recharts",
      "Android-box station wallboards served by the same Next.js app",
      "JWT + Passport + bcrypt auth with refresh-token rotation; role-based access with granular permissions; audit log",
      "Helmet, CORS allowlisting and throttling; liveness and readiness endpoints for monitoring",
      "ExcelJS and PDFKit report exports; optional email delivery via Nodemailer",
      "Swagger UI plus a checked-in OpenAPI document as the API contract",
    ],
    outcomes: [
      { value: "PM + Architect", label: "Scope, delivery and the technical decisions" },
      { value: "Live presence", label: "Which trucks are at which station, right now" },
      { value: "Lost time", label: "Where truck turnaround time actually goes" },
      { value: "Excel + PDF", label: "Configurable reports, previewed and exported" },
    ],
  },
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
