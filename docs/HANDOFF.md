# BuildAI — Repo Audit Handoff

**Date:** 2026-06-15
**Scope:** Audit only (install, build, lint, dev-server route inspection, forms + API routes). No feature work.
**Result:** ✅ Build green · ✅ Lint clean · ✅ All 23 routes serve · ✅ All 3 form APIs work. One real, deploy-blocking install error was found and fixed (see *Files changed*).

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
