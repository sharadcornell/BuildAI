export const SITE = {
  name: "BuildAI",
  domain: "buildai.global",
  email: "contact@buildai.global",
  tagline: "We don't teach AI. We make engineers who ship.",
  founder: "Sharad Agrawal",
};

export const NAV_LINKS = [
  { href: "/programme", label: "Programme" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/certification", label: "Certification" },
  { href: "/for-colleges", label: "Colleges" },
];

export const FOOTER_LINKS = [
  {
    heading: "Programme",
    links: [
      { href: "/programme", label: "How it works" },
      { href: "/curriculum", label: "Curriculum" },
      { href: "/certification", label: "Certification" },
      { href: "/placements", label: "Placements" },
    ],
  },
  {
    heading: "Audiences",
    links: [
      { href: "/for-colleges", label: "For colleges" },
      { href: "/for-students", label: "For students" },
      { href: "/for-mentors", label: "For mentors" },
      { href: "/partners", label: "Partners" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export const MODULES = [
  {
    id: "M0",
    weeks: "Week 1",
    title: "AI-Native Operating System",
    body: "Cursor, Claude Code, context engineering. Ship one working app by the end of week one.",
  },
  {
    id: "M1",
    weeks: "Weeks 2–4",
    title: "Product Engineering Fundamentals",
    body: "Next.js, Supabase/Postgres, auth, Vercel, Sentry. Ship two real apps.",
  },
  {
    id: "M2",
    weeks: "Weeks 5–7",
    title: "AI Product Patterns",
    body: "Claude / OpenAI / Together / Groq APIs, RAG with pgvector, agents. Ship one real AI product.",
  },
  {
    id: "M3",
    weeks: "Week 8",
    title: "Evaluation & Reliability",
    body: "Eval-driven development, Langfuse / Helicone, regression suites.",
  },
  {
    id: "M4",
    weeks: "Weeks 9–10",
    title: "Shipping in a Startup",
    body: "Teams of 3–4, Linear, PRs, sprints. Work the way startups actually work.",
  },
  {
    id: "M5",
    weeks: "Weeks 11–13",
    title: "Capstone",
    body: "Public launch / OSS / real client project — reviewed by 2 internal mentors + 1 external AI-startup engineer.",
  },
];

export const TIERS = [
  {
    name: "Participated",
    share: "~70%",
    body: "Completed the apprenticeship and shipped the core deliverables.",
  },
  {
    name: "Apprentice Certified",
    share: "~20%",
    body: "Demonstrated real engineering judgment and shipping velocity across the cohort.",
  },
  {
    name: "Distinction",
    share: "~10%",
    body: "Top tier — fast-tracked to interviews with AI-first startups. Earned, not granted.",
  },
];

export const RUBRIC = [
  "Shipping velocity",
  "Engineering judgment",
  "Product thinking",
  "AI fluency",
  "Collaboration",
  "Debugging",
  "Communication",
];

export const STATS = [
  { value: "13", label: "weeks, end to end" },
  { value: "15–20", label: "hrs / week, async + live" },
  { value: "8–12", label: "students per pod, 1 lead mentor" },
  { value: "100%", label: "of grading is shipped work" },
];
