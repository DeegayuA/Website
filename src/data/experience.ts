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
  /** Still running — renders an "In progress" pill. */
  ongoing?: boolean;
}

export const work: TimelineEntry[] = [
  {
    title: "Visiting Lecturer",
    org: "Gampaha Wickramarachchi University of Indigenous Medicine",
    period: "Sep 2025 — Present",
    detail: "Lecturing Web Application Development (BHBM 21061 P), Mobile App Development (HICT 33013), and Artificial Intelligence (HICT 41052 & HICT 41061 P).",
  },
  {
    title: "Research and Development Engineer",
    org: "Alta Vision PLC",
    period: "Apr 2025 — Present",
    detail: "Building full-stack platforms, AI-assisted tooling, and embedded/IoT integrations end to end — from data pipelines and device firmware to production web interfaces.",
  },
  {
    title: "Graduate Teaching Assistant",
    org: "Department of Physics & Electronics, University of Kelaniya",
    period: "Jul 2024 — Mar 2025",
    detail: "Conducting electronics laboratory sessions, tutorials, PCB design, microprocessor programming, and undergraduate mentorship.",
  },
  {
    title: "Voluntary Research Assistant",
    org: "Electronics Design & Innovation Centre (EDIC), FOS, University of Kelaniya",
    period: "May 2024 — Mar 2025",
    detail: "Prototyping, AIoT research, embedded systems, and machine learning research support.",
  },
  {
    title: "Electronics Lead",
    org: "Project E-WASTE, University of Kelaniya",
    period: "Dec 2023 — Nov 2024",
    detail: "Leading e-waste recycling initiatives and hardware electronics design.",
  },
];

export const education: TimelineEntry[] = [
  {
    title: "Master of Data Science & AI",
    org: "Department of Computer Science Engineering, Faculty of Engineering, University of Moratuwa (UOM)",
    period: "Apr 2025 — Present",
    detail: "Postgraduate specialization in machine learning, deep learning, artificial intelligence, and computer vision.",
    ongoing: true,
  },
  {
    title: "Master of Information Technology (MIT)",
    org: "Department of Industrial Management, Faculty of Science, University of Kelaniya (UOK)",
    period: "Aug 2024 — Present",
    detail: "Postgraduate studies focused on modern software systems, web engineering, and IT architecture.",
    ongoing: true,
  },
  {
    title: "BSc in Physical Science",
    org: "Department of Physics & Electronics, Faculty of Science, University of Kelaniya (UOK)",
    period: "Jul 2021 — Apr 2024",
    detail: "Computer Studies, Electronics, and Physics.",
  },
];
