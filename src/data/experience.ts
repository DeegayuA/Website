/**
 * ─────────────────────────────────────────────────────────────────
 *  EXPERIENCE & EDUCATION — edit or add entries here.
 *  Newest first; they render top-down in the timeline.
 * ─────────────────────────────────────────────────────────────────
 */

export interface TimelineEntry {
  title: string;
  org: string;
  period: string;
  detail?: string;
}

export const work: TimelineEntry[] = [
  {
    title: "Graduate Teaching Assistant — Electronics",
    org: "Department of Physics and Electronics, University of Kelaniya",
    period: "Jul 2024 — Present",
    detail: "Teaching undergraduate electronics labs and supporting coursework.",
  },
  {
    title: "Volunteer Research Assistant",
    org: "Electronics Design & Innovation Centre, FOS, University of Kelaniya",
    period: "May 2024 — Present",
    detail: "Prototyping and research support across IoT and embedded projects.",
  },
];

export const education: TimelineEntry[] = [
  {
    title: "Master of Information Technology",
    org: "University of Kelaniya",
    period: "Jul 2024 — Present",
    detail: "Postgraduate studies focused on modern software systems and AI.",
  },
  {
    title: "BSc in Physical Science",
    org: "University of Kelaniya",
    period: "Jul 2021 — Apr 2024",
    detail: "Computer Science, Electronics and Physics.",
  },
];
