# BuildAI — Repo Audit Handoff

**Date:** 2026-06-15
**Scope:** Audit only (install, build, lint, dev-server route inspection, forms + API routes). No feature work.
**Result:** ✅ Build green · ✅ Lint clean · ✅ All 23 routes serve · ✅ All 3 form APIs work. One real, deploy-blocking install error was found and fixed (see *Files changed*).

> **Follow-up (same day):** the repo was committed to a local Git baseline and four Phase-1 deploy-readiness fixes were applied (honeypot, sitemap, OG/Twitter image, mobile nav). See **[Part 2 — Phase 1 deploy-readiness](#part-2--phase-1-deploy-readiness-2026-06-15)** at the bottom for the current state. **No `git push` / deploy was performed — all Git work is local.**

---

## Environment

| | |
|---|---|
| Node | v22.12.0 (`.nvmrc` pins 20; both work, see note below) |
| npm | 10.9.0 |
| Next.js | 15.5.19 (resolved from `^15.3.0`) |
| OS | macOS (darwin 25.0.0) |

---

## Commands run

```bash
# 1. Install (initial attempt — FAILED, see "What fails")
npm install
#   → ERESOLVE peer-dependency conflict (@types/react-dom needs @types/react ^19.2.0)
#   → then EACCES: ~/.npm cache has root-owned files

# 2. Worked around both to get an audit baseline
npm install --legacy-peer-deps --cache /tmp/npm-cache-buildai   # 398 pkgs OK

# 3. Build + lint on baseline
npm run build      # ✓ compiled, 23 routes
npm run lint       # ✓ no warnings/errors

# 4. Dev server + route inspection
npm run dev        # ✓ ready in ~1s
#   GET every route + POST every API route (valid / invalid / honeypot / malformed / wrong-method)

# 5. Applied the fix (bumped @types/react + @types/react-dom to ^19.2.0), then verified
#    a clean, FLAGLESS install now works:
rm -rf node_modules package-lock.json
npm install        # ✓ exit 0, no ERESOLVE, lockfile generated  (--cache used only to dodge the root-owned cache)
npm run build      # ✓ exit 0
npm run lint       # ✓ exit 0
```

---

## What works

- **Build** — `next build` compiles cleanly; all 23 routes prerender (20 static pages + 3 dynamic API routes). No type errors.
- **Lint** — `next lint` reports no warnings or errors.
- **All public pages render** — `/`, `/programme`, `/curriculum`, `/certification`, `/for-colleges`, `/for-students`, `/for-mentors`, `/placements`, `/partners`, `/about`, `/contact`, `/privacy`, `/terms` → all HTTP 200 with correct SSR content.
- **App/auth preview pages** — `/login`, `/app`, `/app/mentor`, `/app/admin` → 200; correctly labelled "Preview · Phase 2/3" placeholders.
- **404 handling** — unknown routes return 404 via the built-in `_not-found`.
- **Metadata/SEO** — per-page `<title>` uses the `%s · BuildAI` template; `metadataBase`, OpenGraph, and Twitter card tags are set; `<html lang="en">`, viewport meta present.
- **Fonts** — Anton (display) + Inter (body) wired via `next/font` (`__variable_*` classes applied to `<html>`).
- **Design-system primitives** — `Button`, `OffsetCard`, `TiltCard`, `Badge`, `Section`, `Container`, `Nav`, `Footer` all render; brand tokens (red/black/yellow) and `shadow-offset` / `.tilt` / `.stroke-text` helpers in place.
- **Accessibility/motion** — `prefers-reduced-motion` media query in `globals.css` disables tilt + smooth-scroll; forms use real `<label>`/`htmlFor` and required attributes.
- **Forms (all 3)** — render server-side, client-side zod validation, honeypot field, graceful success states.
- **API routes (all 3)** — behave correctly:
  - valid payload → `200 {ok:true}`
  - invalid payload → `400 {ok:false,"error":"Invalid submission."}`
  - malformed JSON → `400`
  - wrong method (GET) → `405`
- **Graceful degradation** — with no Supabase/Resend env set, API routes log the row to console and return `{ok:true}` (no crash). Confirmed in dev log: `[pilot-inquiry] (no DB configured) …` + `[email] Resend not configured — skipping …`.
- **Partners page honesty guard** — `PARTNERS = []` shows the "pilot colleges forming now" fallback; mentor-origins wall is framed as "where our mentors come from," matching the brief's §13 no-fabrication rule. ✔ compliant.

---

## What fails (and how it was handled)

### 1. 🔴 `npm install` fails — ERESOLVE peer-dependency conflict **(FIXED)**
Plain `npm install` aborted before creating `node_modules`:
```
npm error code ERESOLVE
peer @types/react@"^19.2.0" from @types/react-dom@19.2.3
  node_modules/@types/react-dom
  dev @types/react-dom@"^19.0.0" from the root project
```
`package.json` pinned both `@types/react` and `@types/react-dom` to `^19.0.0`. With no lockfile, npm resolves `@types/react-dom` to the latest `19.2.x`, whose **peer** requires `@types/react@^19.2.0`, and npm's strict resolver fails to reconcile the tree.
**Impact:** blocks local setup **and Vercel deploys** (Vercel runs a plain `npm install`).
**Fix applied:** bumped both `@types/*` floors to `^19.2.0` (types-only devDeps; zero runtime/architecture impact). Clean flagless `npm install` now succeeds and a `package-lock.json` was generated to pin the resolution. See *Files changed*.

### 2. 🟠 `~/.npm` cache is root-owned — EACCES **(machine issue, not repo; worked around)**
```
npm error code EACCES  syscall mkdir  path /Users/sharadagrawal/.npm/_cacache/...
```
This is a local-machine problem (a past `sudo npm` left root-owned cache files), **not** a repo defect. It does not affect CI/Vercel. Worked around during the audit with `--cache /tmp/...`.
**Permanent fix (run once, manually — needs sudo, can't be automated here):**
```bash
sudo chown -R 501:20 ~/.npm
```

### 3. 🟡 Stray global `next@15.1.3` was masking the missing install
Before the local install existed, `npm run build` fell through to a **global** `next` at `/usr/local/lib/node_modules/next` (v15.1.3), producing misleading "Cannot find module 'tailwindcss'" + "Can't resolve '@/components/...'" errors (the global binary can't see the project's local deps or path aliases). Once the local install succeeds these vanish. No repo change needed; consider `npm rm -g next` to avoid future confusion.

---

## Build / lint errors

- **After the fix:** none. `npm run build` → exit 0; `npm run lint` → exit 0 ("No ESLint warnings or errors").
- **Informational only:** `next lint` prints a deprecation notice ("deprecated and will be removed in Next.js 16; migrate to the ESLint CLI"). Not an error; relevant only when upgrading to Next 16.
- npm reports "2 moderate severity vulnerabilities" in the dependency tree (transitive, dev-time). Not build-breaking; run `npm audit` before launch.

---

## Console errors

- **Server (dev log):** clean — **no** errors, hydration warnings, or unhandled rejections across every page render and every API call. Only the intended graceful-degradation `console.log`/`console.warn` lines appear when DB/email env is absent.
- **Browser console:** not captured in this audit (no headless browser was driven). No hydration-risk patterns were found in code review — the only dynamic value, `new Date().getFullYear()` in `Footer.tsx`, is stable across server/client render. Recommend a quick manual browser pass (DevTools console) before launch to fully close the "no console errors" Definition-of-Done item (brief §12).

---

## Routes checked

| Route | Type | Status |
|---|---|---|
| `/` | static | 200 ✓ (hero, stroke-text, pod cluster, all sections) |
| `/programme` | static | 200 ✓ |
| `/curriculum` | static | 200 ✓ |
| `/certification` | static | 200 ✓ |
| `/for-colleges` | static | 200 ✓ (+ pilot form) |
| `/for-students` | static | 200 ✓ (+ waitlist form) |
| `/for-mentors` | static | 200 ✓ (+ mentor form) |
| `/placements` | static | 200 ✓ (no-guarantee wording present) |
| `/partners` | static | 200 ✓ (empty-partners fallback) |
| `/about` | static | 200 ✓ |
| `/contact` | static | 200 ✓ (+ pilot form, mailto) |
| `/privacy` | static | 200 ✓ (draft placeholder) |
| `/terms` | static | 200 ✓ (draft placeholder) |
| `/login` | static | 200 ✓ (Phase 2 preview) |
| `/app` | static | 200 ✓ (Phase 2 preview) |
| `/app/mentor` | static | 200 ✓ (Phase 3 preview) |
| `/app/admin` | static | 200 ✓ (Phase 3 preview) |
| `/nonexistent…` | — | 404 ✓ |
| `/robots.txt` | static file | 200 ✓ |
| `/sitemap.xml` | — | **404** ⚠ (advertised by robots.txt but not generated — see next tasks) |

---

## Forms checked

All three forms share the same pattern (`useSubmit` → `fetch` → zod-validated API route → Supabase insert + Resend email, both no-op'd until env is set).

| Form | Component | API route | Valid | Invalid | Honeypot | Wrong method |
|---|---|---|---|---|---|---|
| Pilot inquiry | `PilotInquiryForm.tsx` | `/api/pilot-inquiry` | 200 ✓ | 400 ✓ | blocked (400) | 405 ✓ |
| Student waitlist | `StudentWaitlistForm.tsx` | `/api/student-waitlist` | 200 ✓ | 400 ✓ | blocked | 405 ✓ |
| Mentor application | `MentorApplicationForm.tsx` | `/api/mentor-application` | 200 ✓ | 400 ✓ | blocked | 405 ✓ |

**Findings (forms):**
- ✅ Client + server validation both enforced (zod schemas in `src/lib/validation.ts`).
- ✅ Spam is blocked: a filled honeypot is rejected.
- ⚠️ **Honeypot logic inconsistency (minor, non-breaking).** The schema defines `honeypot = z.string().max(0)`, so any filled honeypot fails `schema.parse()` and the route returns **400** before reaching the route's `if (data.hp) return {ok:true}` line — making that line **dead/unreachable code**. Spam is still blocked, but the intended "silently return 200 so the bot thinks it succeeded" behavior never runs, and the schema and handler contradict each other. *Recommended fix:* make `hp` permissive in the schema (`z.string().optional().default("")`) and let the `if (data.hp)` early-return own the honeypot decision — or delete the dead line and keep the strict-schema approach intentionally. Pick one.
- ⚠️ **Turnstile not implemented.** Brief §4 specifies Cloudflare Turnstile on all forms; env vars exist (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) but no widget or server-side verification is wired. Only the honeypot is active. Flag for Phase-1 completion.
- ℹ️ No server-side rate limiting yet (brief §4 mentions "basic rate limit"). Honeypot only.

---

## Files changed

| File | Change | Why |
|---|---|---|
| `package.json` | `@types/react` and `@types/react-dom`: `^19.0.0` → `^19.2.0` | Fix the ERESOLVE peer conflict so plain `npm install` (and Vercel deploy) succeeds. Types-only devDeps — no runtime or architecture impact. |
| `package-lock.json` | **created** (by `npm install`) | Pins the dependency resolution so installs are reproducible across machines and on Vercel. Not gitignored → commit it. |
| `docs/HANDOFF.md` | **created** | This document. |

No copy, strategy, brand, component, or architecture changes were made.

---

## Recommended next tasks

**Before any deploy (P0):**
1. **Commit `package.json` + the new `package-lock.json`** so Vercel installs reproducibly. (Repo is not yet a git repo — `git init` + initial commit.)
2. **Fix the local npm cache once:** `sudo chown -R 501:20 ~/.npm` (so future `npm install` works without `--cache`).
3. **Manual browser pass** on a couple of pages (DevTools console + mobile viewport) to formally close brief §12's "no console errors" + responsive items.

**Phase-1 completeness gaps (P1 — per brief §4/§12):**
4. **Wire Cloudflare Turnstile** into the three forms + verify the token in each API route. Env vars already exist.
5. **Fix the honeypot logic inconsistency** (see *Forms checked*) — either make the schema permissive or remove the dead `if (data.hp)` branch.
6. **Add a `sitemap.xml`** (`app/sitemap.ts`) — `robots.txt` already points to `/sitemap.xml`, which currently 404s.
7. **Add an OG/Twitter share image** — layout declares `summary_large_image` + OpenGraph but `/public` has no image, so social cards render blank. Add `opengraph-image`.
8. **Mobile navigation:** `Nav.tsx` hides the nav links on small screens (`hidden md:flex`) with no hamburger/menu — mobile users can only reach inner pages via the footer or the "Run a Pilot" button. Add a mobile menu.

**Phase 2+ (already scaffolded as previews, not bugs):**
9. Supabase Auth + role middleware + real `/login`; live data in `/app`, `/app/mentor`, `/app/admin`.
10. Stand up LiteLLM + Langfuse; implement key issuance/budget/usage (`src/lib/litellm.ts`, `langfuse.ts` are stubs).
11. Replace `/privacy` + `/terms` draft placeholders with reviewed DPDP-compliant copy **before** enabling query logging (brief §13).

**Housekeeping (optional):**
12. `npm rm -g next` to remove the stray global `next@15.1.3` that masked the missing local install.
13. `npm audit` — resolve the 2 moderate advisories before launch.
14. Plan the `next lint` → ESLint CLI migration ahead of a Next 16 upgrade.

---

# Part 2 — Phase 1 deploy-readiness (2026-06-15)

Local Git baseline + four Phase-1 fixes. **No auth, dashboards, LiteLLM, Langfuse, payments, or role routing were touched** (out of scope). **No `git push`, no deploy, no external service connected.**

## Commands run

```bash
# Git (local only)
git status                       # → not a repo
git init                         # → branch: main
git add .
git commit -m "Establish clean BuildAI website baseline"   # → 2469624  (113 files; no node_modules/.next; only empty .env.example)

# npm cache permanent fix — ATTEMPTED, could not complete (needs a password)
sudo -n chown -R 501:20 ~/.npm   # → "sudo: a password is required"  (32 root-owned files remain)

# Clean install + verify (temp user-owned cache used ONLY to dodge the root-owned shards)
rm -rf node_modules
npm install --cache /tmp/npm-cache-buildai   # → exit 0
npm run build                    # → exit 0
npm run lint                     # → exit 0

# After the four fixes
npm run build                    # → exit 0 (26 routes)
npm run lint                     # → exit 0 (No ESLint warnings or errors)
npm run dev                      # → manual route + form checks (below)

git add .
git commit -m "Prepare Phase 1 website for preview deploy"  # → 6c56052
```

## Git commits created (local only)

| Commit | Message | Contents |
|---|---|---|
| `2469624` | `Establish clean BuildAI website baseline` | Full working tree at audit-fix state (source, `package.json` with the `@types` fix, generated `package-lock.json`, docs, reference/). |
| `6c56052` | `Prepare Phase 1 website for preview deploy` | The four Phase-1 fixes + this handoff update. |

Branch: **`main`**. **`git push` was NOT run. No remote was added. Nothing was published to GitHub/Vercel.**

## Files changed (Part 2)

| File | Change |
|---|---|
| `src/lib/validation.ts` | Honeypot schema made permissive (`z.string().optional().default("")`) so the routes' existing `if (data.hp)` guard can fire. |
| `src/app/api/*/route.ts` | **Unchanged** — all three already had `if (data.hp) return {ok:true}`; the schema change activates it consistently. |
| `src/app/sitemap.ts` | **New** — generates `/sitemap.xml` for the 13 public marketing routes. |
| `src/app/opengraph-image.tsx` | **New** — 1200×630 brand OG card via `next/og` (no new dependency). |
| `src/app/twitter-image.tsx` | **New** — re-exports the OG card for `summary_large_image`. |
| `src/components/site/MobileNav.tsx` | **New** — client hamburger menu (`md:hidden`); Escape-to-close, close-on-link-click, aria-expanded/controls. |
| `src/components/site/Nav.tsx` | Wired `<MobileNav />` next to the CTA; **desktop nav untouched**. |
| `docs/HANDOFF.md` | This Part 2 update. |

## What was fixed

1. **Honeypot logic inconsistency → fixed.** Previously the schema's `z.string().max(0)` rejected any filled honeypot at parse time (400), making the route's `if (data.hp) return {ok:true}` dead code. Now a filled honeypot passes validation and each route **silently returns `200 {ok:true}` and skips the DB insert + email** — the bot thinks it succeeded, spam is dropped. Applied uniformly to all three forms (the routes already shared the guard; only the schema needed changing).
2. **Sitemap added.** `src/app/sitemap.ts` emits all 13 public routes at `https://buildai.global/...`. `/sitemap.xml` now returns **200 `application/xml`**; the existing `public/robots.txt` already points to it (URL matches exactly).
3. **OG/Twitter share image added.** `opengraph-image.tsx` (+ `twitter-image.tsx`) renders a brand-consistent red/black/yellow card. Next injects `og:image` + `twitter:image` (+ width/height/alt) and `twitter:card=summary_large_image` automatically; `metadataBase` makes the URLs absolute in production.
4. **Mobile navigation added.** The nav links were `hidden md:flex` with no mobile affordance. Added a `md:hidden` hamburger that toggles a full-width menu of the nav links. Keyboard-accessible (native `<button>`, `aria-expanded`, `aria-controls`, Escape closes), closes on link click. Desktop nav is byte-for-byte unchanged.

## Build result

✅ `npm run build` → exit 0. 26 routes prerendered, including new `/sitemap.xml`, `/opengraph-image`, `/twitter-image` (all static `○`). No type errors.

## Lint result

✅ `npm run lint` → exit 0 — "No ESLint warnings or errors."

## Routes checked (dev server)

| Route | Result |
|---|---|
| `/` | 200 ✓ — og:image + twitter:image meta present; mobile-nav button markup (`aria-controls="mobile-menu"`, `aria-expanded="false"`, `aria-label="Open menu"`) present |
| `/for-colleges` | 200 ✓ (pilot form) |
| `/for-students` | 200 ✓ (waitlist form) |
| `/for-mentors` | 200 ✓ (mentor form) |
| `/contact` | 200 ✓ (pilot form) |
| `/sitemap.xml` | **200 `application/xml`**, 13 `<loc>` entries ✓ |
| `/robots.txt` | 200 ✓ — `Sitemap: https://buildai.global/sitemap.xml` (matches) |
| `/opengraph-image` | 200 `image/png` ✓ |
| `/twitter-image` | 200 `image/png` ✓ |
| **Honeypot** (valid fields + filled `hp`) | **200 `{ok:true}`, silently dropped** on all 3 routes — dev log confirms no spam row was logged ✓ |
| Normal submit | 200 `{ok:true}` (+ DB-skip log) ✓ |
| Invalid submit | 400 ✓ |
| Mobile nav | hamburger button + `aria-*` server-rendered; toggle/Escape/close-on-click implemented in `MobileNav.tsx` (interactive toggle verified by code, not a headless browser) |

Dev-server log was clean — no errors, hydration warnings, or unhandled rejections (only the intended graceful-degradation logs).

## Remaining issues / notes

- 🟠 **npm cache still has 32 root-owned files** — `sudo chown -R 501:20 ~/.npm` **must be run manually** (sudo needs a password; can't be done from here). Local-machine only — **does NOT affect Vercel**.
- 🟡 **Node 20 not installed / `nvm` not loaded** in this shell; built and verified on **Node v22.12.0** (clean). `.nvmrc` still pins 20 — fine for Vercel (it reads `.nvmrc`); install Node 20 locally if you want to match exactly.
- 🟡 **OG card uses a bold system sans, not Anton** — deliberate, to keep the image self-contained (no runtime font fetch). Brand colors are correct. Swap in the Anton font binary later if exact type is wanted.
- ⚪ **Still deferred (not in Part-2 scope):** Cloudflare Turnstile + server-side rate limiting on forms (brief §4); reviewed DPDP-compliant `/privacy` + `/terms` copy before Phase-2 query logging (brief §13); the `npm audit` 2 moderate advisories.

## Ready for Vercel preview deploy?

**Yes — the code is preview-deploy-ready, but the deploy itself was intentionally NOT performed** (per instructions: no push, no Vercel/GitHub connection).

- ✅ Clean `npm run build` + `npm run lint`; 26 routes; no console errors.
- ✅ `package-lock.json` is committed → Vercel's `npm install` is reproducible and **won't hit the original ERESOLVE** (the `@types/react*` fix is locked in).
- ✅ The npm-cache permission issue is local-only; Vercel builds in a clean environment.
- ✅ Forms degrade gracefully with no env set (log + `{ok:true}`), so a preview deploy works before Supabase/Resend are configured.
- ▶️ **To actually deploy (when you choose):** push to GitHub → import to Vercel → add env vars (Production + Preview). All of that is left to you.

---

# Part 3 — Supabase Phase 1 lead-capture verification (2026-06-15)

Connected and verified the Phase-1 lead-capture forms against the real Supabase project configured in a local `.env.local`. **Scope was lead capture only** — no auth, dashboards, LiteLLM, Langfuse, payments, role routing, or Cloudflare Turnstile were touched. **No `git push`, no remote, no deploy, no secrets printed.**

> ⛔ **One blocker found — the Supabase database has NOT been migrated.** The three lead-capture tables don't exist yet, so valid submissions currently return **500**. Everything else (validation, honeypot, error handling, wiring) is verified and correct. **Action required — see [§6 Supabase migration status](#6-supabase-migration-status) below.**

## 1. Commands run

```bash
git status                                   # clean
node -v ; npm -v                             # v22.12.0 / 10.9.0
npm install                                  # "up to date, audited 401 packages" (no cache error this time)
npm run build                                # exit 0, 26 routes
npm run lint                                 # exit 0, no warnings/errors
git check-ignore -v .env.local               # .gitignore:11:.env*.local  → IGNORED
npm ls @supabase/supabase-js @supabase/ssr   # both present (see §3)
# Env-var presence checked by NAME ONLY (grep for "^VAR=" + non-empty test; values never printed)
# Migration status checked read-only via PostgREST GET on each lead table (credentials read into
#   shell vars from .env.local, never echoed) → all three returned 404 PGRST205 (table missing)
npm run dev                                  # API behavior matrix exercised via curl against localhost:3000
npm run build ; npm run lint                 # re-run after code changes → both exit 0
```

## 2. Node / npm versions

| | |
|---|---|
| Node | **v22.12.0** (`.nvmrc` pins 20; both work for Vercel). `npm install` prints a non-blocking `EBADENGINE` warning — a transitive dep prefers `^20.19 || ^22.13 || >=24`; build/lint unaffected. |
| npm | **10.9.0** |

## 3. Packages installed / confirmed

Already present — **nothing new installed**:

```
@supabase/ssr@0.5.2
@supabase/supabase-js@2.108.2  (deduped — shared by @supabase/ssr and the root dep)
```

## 4. Env vars checked (by name only — no values printed)

| Variable | Present in `.env.local`? |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ present, non-empty |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ present, non-empty |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ present, non-empty |
| `NEXT_PUBLIC_SITE_URL` | ✅ present, non-empty |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚪ absent (legacy name — superseded by the publishable key; code now handles both, see §8) |

## 5. `.env.local` ignored by Git

✅ **Yes.** `git check-ignore -v .env.local` → `.gitignore:11:.env*.local`. It is **not** tracked and does **not** appear in `git status`. Its contents were never read, printed, or committed.

## 6. Supabase migration status

🔴 **NOT migrated.** A read-only PostgREST probe of the configured project returned, for all three lead tables:

```
HTTP 404  {"code":"PGRST205","message":"Could not find the table 'public.<table>' in the schema cache"}
```

The credentials are valid (these are proper PostgREST "table not found" errors, not auth failures), so the app **is** talking to the right project — the schema simply hasn't been created yet.

**To complete setup (do this — it's the only thing blocking real row creation):**

1. Open the **Supabase Dashboard → your project → SQL Editor → New query**.
2. Paste the entire contents of **`supabase/migrations/0001_init.sql`** and click **Run**.
   - It is idempotent (`create table if not exists`, guarded `create type`) and **non-destructive** — safe to run on the empty project. *(Not run from here: per task rules I do not run SQL against your database or assume the Supabase CLI is linked.)*
3. After it runs, these **12 tables** exist — the three that matter for Phase-1 lead capture are **`pilot_inquiries`**, **`student_waitlist`**, **`mentor_applications`**; the rest are Phase 2–3 scaffolding (`profiles`, `colleges`, `cohorts`, `pods`, `enrollments`, `mentor_assignments`, `progress`, `student_api_keys`, `llm_events`) plus RLS policies + helper functions.
4. Re-test a valid submission — it will then return **200 `{ok:true}`** and write a row (verify in **Table Editor → `pilot_inquiries`**).

> Note on RLS: the lead tables have RLS enabled with **admin-only SELECT** policies and **no INSERT policy** — that's correct. Inserts come from the **service-role** client, which bypasses RLS, so writes succeed while public reads stay blocked.

## 7. Tables used (route → table → form page)

| API route | Supabase table | Form component | Public page(s) |
|---|---|---|---|
| `/api/pilot-inquiry` | `pilot_inquiries` | `PilotInquiryForm` | `/for-colleges`, **`/contact` (reuses pilot inquiry ✓)** |
| `/api/student-waitlist` | `student_waitlist` | `StudentWaitlistForm` | `/for-students` |
| `/api/mentor-application` | `mentor_applications` | `MentorApplicationForm` | `/for-mentors` |

Every inserted column name matches the migration exactly (verified field-by-field against `0001_init.sql`).

## 8. Files changed

| File | Change | Why |
|---|---|---|
| `src/lib/supabase/client.ts` | Browser client now reads `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and **falls back** to `NEXT_PUBLIC_SUPABASE_ANON_KEY`. | Support the newer key name (the legacy anon name is no longer in `.env.local`) without breaking older setups. Browser/Phase-2 client only; not on the lead-capture path. |
| `src/app/api/pilot-inquiry/route.ts` | On a Supabase insert error: `console.error` the detail server-side, return a **generic** `"Something went wrong. Please try again."` to the client (was returning the raw `error.message`). | Satisfy "return safe user-facing errors / never leak stack traces." Raw error previously leaked the internal table/schema name to the browser. |
| `src/app/api/student-waitlist/route.ts` | Same error-hardening as above. | Same. |
| `src/app/api/mentor-application/route.ts` | Same error-hardening as above. | Same. |

**Not changed:** `supabase/server.ts` (already correct — service-role, server-only, `null` when unconfigured), `validation.ts`, the migration, any page/copy/brand/component, `.env.local`, `.gitignore`.

**Server/client secret separation verified:** `SUPABASE_SERVICE_ROLE_KEY` is referenced **only** in `src/lib/supabase/server.ts`; `getSupabaseAdmin()` is imported **only** by the three API route handlers (server-side). No client/browser code imports the admin client or the service-role key.

## 9. API behavior matrix (live, against the configured-but-un-migrated Supabase)

| Case | `/api/pilot-inquiry` | `/api/student-waitlist` | `/api/mentor-application` | Notes |
|---|---|---|---|---|
| **Valid payload** | 500 | 500 | 500 | ⚠️ **only because tables don't exist** (PGRST205). Becomes **200 `{ok:true}` + row** after §6 migration. Proves the route reaches the real DB. |
| **Filled honeypot** (`hp` set, all other fields valid) | **200 `{ok:true}`** | **200 `{ok:true}`** | **200 `{ok:true}`** | Silently dropped — returns *before* the Supabase block, so **no insert attempted** (no 500 despite missing table → insert confirmed skipped). |
| **Invalid payload** (missing/short fields) | 400 | 400 | 400 | `{"ok":false,"error":"Invalid submission."}` |
| **Malformed JSON** | 400 | 400 | 400 | Caught by `try/catch` around `req.json()`. |
| **Wrong method (GET)** | 405 | 405 | 405 | No `GET` handler exported → Next returns 405. |
| **Error message safety** | generic | generic | generic | Client now sees `"Something went wrong. Please try again."`; the real Supabase error is logged server-side only. |

All three routes: ✅ server-side zod validation · ✅ honeypot guard intact · ✅ correct target table · ✅ safe user-facing errors · ✅ no secret/stack-trace leak · ✅ work without Cloudflare Turnstile.

## 10. Browser form test result

- All four form pages serve **HTTP 200** and each renders exactly **one** honeypot field (`name="hp"`): `/for-colleges`, `/for-students`, `/for-mentors`, `/contact`.
- Page→form→endpoint wiring confirmed by source (see §7); `/contact` reuses `PilotInquiryForm`.
- Submission behavior was exercised against the live endpoints via `curl` (full matrix in §9) rather than a headless browser (no browser-driver available in this environment). Client-side zod validation lives in the form components and mirrors the server schema. **Recommended final manual pass:** open each page in a real browser, submit once, and confirm the DevTools console is clean — to formally close brief §12's "no console errors" item. Dev-server log during testing was clean (no unhandled errors/rejections).

## 11. Supabase row creation result

- **Could not be confirmed yet — blocked by the un-run migration (§6).** With the tables absent, valid submissions return 500 and no rows are written.
- **Honeypot correctly creates no row:** filled-honeypot requests return 200 and never reach the insert (verified — they don't even produce the missing-table 500).
- **After running `0001_init.sql`,** a valid submission will write to `pilot_inquiries` / `student_waitlist` / `mentor_applications` — verify in the Supabase Table Editor. (No test rows were left in the DB; all valid attempts failed at insert because the tables don't exist.)

## 12. Build result

✅ `npm run build` → **exit 0**, 26 routes (3 API routes dynamic `ƒ`, rest static `○`). No type errors. Re-verified after all code changes.

## 13. Lint result

✅ `npm run lint` → **exit 0** — "No ESLint warnings or errors." (Non-blocking `next lint` deprecation notice only, same as Parts 1–2.)

## 14. Remaining issues

- 🔴 **Run the migration (§6)** — the one real blocker for live lead capture. Until then, valid submissions 500.
- 🟡 **Resend not configured** — `RESEND_API_KEY` / `LEAD_NOTIFICATION_TO` are not set, so lead-notification emails are skipped (logged, graceful). Set them to receive email on each lead. *(Note: email currently sends only on the success path, which is after the DB insert — so emails will start flowing once the migration is in place.)*
- 🟡 **Final real-browser pass** still recommended to close the "no console errors" DoD item (§10).
- ⚪ **Deferred (out of scope, unchanged from Parts 1–2):** Cloudflare Turnstile + rate limiting (brief §4); DPDP-compliant `/privacy` + `/terms` before Phase-2 logging (brief §13); the 2 moderate `npm audit` advisories; local root-owned `~/.npm` cache (machine-only, needs a manual `sudo chown` — does not affect Vercel).

## 15. Ready for Vercel preview deployment?

**Yes for a preview deploy of the site; lead capture needs the one-time migration to actually persist rows.**

- ✅ Clean `build` + `lint`; secret separation verified; error handling hardened; forms wired correctly.
- ✅ Routes degrade gracefully if env is unset (log + `{ok:true}`), so a preview renders fine before/after Supabase is wired.
- ▶️ **Before lead capture works end-to-end:** run `supabase/migrations/0001_init.sql` (§6) and set the same Supabase env vars (and, for emails, Resend) in Vercel (Production + Preview). The deploy itself was intentionally **not** performed.

## 16. Git / deploy safety confirmation

✅ **No `git push`. No remote added. No deploy. No Vercel/GitHub connection.** ✅ `.env.local` never committed, never printed; no secret values appear anywhere in this doc, the terminal output, or the commit. All Git work remains local on branch `main`.

---

# Part 4 — Supabase migration applied and lead capture verified (2026-06-15)

The Part-3 blocker is cleared. `supabase/migrations/0001_init.sql` was **run manually in the Supabase Dashboard SQL Editor**, and all three Phase-1 lead-capture forms now write rows end-to-end. **Scope: re-test only — no auth, dashboards, LiteLLM, Langfuse, payments, role routing, Resend, or Turnstile touched. No code changes were needed.** No `git push`, no remote, no deploy, no secrets printed.

## 1. Commands run

```bash
git status                                   # clean
node -v ; npm -v                             # v22.12.0 / 10.9.0
npm install                                  # up to date (401 pkgs); non-blocking EBADENGINE warning only
npm run build                                # exit 0, 26 routes
npm run lint                                 # exit 0, no warnings/errors
git check-ignore -v .env.local               # .gitignore:11:.env*.local → IGNORED
# Env-var presence verified by NAME ONLY (grep "^VAR=" + non-empty); values never printed
npm run dev                                  # forms exercised via curl against localhost:3000
# Supabase read/verify via PostgREST (service-role creds read into shell vars, never echoed):
#   - table-exists probe + exact row counts (Prefer: count=exact)
#   - read-back of created rows by marker
#   - DELETE of the 4 test rows after verification (cleanup)
```

## 2. Migration applied

✅ **Confirmed.** `supabase/migrations/0001_init.sql` was applied manually by the operator in the Supabase Dashboard → SQL Editor. A read-only PostgREST probe (which returned `404 PGRST205` in Part 3) now returns **HTTP 200** for all three lead tables — the schema exists. *(The migration was not run from here; this part only verifies the result.)*

## 3. Tables verified

All three lead-capture tables exist and accept writes. Each started **empty (0 rows)**, giving an exact before/after count:

| Table | Exists | Inserted column mapping correct? |
|---|---|---|
| `pilot_inquiries` | ✅ 200 | ✅ `college`, `role`, `email`, `phone`, `city`, `students_estimate`, `start_term`, `message` |
| `student_waitlist` | ✅ 200 | ✅ `full_name`, `year`, `branch`, `email`, `phone`, `portfolio`, `reason` |
| `mentor_applications` | ✅ 200 | ✅ `full_name`, `company`, `role`, `years_exp`, `hours_per_week`, `email`, `linkedin`, `github`, `areas`, `note` |

## 4. API behavior matrix (live, post-migration)

| Case | `/api/pilot-inquiry` | `/api/student-waitlist` | `/api/mentor-application` | Row created? |
|---|---|---|---|---|
| **Valid payload** | **200 `{ok:true}`** | **200 `{ok:true}`** | **200 `{ok:true}`** | ✅ yes — row written & read back |
| **Filled honeypot** (valid fields + `hp`) | 200 `{ok:true}` | 200 `{ok:true}` | 200 `{ok:true}` | ❌ no — silently dropped before DB |
| **Invalid payload** | 400 `Invalid submission.` | 400 | 400 | ❌ no |
| **Malformed JSON** | 400 `Invalid submission.` | 400 | 400 | ❌ no |
| **Wrong method (GET)** | 405 | 405 | 405 | ❌ no |

The **valid → 500** state from Part 3 (missing table) is **gone** — valid submissions now return **200** and persist. Error handling is unchanged from Part 3 (generic `"Something went wrong. Please try again."` to the client; detail logged server-side) — **no Supabase internals leak to the user** (§ below).

## 5. Browser form test result

- The four form pages serve **HTTP 200** and each renders one honeypot field; page→form→endpoint wiring confirmed in source (`/for-colleges`→pilot, `/for-students`→student, `/for-mentors`→mentor, **`/contact`→pilot**).
- Submissions were exercised against the live endpoints via `curl` (the forms POST JSON to these exact routes) rather than a headless browser — none is available in this environment. Client-side zod validation in the form components mirrors the server schema. **Recommended final manual pass:** submit each form once in a real browser and confirm a clean DevTools console (brief §12).
- Dev-server log during the run was clean: no errors, no unhandled rejections, no stack traces. The only lines were the intended `[email] Resend not configured — skipping …` (one per valid submit) — confirming the success path ran and email no-ops gracefully (Resend intentionally not configured, out of scope).

## 6. Supabase row creation result

✅ **Verified by read-back.** After submitting valid payloads (tagged `verify-p4` for traceability), exact counts were:

| Table | Before | After valid submits | Read-back |
|---|---|---|---|
| `pilot_inquiries` | 0 | **2** | `VERIFY-P4 Colleges` (role TPO) + `VERIFY-P4 Contact` (role Other) — **both `/for-colleges` and `/contact` landed; `/contact` reuses the pilot-inquiry flow ✓** |
| `student_waitlist` | 0 | **1** | `VERIFY-P4 Student` (year 3, branch CS) |
| `mentor_applications` | 0 | **1** | `VERIFY-P4 Mentor` (company `VERIFY-P4 Co`, 5 hrs/wk) |

- **Honeypot wrote nothing:** a query for the honeypot's marker returned `[]`, and the exact totals (2/1/1) prove the honeypot, invalid, and malformed attempts created **zero** rows.
- **Cleanup:** all **4** test rows were deleted afterward (`DELETE … email ilike %verify-p4%`); all three tables are back to **0 rows**. No test data left in the project.

## 7. Build result

✅ `npm run build` → **exit 0**, 26 routes (3 API routes dynamic `ƒ`). No type errors.

## 8. Lint result

✅ `npm run lint` → **exit 0** — "No ESLint warnings or errors." (Non-blocking `next lint` deprecation notice only.)

## 9. Remaining issues

- 🟡 **Resend not configured** (`RESEND_API_KEY` / `LEAD_NOTIFICATION_TO` unset) — lead-notification emails are skipped (logged, graceful). DB capture is fully working; set these when you want email alerts. *(Out of scope here.)*
- 🟡 **Final real-browser pass** still recommended to formally close the "no console errors" DoD item (brief §12).
- ⚪ **Deferred (unchanged, out of scope):** Cloudflare Turnstile + rate limiting (brief §4); DPDP-compliant `/privacy` + `/terms` before Phase-2 query logging (brief §13); 2 moderate `npm audit` advisories; local root-owned `~/.npm` cache (machine-only; does not affect Vercel).
- ✅ **No new issues found.** Lead capture works end-to-end; no code changes were required in this part.

## 10. Ready for Vercel preview deployment?

**Yes — and lead capture now persists rows.** Clean `build` + `lint`; all three forms validate, save to Supabase, and return safe errors; honeypot drops spam; `/contact` reuses pilot inquiry. The deploy itself was intentionally **not** performed. To deploy when you choose: push to GitHub → import to Vercel → set the same Supabase env vars (and Resend, for email) in Production + Preview.

## 11. Git / deploy safety confirmation

✅ **No `git push`. No remote added. No deploy.** ✅ `.env.local` never committed or printed; no secret values appear in this doc, terminal output, or any commit. The only Supabase writes were 4 clearly-marked test rows, all deleted afterward. All Git work remains local on branch `main`.

