export interface Certification {
  title: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  skills?: string[];
  issuerIcon?: "nvidia" | "aws" | "freecodecamp";
}

export const certifications: Certification[] = [
  {
    title: "Fundamentals of Deep Learning",
    issuer: "NVIDIA",
    issued: "Issued Dec 2025",
    credentialId: "1tO0Ys3ITkGJkXM3sgBKrQ",
    issuerIcon: "nvidia",
  },
  {
    title: "AWS Academy Graduate - Machine Learning for Natural Language Processing",
    issuer: "Amazon Web Services (AWS)",
    issued: "Issued Nov 2025",
    skills: ["Machine Learning"],
    issuerIcon: "aws",
  },
  {
    title: "AWS Academy Graduate - Generative AI Foundations",
    issuer: "Amazon Web Services (AWS)",
    issued: "Issued Nov 2025",
    skills: ["Artificial Intelligence (AI)"],
    issuerIcon: "aws",
  },
  {
    title: "AWS Academy Graduate - AWS Academy Data Engineering",
    issuer: "Amazon Web Services (AWS)",
    issued: "Issued Jun 2025",
    issuerIcon: "aws",
  },
  {
    title: "Fundamentals of Accelerated Data Science",
    issuer: "NVIDIA",
    issued: "Issued Jun 2025",
    credentialId: "P7Hq1rEUS6OwvnVGGaNDow",
    issuerIcon: "nvidia",
  },
  {
    title: "JavaScript Algorithms and Data Structures (Beta)",
    issuer: "freeCodeCamp",
    issued: "Issued Oct 2024",
    credentialId: "deeghayu_adhikari-jaads",
    skills: ["JavaScript", "Programming"],
    issuerIcon: "freecodecamp",
  },
  {
    title: "Machine Learning with Python",
    issuer: "freeCodeCamp",
    issued: "Issued Nov 2023",
    skills: ["Python (Programming Language)", "Programming"],
    issuerIcon: "freecodecamp",
  },
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    issued: "Issued Jun 2023",
    skills: ["HTML5", "JavaScript"],
    issuerIcon: "freecodecamp",
  },
];
