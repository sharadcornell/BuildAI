# BuildAI — Website & Platform Build Brief + Claude Code Execution Plan

**Version 1.0 · June 15, 2026 · Internal build spec**
**Purpose:** A single document you paste into Claude Code to build and deploy BuildAI in Next.js. It answers the 10 questions from your template, locks the architecture, and gives a phased, copy-paste execution plan.

---

## 0. Read this first (TL;DR)

You're building **two things**, not one:

1. **Marketing site** — multi-page, Swiss design (red field / black cards / yellow accents), heavy 3D-look. Converts colleges → "Run a Pilot," students → waitlist, mentors → apply. **This can be live on a Vercel URL in days.**
2. **The platform** — student/mentor/admin login + dashboards, per-student model API keys, usage metering, and full query/response logging. **This is real software and should ship in phases, not all at once.**

**Stack (recommended):** Next.js 15 (App Router, TypeScript) + Tailwind + **Supabase** (auth + Postgres + RLS) + **Vercel** (hosting) + **LiteLLM** (issues student API keys, meters usage, enforces budgets) + **Langfuse** (logs every prompt + response) + **Resend** (email). Payments: not needed for v1.

**Is Supabase fine, or self-host a backend?** Supabase is the right call — don't self-host a custom backend. *One nuance:* Supabase can't proxy/meter/log LLM calls, so the "issue keys + log every query" requirement is handled by adding an **LLM gateway (LiteLLM)** alongside Supabase. You self-host *only* that small gateway (one container on Railway/Render). Everything else is managed. Details in §2 and §7.

**Domain:** `buildai.global` (separate company from SkyBloom). Deploy to a Vercel URL now (`buildai.vercel.app`), connect `buildai.global` later. Contact email standardizes to `contact@buildai.global` — see §13 for the email/domain action items.

**Three things I will NOT silently build (decide these — §13):**
- A **client/logos wall claiming IIT Bombay / IIT Madras etc. as past customers.** You're pre-pilot with zero colleges signed, your ICP is *tier-2* colleges (IITs are tier-1), and "IIT Bangalore" isn't a real institution. Fabricating this is false and off-strategy. Honest alternatives in §13.
- **Placement "guarantees."** Your own brief says *no job guarantee.* The placements page will say "fast-track to startup interviews for Distinction tier," not guaranteed jobs.
- **Handing students raw Anthropic/OpenAI keys.** That leaks money and can't be metered or logged. Students get *BuildAI* keys via the gateway. §7.

---

## 1. Your 10 questions — answered

**1) Current website files.** You already have HTML. Canonical base = the **Swiss "RedBlock 3D"** direction (`Swiss Sites/BuildAI_Swiss_v5_RedBlock_3D_Final.html`, newest, QA'd, screenshots in `Swiss Sites/QA Screenshots/`). Secondary references: `BuildAI_Website_v2.html`, `BuildAI_Design_Directions_FullSite.html`, `BuildAI_3D_Website_Inspiration.md`. We port the Swiss look into Next.js + Tailwind (not a 1:1 HTML copy — componentized).

**2) What the site is for.**
- **Name:** BuildAI (company; domain `buildai.global`).
- **Product:** 13-week, remote-first, applied AI product-engineering **apprenticeship**, sold B2B2C through tier-2 Indian engineering colleges. "We don't teach AI. We make engineers who ship."
- **Target users:** colleges (buyer = TPO, then Dean/HOD/Principal) · CS/IT students yrs 2–4 (end users) · working AI-startup engineers (mentors).
- **Main goal:** (a) get colleges to **Run a Pilot**; (b) collect **student** + **mentor** interest; (c) once enrolled, run the apprenticeship *on the platform* (keys, dashboards, mentoring, observability).

**3) Pages needed** → full multi-page site (your choice). Public + app routes listed in §3. Today only single-page HTML mockups exist; everything in §3 is to be built.

**4) Backend features (v1, all requested):** student auth → student dashboard issuing model **API keys** · mentor dashboard (assigned students + progress + their activity) · admin dashboard (everything: mentor↔student map, per-key usage/cost, **every student query + response**) · clients/colleges page · student waitlist · "how colleges get started" · placements · pilot inquiry + contact. Forms/fields in §4; this is phased in §8.

**5) Backend/DB preference:** Supabase (auth + Postgres + RLS) + Vercel + LiteLLM gateway + Langfuse + Resend. Full rationale §2.

**6) Design:** Swiss layout, **black + yellow on the red field**, *maximum 3D-look* (built lightweight — "looks 3D, built 2D"). Palette + 3D techniques in §3. We improve/rebuild faithfully in React; you can re-skin later.

**7) Existing codebase:** assume none yet (no repo / Next.js app / Supabase project / Vercel / domain connected). Phase 0 (§8) creates them. Skip any step you've already done.

**8) Login/dashboards:** three roles — student, mentor, admin. What each sees: §6.

**9) Admin:** full admin dashboard — manage colleges/cohorts/pods, assign mentors↔students, view per-key usage + cost, read all query/response logs, export CSVs. §6.

**10) Deployment goal / "done":** per-phase definition of done in §12. v1 "done" = marketing site live on Vercel, all three forms saving to Supabase + emailing you, mobile-clean, no console errors.

---

## 2. Recommended architecture (the "Supabase?" answer in full)

```
                         ┌─────────────────────────────┐
   Browser  ───────────▶ │  Next.js (App Router, TS)    │  ← hosted on Vercel
   (students,            │  - marketing pages (SSG)     │
    mentors,             │  - app/dashboards (RSC)      │
    admin)               │  - API route handlers        │
                         └───────┬─────────────┬────────┘
                                 │             │
                   auth + data   │             │  LLM calls during apprenticeship
                                 ▼             ▼
                    ┌────────────────────┐   ┌────────────────────────────┐
                    │ Supabase           │   │ LiteLLM gateway (self-host) │
                    │ - Auth (roles)     │   │ - 1 BuildAI key per student │
                    │ - Postgres + RLS   │   │ - budgets + rate limits     │
                    │ - Storage          │   │ - spend per key/user        │
                    └────────────────────┘   │ - forwards to Anthropic/    │
                                 ▲            │   OpenAI/Together/Groq       │
                    email (Resend)│           └────────────┬───────────────┘
                    ┌─────────────┴──────┐                 │ traces (prompt+response)
                    │ Resend             │                 ▼
                    │ - form notifs      │     ┌────────────────────────────┐
                    │ - magic links      │     │ Langfuse (self-host/cloud) │
                    └────────────────────┘     │ - every query + response   │
                                               │ - cost/latency per student │
                                               └────────────────────────────┘
```

**Why Supabase, not a self-hosted backend.** For your app data (users, roles, colleges, cohorts, pods, assignments, progress, waitlist, inquiries) Supabase gives you Postgres, Auth with roles, Row-Level Security, storage, and auto REST/Realtime — managed, free to start, scales fine to thousands of users. Building/hosting your own Node/Postgres backend would add weeks of undifferentiated work (auth, migrations, RLS, ops) for no benefit. **Verdict: Supabase.**

**The one gap Supabase doesn't cover** is the LLM layer — "give each student a key, cap their spend, and log every query + response." That is an **AI gateway** job, not a database job. The standard, current tool is **LiteLLM** (self-hosted proxy): it mints per-student *virtual keys*, attaches per-key budgets + rate limits, tracks spend per key/user, and logs every request — and it forwards to Anthropic/OpenAI/Together/Groq behind one OpenAI-compatible endpoint. Pair it with **Langfuse** for the full prompt+response trace UI your mentors/admin want. (This is exactly the Helicone/Langfuse observability your own M3 module teaches — the platform dogfoods the curriculum.)

So the answer to "Supabase or my own backend?" is: **Supabase for everything app-side, plus one small self-hosted gateway (LiteLLM) for the AI layer.** You are not hand-rolling a backend.

**Hosted vs self-host for the gateway:** LiteLLM self-hosted on Railway/Render (~$5–10/mo, one container + small Postgres) gives you full control and keys. If you'd rather not run anything, **Portkey** or **Helicone** are hosted gateways with virtual keys + logging — swap-in equivalents. Default recommendation: **self-host LiteLLM + Langfuse Cloud** (free tier) to start.

---

## 3. Site map & design system

### Public (marketing) routes
| Route | Purpose | Content source |
|---|---|---|
| `/` | Hero + the pitch + primary CTA "Run a Pilot" | Swiss RedBlock 3D, Master Strategy |
| `/programme` (or `/how-it-works`) | Pod model, weekly rhythm, demo days, reviews | Strategy, Implementation Plan |
| `/curriculum` | 6 modules / 13 weeks, deliverables, rubric | `BuildAI_Curriculum_v2.docx` |
| `/certification` | 3 tiers (Participated/Apprentice/Distinction), 7 rubric dims | Curriculum |
| `/for-colleges` | Why colleges, integration models, **how to get started**, commercials | Positioning One-Pager, Strategy |
| `/for-students` | Student pitch + **waitlist form** | Student Brochure |
| `/for-mentors` | Mentor pitch + **application form** | Mentor One-Pager |
| `/placements` | Startup-placement opportunities (Distinction fast-track) — **no guarantees** | Strategy (worded carefully, §13) |
| `/partners` (clients) | Institutions/partners wall — **honest framing only**, §13 | TBD with you |
| `/about` | Founder (Sharad), mission, "earned, not granted" | Strategy |
| `/contact` | Contact + pilot inquiry form | — |
| `/privacy`, `/terms` | Required before collecting data / logging queries | §13 |

### App (auth-gated) routes
| Route | Role | Purpose |
|---|---|---|
| `/login`, `/auth/callback` | all | Supabase auth (magic link or email+password) |
| `/app` | student | Student dashboard: **API key**, usage/budget, progress, deliverables |
| `/app/mentor` | mentor | Assigned students, each student's progress + activity + query/response history |
| `/app/admin` | admin | Everything: colleges/cohorts/pods, mentor↔student assignment, per-key usage + cost, all query/response logs, CSV exports, waitlist/inquiries/applications |

### Design system (Swiss · black/yellow on red · max 3D-look)
- **Palette:** red field `#E4321B` · ink/cards `#111111` · accent yellow `#FFD400` · text `#FFFFFF` · hairline `rgba(0,0,0,.35)`. (Navy `#0A2540` + mint `#00D4AA` kept as optional secondary; see §13 brand note.)
- **Type:** huge condensed grotesque display ("WE DON'T TEACH AI…"). Free pairing: display = **Anton** or **Archivo Black**; UI/body = **Inter** (tight tracking). Editorial accents in **Playfair Display** if you want to keep a brand link. Lock one display face.
- **3D-look toolkit (lightweight — "looks 3D, built 2D"):** hard offset drop-shadow cards (the RedBlock look) · CSS `perspective`/`rotateX/Y` hover-tilt on module + tier + project cards · layered parallax (CSS scroll-driven animations, 0 KB) · kinetic display type on scroll · one pre-rendered Spline/WebP hero object with a mint/yellow glow · optional scroll-scrubbed M0→Capstone curriculum sequence (lazy WebP frames). **Rules:** animate only `transform`/`opacity`, honor `prefers-reduced-motion`, lazy-load below the fold, target LCP < 2.5s on mid-range Android/3G (tier-2 students). No live Three.js/WebGL, no embedded Spline viewer, no >1 MB video.

---

## 4. Forms & fields

**Run-a-Pilot / College inquiry** (primary): college name · contact name · role (TPO / Dean / HOD / Principal / Other) · work email · phone · city/state · approx. eligible students · earliest start (term) · message · consent checkbox · honeypot + Turnstile.

**Student waitlist:** full name · college · year (2/3/4) · branch (CS/IT/…) · personal email · phone (optional) · GitHub/portfolio (optional) · "why you want in" (short) · consent.

**Mentor application:** full name · current company · role/title · years exp · LinkedIn · GitHub · areas (LLM apps / RAG / agents / infra / product) · hours/week (4–6) · email · short note · consent.

All submissions → Supabase table + **Resend** email to you. Spam: honeypot + Cloudflare Turnstile + basic rate limit.

---

## 5. Data model (Supabase / Postgres)

Core tables (snake_case), all with `id uuid pk`, `created_at`:

- `profiles` — `user_id (fk auth.users)`, `role` enum(`student`,`mentor`,`admin`), `full_name`, `college_id?`, `cohort_id?`, `status`.
- `colleges` — `name`, `city`, `tier`, `tpo_contact`, `status` enum(`lead`,`pilot`,`active`,`churned`).
- `cohorts` — `college_id`, `name`, `start_date`, `weeks`(13), `status`.
- `pods` — `cohort_id`, `name`, `lead_mentor_id (fk profiles)`.
- `enrollments` — `student_id`, `cohort_id`, `pod_id`, `tier_awarded?` enum(`participated`,`apprentice`,`distinction`).
- `mentor_assignments` — `mentor_id`, `student_id`, `pod_id` (mentor↔student map).
- `progress` — `student_id`, `week`, `module`(M0–M5), `deliverable`, `status`, `rubric_scores jsonb`(7 dims), `mentor_notes`.
- `student_api_keys` — `student_id`, `litellm_key_id`, `key_alias`, `budget_inr`, `spend_inr`, `status`(active/revoked). (Secret lives in LiteLLM, not here.)
- `llm_events` — mirrored usage rows for fast dashboards: `student_id`, `model`, `prompt_tokens`, `completion_tokens`, `cost_inr`, `latency_ms`, `langfuse_trace_id`, `ts`. (Full prompt/response text lives in Langfuse; link by `langfuse_trace_id`.)
- Lead capture: `pilot_inquiries`, `student_waitlist`, `mentor_applications` (fields per §4), each with `handled` bool + `notes`.

**RLS (critical):** students see only their own rows; mentors see only assigned students (`mentor_assignments`); admin sees all. Write policies mirror this. Query/response content is sensitive — gate it behind mentor/admin RLS + audit who views it (§13 privacy).

---

## 6. Roles & dashboards

**Student `/app`:** their BuildAI API key (reveal/rotate) + base URL + copy-paste snippet · budget used vs cap (progress bar) · recent calls (model, tokens, cost) · their progress (week/module/deliverables/tier) · links to reading group + demo day.

**Mentor `/app/mentor`:** list of assigned students · per student: progress, latest deliverables, usage, and **their query/response history** (read-only, from Langfuse via trace links) · leave rubric scores + notes on `progress`.

**Admin `/app/admin`:** colleges/cohorts/pods CRUD · assign mentors↔students · cohort-wide progress · **usage + cost per key/student/cohort** · **all query/response logs** (search/filter) · CSV export of usage, waitlist, inquiries, applications · toggle `handled` on leads. Build admin simple first (tables + filters), pretty later.

---

## 7. The API-key + usage + logging subsystem (the hard part)

**Principle:** never give students raw provider keys. Give each student a **BuildAI virtual key** from LiteLLM.

Flow:
1. Admin (or auto-on-enrollment) calls LiteLLM `/key/generate` with `user_id = student uuid`, a monthly **budget** (e.g., ₹X), rate limits, and allowed models (Claude/OpenAI/Together/Groq). Store `litellm_key_id` + alias in `student_api_keys`.
2. Student sees the key + base URL in `/app` and points their apprenticeship apps at it (OpenAI-compatible). Their code never holds your provider keys.
3. LiteLLM forwards to providers using **your** master keys, enforces the budget/limits, and tracks **spend per key/user**.
4. LiteLLM is configured to send traces to **Langfuse** → every **prompt + response**, model, tokens, cost, latency, tagged by student.
5. Your dashboards read usage two ways: fast aggregates from LiteLLM `/spend` + mirrored `llm_events`; full prompt/response drill-down via Langfuse trace links (mentor/admin only).

**Why this satisfies the ask:** per-student keys ✓ · usage per key ✓ · every query + response visible to mentor/admin ✓ · budgets stop cost blow-ups ✓ · revoke a key instantly ✓.

**Guardrails:** set a hard monthly budget per student *and* a global cap; alert at 80%; default-deny unknown models; log retention policy (§13).

---

## 8. Phased delivery (so you deploy ASAP)

**Phase 0 — Setup (½ day).** Create GitHub repo, Next.js app, Supabase project, Vercel project, Resend account, register `buildai.global`. Wire env vars. Deploy a "hello" to Vercel.

**Phase 1 — Marketing site live (2–4 days). ← your "deploy ASAP" milestone.**
All public pages (§3) in Swiss design + 3D-look · 3 forms (§4) saving to Supabase + Resend email · responsive + a11y + SEO/OG · privacy/terms stubs. **Deploy to `buildai.vercel.app`.**

**Phase 2 — Auth + student dashboard + gateway (4–6 days).**
Supabase Auth + roles + RLS · `/login` · `/app` student dashboard · stand up LiteLLM + Langfuse · key issuance + budget display + recent usage.

**Phase 3 — Mentor + admin dashboards + observability (5–8 days).**
Assignments · mentor views (progress + query/response history) · admin (usage/cost, all logs, CSV exports, lead management) · progress/rubric entry.

**Phase 4 — Polish & launch (2–3 days).**
Real content from your docs, partners/placements pages finalized (§13), perf pass (LCP), error monitoring (Sentry), connect `buildai.global`, analytics (Plausible/PostHog).

> Ship Phase 1 and start college outreach immediately; Phases 2–4 run while pilots are in conversation. Don't block the website on the platform.

---

## 9. Claude Code execution plan (copy-paste)

**Bootstrap (run in your dev folder):**
```bash
npx create-next-app@latest buildai --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd buildai && git init && gh repo create buildai --private --source=. --remote=origin
npm i @supabase/supabase-js @supabase/ssr resend zod react-hook-form
npx shadcn@latest init    # UI primitives for dashboards/forms
```

**Suggested structure:**
```
src/
  app/                      # routes (marketing + app/ + api/)
    (marketing)/...         # /, programme, curriculum, for-colleges, etc.
    app/                    # student, app/mentor, app/admin
    api/                    # form handlers, litellm webhooks
  components/               # Hero3DCard, TiltCard, ModuleTimeline, forms, nav
  lib/                      # supabase client/server, litellm, langfuse, email
  styles/                   # tokens (red/black/yellow), type scale
supabase/                   # migrations (tables + RLS from §5)
```

**Drop a `CLAUDE.md` in the repo root** so Claude Code has context every session — include: brand voice (from your project brief), the Swiss palette + 3D rules (§3), the data model (§5), the key/logging architecture (§7), and the "do-not-fabricate / no-guarantee / no-raw-keys" rules (§0, §13).

**Sequenced prompts to paste into Claude Code (one milestone at a time):**

1. *"Set up the design system: Tailwind tokens for red `#E4321B`, black `#111111`, yellow `#FFD400`, white; Anton (display) + Inter (body); a `<TiltCard>` (CSS perspective hover-tilt) and hard-offset shadow card matching the Swiss RedBlock look. Build the nav (BUILDAI · Goal/Programme/Curriculum/Certification/Colleges · 'Run a Pilot' button) and footer. Respect `prefers-reduced-motion`."*
2. *"Build the `/` home page from the Swiss RedBlock 3D hero: giant 'WE DON'T TEACH AI. WE MAKE ENGINEERS WHO SHIP.' (SHIP in yellow), the pod/terminal/demo-day 3D card cluster, and the 'Run a Pilot' + 'The Goal ↓' CTAs."*
3. *"Build `/curriculum` and `/certification` from BuildAI_Curriculum_v2.docx — 6 modules / 13 weeks as a 3D-tilt module timeline, the 3 cert tiers, 7 rubric dimensions."*
4. *"Build `/for-colleges` (incl. 'how to get started' steps + integration models), `/for-students`, `/for-mentors`, `/about`, `/contact`."*
5. *"Add Supabase tables + RLS from the data model, and the 3 forms (pilot inquiry, student waitlist, mentor application) with zod validation, Turnstile, save to Supabase, and Resend email notifications."*
6. *"Deploy to Vercel. Verify all forms write rows + send email, mobile is clean, no console errors."* ← **Phase 1 done**
7. *"Add Supabase Auth (magic link) + role-based middleware + `/login`. Build `/app` student dashboard scaffold."*
8. *"Stand up LiteLLM + Langfuse; implement key issuance (`/key/generate` with user_id + budget), show key + usage + budget in `/app`."*
9. *"Build `/app/mentor` (assigned students, progress, query/response history via Langfuse) and `/app/admin` (usage/cost, all logs, CSV exports, lead + assignment management)."*

---

## 10. Accounts & environment variables

**Accounts to create (Phase 0):** GitHub · Vercel · Supabase · Resend · Cloudflare Turnstile · domain registrar for `buildai.global` · (Phase 2) Railway/Render for LiteLLM + Langfuse Cloud · provider keys (Anthropic/OpenAI/Together/Groq).

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only
# Email
RESEND_API_KEY=
LEAD_NOTIFICATION_TO=               # inbox you actually monitor today
# Anti-spam
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
# LLM gateway (Phase 2)
LITELLM_BASE_URL=
LITELLM_MASTER_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_HOST=
```

---

## 11. Deployment (Vercel now, buildai.global later)

1. Push to GitHub → import into Vercel → auto-deploy on push. Live at `buildai.vercel.app`.
2. Add Supabase + Resend + Turnstile env vars in Vercel (Production + Preview).
3. Later: register `buildai.global`, add it as a Vercel domain, set DNS, set up email (Zoho Mail free or Google Workspace) for `contact@buildai.global`.
4. Self-host LiteLLM + Langfuse on Railway/Render when starting Phase 2.

---

## 12. Definition of done

**Phase 1 (v1):** all public pages live on Vercel · Swiss design + working 3D-look, responsive, `prefers-reduced-motion` ok · 3 forms validate, save to Supabase, email you · Lighthouse mobile perf ≥ 90, LCP < 2.5s · SEO/OG tags · privacy + terms present · no console errors.
**Phase 2:** student can log in, see + rotate key, see budget/usage; calls flow through LiteLLM and appear in Langfuse.
**Phase 3:** mentor sees only assigned students + their query/response history; admin sees all usage/cost + logs + CSV exports; RLS verified (a student cannot read another student's data).

---

## 13. Open issues to resolve (flagged honestly — please decide)

1. **Partners/clients wall (IITs).** You asked to list IIT Bombay/"IIT Bangalore"/IIT Chennai/IIT Gandhinagar etc. as places this was already done. Problem: your brief says **pre-pilot, no college signed**; your ICP is **tier-2** colleges (IITs are **tier-1**); and **"IIT Bangalore" doesn't exist** (it's IISc / IIM Bangalore). Claiming them as customers is false and contradicts the positioning. Honest options: (a) **"Where our mentors come from"** logo wall (Anthropic/OpenAI/Sarvam/Razorpay/CRED/Zomato — only ones you can substantiate); (b) **"Built for institutions like…"** framed as target profile, not clients; (c) a **placeholder partners wall** wired up, populated the moment a pilot signs; (d) **"In conversations with"** only if literally true. I'll build (a)+(c) by default unless you tell me otherwise. I won't ship fabricated client claims.
2. **Placements page wording.** Brief = **no job guarantee.** Copy will say "Distinction tier is fast-tracked to startup interviews / placement opportunities," never guaranteed jobs.
3. **Brand color shift.** You've chosen Swiss **red/black/yellow**; the project brief's brand kit is **navy/mint**. That's fine, but your decks/brochures should move with it for consistency (some are already "Swiss"). Flagging so collateral stays aligned. I'll update the brief's brand note if you confirm Swiss is now canonical.
4. **Domain + email.** Standardize on **buildai.global** and **contact@buildai.global**; drop the old `buildai.in` (unowned) and `meetskybloom.com` from BuildAI's customer-facing copy. Action: register `buildai.global`, set up mailbox/forwarding (Zoho free tier works), and until then route all form notifications via Resend to an inbox you check now (`LEAD_NOTIFICATION_TO`).
5. **Privacy / DPDP / consent.** You're logging **every student prompt + response** — sensitive personal data under India's DPDP Act. Need: privacy policy, terms, explicit consent at signup, a retention window, and access controls/audit on who reads logs. Build these *before* turning on logging in Phase 2.
6. **Cost guardrails.** Per-student monthly budget **and** a global cap in LiteLLM, with 80% alerts — or model API spend can run away. Pick the per-student ₹ budget.
7. **Pricing on the public site.** Recommend **keeping price off** the marketing site (B2B, negotiated per college) and saying "contact for pilot pricing." If you want a number shown, lock one first (your brief still lists a ₹20–25K band).

---

## 14. Rough effort & run cost

- **Effort (with Claude Code):** Phase 1 ≈ 2–4 days · Phase 2 ≈ 4–6 days · Phase 3 ≈ 5–8 days · Phase 4 ≈ 2–3 days.
- **Monthly run cost (early):** Vercel Hobby ₹0 · Supabase free→Pro (~$25 when you outgrow free) · Resend free→ ~$20 · LiteLLM host ~$5–10 · Langfuse Cloud free tier · domain ~₹1–2k/yr · **+ actual model API usage** (the real variable cost — controlled by the budgets in §7).

---

*Built from: CLAUDE.md, BuildAI_Master_Strategy, BuildAI_Curriculum_v2, BuildAI_Implementation_Plan, the Swiss RedBlock 3D design + QA screenshots, and BuildAI_3D_Website_Inspiration. Tooling choices (LiteLLM virtual keys/budgets/spend; Langfuse traces) verified against current 2026 docs.*
