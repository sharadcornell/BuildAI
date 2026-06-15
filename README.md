# BuildAI

Website + platform for BuildAI — a 13-week AI-native product-engineering apprenticeship for
India's engineering colleges. **We don't teach AI. We make engineers who ship.**

## Quick start
```bash
cp .env.example .env.local   # fill in as you go (forms work without it — they log to console)
npm install
npm run dev                  # http://localhost:3000
```
Requires Node 20+.

## What's built (Phase 1)
- Full multi-page marketing site (Swiss design: red/black/yellow, 3D-look cards)
- Home, Programme, Curriculum, Certification, For Colleges/Students/Mentors, Placements, Partners, About, Contact, Privacy, Terms
- Three working forms (pilot inquiry, student waitlist, mentor application) → Supabase + Resend email
- Dashboard + login **previews** (student/mentor/admin) — auth + live data are Phase 2–3
- Supabase schema + RLS in `supabase/migrations/0001_init.sql`

## Next steps
Open this folder in **Claude Code** and follow `docs/BuildAI_Website_Build_Brief.md`
(§9 has copy-paste prompts). Business context lives in `reference/`.

## Setup checklist
1. Supabase project → run `supabase/migrations/0001_init.sql` → set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Resend account → `RESEND_API_KEY`, `LEAD_NOTIFICATION_TO`.
3. Push to GitHub → import to Vercel → add env vars → deploy.
4. (Phase 2) Stand up LiteLLM + Langfuse → set gateway env vars.
5. Register **buildai.global**, connect in Vercel, set up `contact@buildai.global`.

## Deploy
Push to GitHub and import into Vercel. Set the same env vars in Vercel (Production + Preview).

See `CLAUDE.md` for the working guide and house rules.
