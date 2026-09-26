/**
 * Personal details and home-page content. Facts come from cv.md and the GitHub profile.
 * Leave a link empty to hide its button.
 */

export const profile = {
  name: "Tauhidur Rahman Tauhid",
  firstName: "Tauhidur",
  lastName: "Rahman",
  handle: "tauhid",
  role: "Full-stack software engineer",
  location: "Dhaka",
  intro: "I build Spring Boot and Next.js systems that run in production, like a bank's ticketing portal, and I write down",
  introAccent: "the trade-offs.",
  heroSticker: "// TODO: sleep",
  photo: "/images/portrait.jpg",
  photoCaption: ["tauhid.jpg", "IUT · SWE"],
  availability: "Open to work",
  links: {
    github: "https://github.com/tautau08",
    email: "tauhid062018@gmail.com",
    linkedin: "https://www.linkedin.com/in/tauhidur-rahman-tauhid/",
    facebook: "https://www.facebook.com/tauhidurrahman.tauhid.1/",
    /** File in /public, e.g. "/Tauhidur-Rahman-CV.pdf". The button hides until it exists. */
    cv: "/Tauhidur-Rahman-CV.pdf",
  },
} as const;

export const stats = [
  { value: "500–2k", label: "tickets a day through the bank portal I built" },
  { value: "80+", label: "production issues resolved as sole developer" },
  { value: "9", label: "projects across web, mobile, desktop and ML" },
  { value: "Top 10", label: "CodeRush 2.0 hackathon finalist, IUT" },
];

export const marquee = ["Spring Boot", "Next.js", "Microservices", "PostgreSQL", "TypeScript", "Kotlin", "Solidity", "Federated learning"];

export const experience = {
  company: "Reddot Digital Limited",
  initial: "R",
  titles: "Software Engineer (Part-time) · Software Engineer Intern",
  period: "Oct 2025 – Jul 2026",
  highlights: [
    { value: "80+", label: "issues resolved as sole developer" },
    { value: "1 click", label: "bulk close, down from 10+ minutes" },
    { value: "1–2 h/day", label: "of manual SLA reporting removed" },
  ],
  points: [
    "Built and shipped Lenden HelpDesk, Prime Bank's ticketing portal (500–2,000 tickets a day, 50–80 staff), now in production.",
    "Replaced OTP login with role-based access for Super Admin, Admin, Call Center and Ops teams.",
    "Engineered an SLA pipeline with PRE/POST breach alerts; led UAT across 7 client meetings before go-live.",
  ],
  stack: ["Java 17", "Spring Boot 3", "Spring Security", "PostgreSQL", "Next.js 15", "TypeScript"],
};

export const education = {
  period: "2022 – 2026",
  degree: "B.Sc. in Software Engineering",
  school: "Islamic University of Technology (IUT)",
};

export const achievements = "Top 10 finalist, CodeRush 2.0 · World rank 91, Physics Brawl Online 2023";

export const skills = [
  { title: "Back end", items: ["Java", "Spring Boot", "Spring Security", "Node.js", "REST", "Microservices", "JWT"] },
  { title: "Front end & mobile", items: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Kotlin", "Android SDK"] },
  { title: "Data", items: ["PostgreSQL", "MySQL", "SQL Server", "MongoDB", "Firebase"] },
  { title: "AI, Web3 & tools", items: ["Vercel AI SDK", "Claude", "Gemini", "Solidity", "Hardhat", "Playwright", "Git"] },
];

export const contact = {
  pitch: "Hiring for a backend or full-stack role, or need a hand with a Spring Boot or Next.js project? Send me a message.",
  petCaption: "My cat Biscoot, on a break",
  status: "But I'm open to work!",
  /** Quick facts in the panel beside the form. Local time is added live from `timeZone`. */
  timeZone: { id: "Asia/Dhaka", label: "UTC+6" },
  facts: [
    { label: "Based in", value: "Dhaka, Bangladesh" },
    { label: "Replies", value: "Within a day or two" },
    { label: "Open to", value: "Backend & full-stack roles, freelance projects" },
  ],
  /** The message form. Each topic becomes the email subject and swaps the message placeholder. */
  form: {
    topics: [
      { value: "hiring", label: "Hiring", placeholder: "Tell me about the role, the team and the stack…" },
      { value: "project", label: "Freelance project", placeholder: "What are you building, and by when?" },
      { value: "collab", label: "Collaboration", placeholder: "What do you have in mind?" },
      { value: "hello", label: "Just saying hi", placeholder: "Say hello, ask a question or share feedback…" },
    ],
    sentTitle: "Message sent.",
    sentBody: "I'll reply to {email}, usually within a day or two.",
  },
};
