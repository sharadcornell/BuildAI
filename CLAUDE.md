# BuildAI — Repo guide for Claude Code

Next.js website + platform for **BuildAI**: a 13-week, AI-native product-engineering
**apprenticeship** sold B2B2C through India's tier-2 engineering colleges.
**Tagline: "We don't teach AI. We make engineers who ship."**

> Full spec: **`docs/BuildAI_Website_Build_Brief.md`**. Business/brand context and source
> material: **`reference/`** (strategy, curriculum, decks, current website HTML).

## Stack
- Next.js 15 (App Router, TS) + Tailwind, hosted on **Vercel**
- **Supabase** — auth (roles: student/mentor/admin) + Postgres + RLS (`supabase/migrations/`)
- **LiteLLM** gateway — issues per-student API keys, budgets, spend (`src/lib/litellm.ts`)
- **Langfuse** — full prompt/response traces (`src/lib/langfuse.ts`)
- **Resend** — lead emails (`src/lib/email.ts`)

## Design system (Swiss · do not drift)
- Colors: red `#E4321B` (field) · black `#111111` (ink/cards) · yellow `#FFD400` (accent) · white text. Tokens in `tailwind.config.ts`.
- Type: display = **Anton** (huge condensed caps); body = **Inter**. Helpers in `globals.css` (`.display`, `.eyebrow`, `.card-offset`, `.tilt`, `.stroke-text`).
- 3D look = "looks 3D, built 2D": hard offset shadows (`shadow-offset`), CSS perspective tilt (`.tilt`), parallax. Animate only transform/opacity; respect `prefers-reduced-motion`; target LCP < 2.5s on mid-range Android.

## Brand voice
Confident, declarative, slightly contrarian, founder-direct. Short sentences, em-dashes,
"We are not X. We are Y." Never frame BuildAI as a "course / bootcamp / certification / ChatGPT training."

## Structure
- `src/app/(marketing)/*` — public pages · `src/app/app/*` — student/mentor/admin dashboards · `src/app/api/*` — form handlers
- `src/components/{site,ui,home,forms}` · `src/content/site.ts` — nav + curriculum/tier/rubric data
- `src/lib/*` — supabase, email, validation, litellm, langfuse

## Phases (see brief §8)
1. **Marketing site** (built here) → deploy to Vercel. 2. Auth + student dashboard + gateway.
3. Mentor + admin dashboards + observability. 4. Polish + connect `buildai.global`.

## Hard rules (brief §0/§13)
- **Do not** invent partner/client colleges (no "we worked with IIT…"). Pre-pilot, zero signed; ICP is tier-2, not IITs. `partners` page uses honest framing only.
- **No job guarantees** anywhere — "fast-track to interviews," never "guaranteed jobs."
- **Never** hand students raw provider keys — only BuildAI virtual keys via LiteLLM.
- Privacy/terms + consent required before logging queries (DPDP Act). Set per-student + global budgets.
- Contact email + domain: **buildai.global** / `contact@buildai.global`.

## Run
`cp .env.example .env.local` → fill values → `npm install` → `npm run dev`.
Forms degrade gracefully (log to console) until Supabase/Resend env is set.
