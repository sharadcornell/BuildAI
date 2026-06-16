# BuildAI — Deployment Checklist (GitHub → Vercel preview)

Pre-deploy reference for shipping the BuildAI platform to a **Vercel preview**. Nothing
here has been pushed or deployed yet (no git remote, no Vercel project). This is the
runbook for when you choose to do it.

> **No secret VALUES appear in this file — variable NAMES only.** Real values live in
> `.env.local` (git-ignored) and in the Vercel dashboard. Never commit `.env.local`.

---

## 0. Pre-flight (local, already green)

- [x] `npm install` clean (lockfile committed → reproducible Vercel install)
- [x] `npm run build` → exit 0
- [x] `npm run lint` → exit 0
- [x] `.env.local` git-ignored (`git check-ignore -v .env.local`)
- [x] Node 20+ (`.nvmrc` pins 20; Vercel reads it)

---

## 1. GitHub push steps

The repo is a **local-only** git repo on branch `main` (no remote configured).

1. Create an **empty private** GitHub repo (no README/license, to avoid a merge).
2. Add it as a remote and push:
   ```bash
   git remote add origin git@github.com:<you>/buildai.git
   git push -u origin main
   ```
3. Confirm `.env.local` is **not** in the push (it's git-ignored). Spot-check the GitHub
   file list shows only `.env.example`, never `.env.local`.

> ⚠️ Per current working rules these steps are **deferred** — do them only when you decide to ship.

---

## 2. Vercel import steps

1. Vercel → **Add New… → Project → Import** the GitHub repo.
2. Framework preset auto-detects **Next.js**. Build command `next build`, output handled by Vercel.
3. Add the environment variables (§3) for **Production** *and* **Preview** before the first build.
4. Deploy. The first deploy produces a `*.vercel.app` preview URL.
5. Set `NEXT_PUBLIC_SITE_URL` to that preview URL (or the final domain) so OG/sitemap links are absolute.

---

## 3. Required Vercel environment variables (names only)

Set for **Production + Preview**. Values come from your `.env.local` / service dashboards.

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | anon/publishable key (legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` also accepted) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | privileged writes / admin actions — never client |
| `NEXT_PUBLIC_SITE_URL` | public | preview/prod base URL for absolute links + OG |
| `RESEND_API_KEY` | **server only** | lead-notification email |
| `LEAD_NOTIFICATION_TO` | **server only** | inbox that receives lead emails |

The app **degrades gracefully** if these are unset (forms log to console and return `{ok:true}`),
so a preview will render even before they're all set — but lead capture/auth need them.

---

## 4. Deferred / optional environment variables (names only)

Leave unset for the preview. The app shows "not configured" / "deferred" states for these.

| Variable | Status | Where it belongs |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **deferred** | only honeypot is active today |
| `TURNSTILE_SECRET_KEY` | **deferred** | server-only when implemented |
| `LITELLM_PROXY_BASE_URL` | **deferred (Phase 3B)** | the Next.js app |
| `LITELLM_MASTER_KEY` | **deferred (Phase 3B)** | **server only** |
| `LANGFUSE_PUBLIC_KEY` | **deferred (Phase 3B)** | server |
| `LANGFUSE_SECRET_KEY` | **deferred (Phase 3B)** | **server only** |
| `LANGFUSE_OTEL_HOST` | **deferred (Phase 3B)** | server |
| `OPENROUTER_API_KEY` (or any raw provider key) | **deferred** | the **LiteLLM proxy** environment — **NOT** this app, **never** the browser |

> Students only ever receive BuildAI virtual keys via the gateway — never raw provider keys.

---

## 5. Supabase migrations

Apply in the **Supabase Dashboard → SQL Editor** (idempotent, non-destructive). The Supabase
CLI is **not** required/linked.

### Already run (live-verified)
- [x] `0001_init.sql` — core schema, lead tables, RLS, helpers *(applied; lead capture verified)*
- [x] `0002_auth_roles.sql` — auto-provision profile trigger + role index + admin bootstrap *(applied; auth verified live)*
- [x] `0004_ai_access.sql` — `student_ai_access` per-key dollar-budget control plane + RLS *(applied; verified live)*

### Optional / deferred
- [ ] `0003_mentor_dashboard.sql` — **optional.** Adds one scoped RLS policy so mentors can read
      the **names** of their assigned students. Everything else in the mentor dashboard works
      without it. Apply to unlock names. Verify:
      ```sql
      select polname from pg_policies
      where schemaname='public' and tablename='profiles' order by polname;
      -- expect: profiles admin write | profiles mentor read assigned | profiles self read | profiles self update
      ```
- Live **LiteLLM/OpenRouter** issuance + spend-sync schema/wiring — **deferred to Phase 3B**.

> Run the same migrations against whatever Supabase project the Vercel deploy points to.

---

## 6. Resend (email)

- [x] `RESEND_API_KEY` + `LEAD_NOTIFICATION_TO` set → lead emails dispatch (verified live).
- [ ] **Before production:** verify the **buildai.global** domain in Resend and switch the `from`
      address off the shared `onboarding@resend.dev` sender to `contact@buildai.global` for
      deliverability and to send to arbitrary recipients. Until then keep `LEAD_NOTIFICATION_TO`
      as the Resend account's own verified address.

---

## 7. Explicitly deferred (do NOT enable for this preview)

- **OpenRouter / LiteLLM live key issuance + real LLM calls** — Phase 3B. Phase 3A stores
  metadata only; admin/student AI cards show "not configured / not issued".
- **Google sign-in (OAuth)** — deferred. Email+password auth only.
- **Cloudflare Turnstile + server-side rate limiting** — deferred. Honeypot is the only spam guard.
- **Payments** — deferred.

---

## 8. Legal / launch gating

- [ ] **`/privacy` and `/terms` are DRAFT placeholders.** They are clearly labelled
      "Draft — not a final legal document" and require **professional legal review before public
      launch**, and specifically before collecting personal data at scale or enabling query logging
      (India DPDP Act 2023). Fine for a preview; **not** for a public production launch.
- [x] No fake partner/client/college claims (partners page shows honest "forming now" state).
- [x] No job-guarantee claims (all copy is explicitly "no job guarantee").
- [x] No unrelated domains in the live site (`src/`); contact is `contact@buildai.global`.

---

## 9. Security headers

Conservative headers are set in `next.config.mjs` for all routes: `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security`
(no `preload`). **No Content-Security-Policy** yet — a strict CSP risks breaking
next/font, next/og, and inline styles; **deferred** to a later carefully-tested pass.

---

## 10. Post-deploy smoke test (on the preview URL)

- [ ] Public routes load (`/`, programme, curriculum, certification, for-*, placements,
      partners, about, contact, privacy, terms, login, sitemap.xml, robots.txt, OG/twitter images).
- [ ] Logged-out `/app*` → `/login`; each role lands on its own dashboard; wrong-role redirects; logout.
- [ ] One real submit of each form → Supabase row + Resend email; honeypot drops silently.
- [ ] Student/admin AI access cards render "not configured / not issued".
- [ ] DevTools console clean; security headers present (Network tab → response headers).
