// Centralised realistic mock data for the BuildAI apprenticeship floor.
// No real APIs — everything here is illustrative cohort data.

export const COHORT = {
  name: "Spring 26",
  status: "Selection open",
  weeks: 13,
  currentWeek: 7,
  mode: "Remote · mentor-reviewed",
  demoDayInDays: 5,
  enrolled: 48,
  shipping: 41,
  atRisk: 5,
  mentorCoverage: 96,
};

export type WeekStatus = "shipped" | "active" | "upcoming";

export interface Week {
  n: number;
  title: string;
  focus: string;
  output: string;
  checkpoint: string;
  artifact: string;
  status: WeekStatus;
}

export const WEEKS: Week[] = [
  {
    n: 1,
    title: "AI-native development workflow",
    focus: "Working alongside coding agents, prompt-driven iteration, version control.",
    output: "Personal dev environment + first agent-built utility.",
    checkpoint: "Workflow review",
    artifact: "GitHub repo",
    status: "shipped",
  },
  {
    n: 2,
    title: "Product thinking & problem framing",
    focus: "Finding a real problem, scoping an MVP, writing a one-page product brief.",
    output: "Validated problem statement + product brief.",
    checkpoint: "Brief critique",
    artifact: "Product doc",
    status: "shipped",
  },
  {
    n: 3,
    title: "Frontend foundations",
    focus: "Component architecture, state, responsive layout, design tokens.",
    output: "Deployed interactive frontend prototype.",
    checkpoint: "UI review",
    artifact: "Deployed preview",
    status: "shipped",
  },
  {
    n: 4,
    title: "Backend & databases",
    focus: "APIs, relational data modelling, server-side logic.",
    output: "Working API with persisted data.",
    checkpoint: "Schema review",
    artifact: "API + schema",
    status: "shipped",
  },
  {
    n: 5,
    title: "Authentication & deployment",
    focus: "Auth flows, environments, CI, production deploys.",
    output: "Authenticated app live in production.",
    checkpoint: "Ship review",
    artifact: "Live URL",
    status: "shipped",
  },
  {
    n: 6,
    title: "LLM APIs",
    focus: "Calling models, structured output, streaming, cost & token budgets.",
    output: "First LLM-powered feature shipped.",
    checkpoint: "Reliability check",
    artifact: "Feature demo",
    status: "shipped",
  },
  {
    n: 7,
    title: "RAG & knowledge systems",
    focus: "Embeddings, retrieval, chunking, grounding answers in sources.",
    output: "RAG assistant grounded on a real corpus.",
    checkpoint: "Retrieval review",
    artifact: "RAG repo + demo",
    status: "active",
  },
  {
    n: 8,
    title: "Agents & workflows",
    focus: "Tool use, multi-step agents, orchestration, guardrails.",
    output: "Agent that completes a multi-step task.",
    checkpoint: "Agent design review",
    artifact: "Agent demo",
    status: "upcoming",
  },
  {
    n: 9,
    title: "Evaluation & reliability",
    focus: "Evals, regression sets, observability, failure analysis.",
    output: "Eval suite + reliability report.",
    checkpoint: "Eval review",
    artifact: "Eval dashboard",
    status: "upcoming",
  },
  {
    n: 10,
    title: "Product analytics & iteration",
    focus: "Instrumentation, funnels, acting on usage data.",
    output: "Instrumented product + iteration log.",
    checkpoint: "Metrics review",
    artifact: "Analytics view",
    status: "upcoming",
  },
  {
    n: 11,
    title: "Capstone build sprint",
    focus: "Full-stack AI product under shipping pressure.",
    output: "Feature-complete capstone candidate.",
    checkpoint: "Capstone checkpoint",
    artifact: "Capstone repo",
    status: "upcoming",
  },
  {
    n: 12,
    title: "Demo preparation",
    focus: "Narrative, live demo rehearsal, polishing the build.",
    output: "Rehearsed demo + recorded walkthrough.",
    checkpoint: "Dry-run review",
    artifact: "Demo video",
    status: "upcoming",
  },
  {
    n: 13,
    title: "Demo day & certification",
    focus: "Live demo to panel, peer review, final scoring.",
    output: "Final demo + certified portfolio.",
    checkpoint: "Panel evaluation",
    artifact: "Rubric score",
    status: "upcoming",
  },
];

export const TOOLS = [
  "Cursor", "Claude", "GitHub", "Supabase", "Vercel",
  "LLM APIs", "RAG", "Agents", "Evals",
];

export interface Project {
  id: string;
  title: string;
  student: string;
  college: string;
  week: number;
  tags: string[];
  blurb: string;
  rubric: number;
  tier: CertTier;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "AI Research Agent",
    student: "Aditya Rao",
    college: "VIT Vellore",
    week: 8,
    tags: ["Agents", "RAG", "Next.js"],
    blurb: "Multi-step agent that plans a research question, gathers sources, and writes a cited brief.",
    rubric: 92,
    tier: "Distinction",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=600&fit=crop&auto=format",
  },
  {
    id: "p2",
    title: "Campus Placement Dashboard",
    student: "Sneha Kulkarni",
    college: "PICT Pune",
    week: 7,
    tags: ["Full-stack", "Analytics", "Supabase"],
    blurb: "Operational dashboard for a TPO cell: drives, eligibility, and offer tracking in one view.",
    rubric: 88,
    tier: "Apprentice",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format",
  },
  {
    id: "p3",
    title: "RAG Knowledge Bot",
    student: "Mohammed Irfan",
    college: "NIT Trichy",
    week: 7,
    tags: ["RAG", "Embeddings", "LLM"],
    blurb: "Answers questions over a 400-page academic handbook with grounded, source-linked replies.",
    rubric: 90,
    tier: "Distinction",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=600&fit=crop&auto=format",
  },
  {
    id: "p4",
    title: "Healthcare Intake Assistant",
    student: "Priya Nair",
    college: "SRM Chennai",
    week: 8,
    tags: ["Agents", "Forms", "Evals"],
    blurb: "Conversational intake that structures patient symptoms into a triage-ready summary.",
    rubric: 85,
    tier: "Apprentice",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=600&fit=crop&auto=format",
  },
];

export type CertTier = "Participated" | "Apprentice" | "Distinction";

export const CERT_TIERS: {
  tier: CertTier;
  requirement: string;
  detail: string;
}[] = [
  {
    tier: "Participated",
    requirement: "Completed the 13 weeks",
    detail: "Attended the cohort and submitted weekly builds. Baseline proof of exposure.",
  },
  {
    tier: "Apprentice",
    requirement: "Shipped + mentor-reviewed",
    detail: "Shipped working products every cycle and passed mentor review with a rubric pass.",
  },
  {
    tier: "Distinction",
    requirement: "Top demo + high rubric",
    detail: "Exceptional capstone, strong demo-day score, and portfolio judged hire-ready.",
  },
];

export interface MentorNote {
  id: string;
  mentor: string;
  role: string;
  student: string;
  week: number;
  note: string;
  verdict: "approved" | "changes" | "review";
  time: string;
}

export const MENTOR_NOTES: MentorNote[] = [
  {
    id: "m1",
    mentor: "Kavya Menon",
    role: "Staff Eng · fintech",
    student: "Aditya Rao",
    week: 7,
    note: "Retrieval is solid. Chunk overlap is too aggressive — you're paying tokens for duplicate context. Tighten to 80 tokens and re-run evals before Friday.",
    verdict: "changes",
    time: "2h ago",
  },
  {
    id: "m2",
    mentor: "Rohit Desai",
    role: "ML Eng · search",
    student: "Sneha Kulkarni",
    week: 7,
    note: "Dashboard ships clean and the empty states are thoughtful. Approved for the week. Next: add an eval for the offer-prediction call.",
    verdict: "approved",
    time: "5h ago",
  },
  {
    id: "m3",
    mentor: "Ananya Iyer",
    role: "Founding Eng · devtools",
    student: "Mohammed Irfan",
    week: 7,
    note: "Grounding looks great but answers without a source should refuse, not guess. Add a confidence gate. Re-submit for review.",
    verdict: "review",
    time: "1d ago",
  },
];

export interface BuildLogEntry {
  time: string;
  who: string;
  event: string;
  kind: "ship" | "review" | "commit" | "deploy" | "flag";
}

export const BUILD_LOG: BuildLogEntry[] = [
  { time: "09:41", who: "aditya.rao", event: "deployed rag-agent v0.7 → production", kind: "deploy" },
  { time: "09:38", who: "k.menon", event: "left 3 review notes on rag-agent", kind: "review" },
  { time: "09:12", who: "sneha.k", event: "shipped Week 7 artifact · placement-dash", kind: "ship" },
  { time: "08:57", who: "m.irfan", event: "pushed 12 commits to knowledge-bot", kind: "commit" },
  { time: "08:44", who: "system", event: "flagged 2 students below shipping pace", kind: "flag" },
  { time: "08:30", who: "priya.nair", event: "deployed intake-assistant → preview", kind: "deploy" },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: Record<string, FaqItem[]> = {
  Colleges: [
    { q: "How much faculty effort does a pilot need?", a: "Minimal. BuildAI runs the cohort, mentoring, and reviews. Your team nominates students and receives weekly progress and a final outcome report. We handle the operational floor." },
    { q: "What do we actually see during the cohort?", a: "A College Command Center with weekly shipping progress, at-risk flags, mentor-review coverage, top projects, and certification distribution — updated every cycle." },
    { q: "Is this online or on-campus?", a: "The apprenticeship runs remote with mentor reviews. We can align checkpoints with your academic calendar." },
    { q: "What about placements?", a: "We use trust-safe language: opportunities, not guarantees. Distinction students may be surfaced to hiring partners based on proven portfolio work." },
  ],
  Students: [
    { q: "Do I need prior AI experience?", a: "No. You need solid programming fundamentals and the appetite to ship every week. The first weeks build the AI-native workflow from the ground up." },
    { q: "How much time per week?", a: "Plan for a serious commitment — this is an apprenticeship under real shipping pressure, not a passive course. Expect weekly deliverables and mentor reviews." },
    { q: "What do I graduate with?", a: "A portfolio of deployed AI products, mentor-reviewed evidence, a demo-day recording, and a tiered certification you can defend in any interview." },
    { q: "Is there a cost?", a: "Pricing depends on the college partnership and cohort. Join the waitlist and we'll share details for your campus." },
  ],
  Mentors: [
    { q: "What's the time commitment?", a: "You're assigned a small group of students. Each week you review their submissions, leave structured notes, and score against a rubric. Most reviews take a focused block per week." },
    { q: "Who can mentor?", a: "Working engineers who ship AI products in production. We look for people who can give specific, kind, high-signal feedback." },
    { q: "How is review structured?", a: "Every submission has a rubric: scope, correctness, reliability, product sense, and craft. You leave notes and a verdict — approved, changes, or re-review." },
  ],
  Programme: [
    { q: "How long is the apprenticeship?", a: "13 weeks: 13 shipping cycles building toward one final demo day. Each week pairs a skill focus with a product output and a mentor checkpoint." },
    { q: "What will I build?", a: "Real AI products — from frontends and backends to RAG systems, agents, and an evaluated capstone — deployed and reviewed throughout." },
    { q: "What tools are used?", a: "An AI-native stack: Cursor, Claude, GitHub, Supabase, Vercel, plus LLM APIs, RAG, agents, and evals." },
  ],
  Certification: [
    { q: "What are the tiers?", a: "Participated, Apprentice, and Distinction. Tiers reflect what you proved — completion, consistent mentor-reviewed shipping, or standout demo-day performance." },
    { q: "Is the certificate the point?", a: "No. The proof is the point: deployed products, mentor feedback, demo recordings, and rubric scores. The certificate just summarises the evidence." },
  ],
  Placements: [
    { q: "Do you guarantee a job?", a: "No. We never promise jobs. Distinction students may be surfaced to a future hiring network based on portfolio proof and demo performance — opportunities, not guarantees." },
    { q: "How will hiring work?", a: "Phase 2. Hiring partners will be able to review verified, mentor-validated portfolios. We're building this network now." },
  ],
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Programme", to: "/programme" },
  { label: "For Colleges", to: "/colleges" },
  { label: "For Students", to: "/students" },
  { label: "For Mentors", to: "/mentors" },
  { label: "Platform", to: "/platform" },
  { label: "Placements", to: "/placements" },
  { label: "FAQ / Apply", to: "/apply" },
];
