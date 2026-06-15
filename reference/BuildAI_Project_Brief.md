# BuildAI — Project Brief

> This file auto-loads when a Claude session starts inside the `BuildAI` folder. It is the always-on context for this project. If you open Claude anywhere else on the computer, none of this loads — it's a normal chat.

---

## What BuildAI is

A 13-week, remote-first, applied AI product engineering **apprenticeship** sold B2B2C through tier-2 Indian engineering colleges. Tagline: **"We don't teach AI. We make engineers who ship."**

Positioning is deliberate and non-negotiable: **not a course, not a bootcamp, not a certification.** It is an *apprenticeship infrastructure layer* — students ship real products reviewed by working engineers from AI startups, and the top tier gets fast-tracked to startup placement.

## Stage

Pre-launch / pre-pilot. Master Strategy is dated May 2026 as "Version 1.0 | Internal Working Document." No pilot college signed, India co-founder not hired, domain not purchased, mentor bench not recruited.

## Who it's for

- **Paying customer:** Tier-2 private engineering colleges in India. Buyer = TPO (primary), then Dean of Academics, HOD CS/IT, Principal.
- **End user:** CS/IT undergrads in years 2–4, top 20–30% of each college, builder mindset, wants startup exposure over corporate placement.
- **Mentors:** working engineers from Anthropic/OpenAI/Sarvam/CoRover/Zomato/Razorpay/CRED/YC-backed AI startups.
- **Phase 2 customer:** AI-first startups that hire the certified grads.

## The numbers (use these — don't re-derive)

| Lever | Value |
|---|---|
| Cohort length | 13 weeks |
| Target cohort size | 100 students (min pilot 30) |
| Pod size | 8–12 students, 1 lead mentor per pod |
| Student commitment | 15–20 hrs/week |
| Mentor commitment | 4–6 hrs/week per pod |
| Student-facing price | ₹20,000–₹25,000 (model midpoint ₹22,500) |
| College admin margin | ₹5,000–₹7,000 per student |
| BuildAI revenue/student | ₹15,000–₹18,000 (model uses ₹16,500) |
| Mentor comp | ₹15,000/week → ₹1,95,000 per mentor per cohort |
| Per-100-student cohort gross margin | ~41% (₹6.8L on ₹16.5L revenue) |
| Year 1 (model) | 3 colleges, 6 cohorts, 600 students, ₹1.13 cr revenue, 22% EBITDA |
| Year 5 (model, base case) | 70 colleges, 14,000 students, ₹29.8 cr revenue, 44% EBITDA |
| ARR claim (Master Strategy) | ₹1.5–1.8 cr at 5 college partnerships |

## Curriculum at a glance

6 modules over 13 weeks. Async weekdays + live Saturday (90 min) + Sunday peer review.

- **M0 — AI-Native Operating System** (Wk 1): Cursor, Claude Code, context engineering. Ship one app by end of week 1.
- **M1 — Product Engineering Fundamentals** (Wks 2–4): Next.js, Supabase/Postgres, auth, Vercel, Sentry. Ship 2 apps.
- **M2 — AI Product Patterns** (Wks 5–7): Claude/OpenAI/Together/Groq APIs, RAG with pgvector, agents. Ship one real AI product.
- **M3 — Evaluation & Reliability** (Wk 8): eval-driven dev, Langfuse/Helicone, regression suites.
- **M4 — Shipping in a Startup** (Wks 9–10): teams of 3–4, Linear, PRs, sprints.
- **M5 — Capstone** (Wks 11–13): public launch / OSS / real client project, reviewed by 2 internal mentors + 1 external AI-startup engineer.

**Threaded throughout:** bi-weekly Demo Days, weekly code reviews, weekly reading group (Anthropic blog, OpenAI cookbook, Simon Willison, Latent Space), Real-World Failure Exercises.

**Certification tiers (NO job guarantee):** Participated (~70%) / Apprentice Certified (~20%) / Distinction (~10%, fast-tracked to startup placement). Evaluated on 7 rubric dimensions: shipping velocity, engineering judgment, product thinking, AI fluency, collaboration, debugging, communication.

## Brand voice — strict

- Confident, declarative, slightly contrarian, founder-direct.
- **Not** Gen-Z. **Not** corporate. Reads like a sharp YC/McKinsey memo.
- Short sentences. Frequent em-dashes. Intentional negation pattern: "We are not X. We are Y."
- Visual identity: navy `#0A2540` + mint `#00D4AA`, Inter + Playfair Display.
- **On-brand vocabulary:** AI-native, ship/shipping/shipped, apprenticeship, pod, Distinction, tier-2, TPO, engineering judgment, Cursor/Claude Code, PRs, Demo Days, external reviewers, scarcity = trust, *earned, not granted*.
- **Frames to refuse:** "AI Course," "ChatGPT Training," "Skill Development Program," "Coding Bootcamp," "AI Certification." If a doc starts drifting toward these, push back before drafting.

## Founder

Sharad Agrawal — IIT Bombay '18 (Masters), Cornell MBA '24, currently founder of an AI-native company in the US. India co-founder hire is the single most important next move (target: ex-Scaler/Newton/upGrad early team OR ex-startup operator with TPO network, based in Bangalore/Delhi/Mumbai/Hyderabad).

## Open issues to fix before going further out

These are real inconsistencies across the source docs. Flag them before producing any new customer-facing material — don't compound them.

1. **Two contact emails in circulation.** Strategy/Positioning/Curriculum use `contact@meetskybloom.com`. Landing page/Brochure/Mentor One-Pager/Outreach/Deck use `contact@buildai.in` — but the domain isn't owned yet. Pick one and standardize.
2. **Mentor ratio contradiction.** Pod model says 1 mentor : 8–12 students. Financial model assumes 1 : 25 (4 mentors per 100-student cohort). Either pod sizes are wrong or mentor costs are understated by ~2×.
3. **Y1 revenue mismatch.** Strategy §15.2 says "3–4 colleges, 4 cohorts, 300–400 students, ₹60–70 L." Financial model Y1 says "3 colleges, 6 cohorts, 600 students, ₹1.13 cr." Strategy assumes ~1 cohort/college; model assumes 2.
4. **Pass-rate distribution.** Landing page promises ~10% Distinction as fact; Strategy says 10–15%. Pick a number for public copy.
5. **Cohort minimums vs. model.** Pilots may come in at 30 students; the financial model is built on 100. Per-cohort gross margin at 30 students is roughly break-even.
6. **Pricing still a band.** ₹20–25K everywhere customer-facing. Lock the number before colleges ask.

## File index

Reach for these on demand — don't auto-read all of them every session. The summary above is usually enough.

| File | What's in it | When to open it |
|---|---|---|
| `BuildAI_Master_Strategy.docx` | 16-section anchor: vision, problem, positioning, competition, GTM, risks, success metrics, long-term vision | Any strategic / positioning / "why" question |
| `BuildAI_Curriculum.docx` | Week-by-week syllabus, learning outcomes, deliverables, rubric, college integration models, commercial terms | Academic conversations, HOD meetings, curriculum committee submissions |
| `BuildAI_Implementation_Plan.docx` | 90-day execution playbook (Days 1–30 / 31–60 / 61–90), mentor ops, Day-180 goals, master checklist | "What do we do next week" or mentor ops |
| `BuildAI_Financial_Model.xlsx` | 5 sheets: Cover, Assumptions, Per-Cohort, Multi-Year, Phase 2, Sensitivity. Edit Assumptions sheet only | Unit economics, scenario modeling, investor-style projections |
| `BuildAI_Positioning_OnePager.docx` | TPO leave-behind with comparison table vs. Newton / upGrad / Internshala | Email attachment for first-meeting outreach |
| `BuildAI_Student_Brochure.docx` (+ `.pdf`) | Student-facing brochure for college distribution; intentionally intense tone | Student recruitment funnel |
| `BuildAI_Mentor_OnePager.docx` | Mentor pitch: comp, responsibilities, recognition tiers, hiring access | Engineer outreach |
| `BuildAI_Outreach_Emails.docx` | 8 templates: cold intro, 3 follow-ups, meeting confirm, post-meeting, pilot proposal, referral ask, forwardable blurb | Literal copy library for TPO outreach |
| `BuildAI_Landing_Page.html` | Single-page site (navy/mint, Inter+Playfair). Hero, problem, how-it-works, curriculum, tiers, 3-sided partnerships, founder, CTA | Deploy to Vercel; reference for visual identity in any new copy |
| `BuildAI_College_Pitch_Deck.pdf` (+ `.pptx`) | ~14-slide deck: Gap, Why-for-Colleges, Intro, How-It-Works, Day-in-the-Life, Curriculum, Evaluation, Certification, Outcomes, Commercial, Differentiation, Founder, Next Steps | Second meetings, leave-behind |

## Working preferences

- Treat the inconsistency list as a live punch-list. If we touch any of these areas, propose the fix and confirm before propagating.
- Don't generate new customer-facing copy that uses `@buildai.in` until the domain is confirmed owned. Default to `contact@meetskybloom.com` unless told otherwise.
- New files go in this folder. Use `BuildAI_<Purpose>.<ext>` naming.
- For deeper context on any one thread, open the relevant source doc — don't try to remember everything from this brief.
