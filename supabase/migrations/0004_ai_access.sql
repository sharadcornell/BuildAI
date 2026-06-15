-- BuildAI — Phase 3A: AI access control-plane (per-key dollar-budget model)
-- Additive and NON-DESTRUCTIVE. Safe to run after 0001_init.sql + 0002_auth_roles.sql
-- + 0003_mentor_dashboard.sql on a live project.
-- Run in: Supabase Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- WHAT THIS ADDS: one new table, `student_ai_access`, the metadata record for a
-- BuildAI-issued API KEY. It holds the key's status, a MASKED key hint, a DOLLAR
-- usage budget (default $5), the budget period, the allowed-models list, and the
-- last-synced dollar spend. It NEVER stores a full/raw virtual API key or any
-- provider secret. The real key lives only in the LiteLLM/provider proxy; if live
-- issuance is ever enabled (Phase 3B), the raw key is shown to the admin exactly
-- once and never persisted here. Spend is dollar-based; RPM/TPM/daily limits are
-- intentionally out of scope for now.
--
-- Note: 0001 already created a thinner `student_api_keys` table. We leave it
-- untouched (no Phase-3 code reads or writes it) and add this richer, RLS-scoped
-- table for the control plane. Nothing is dropped or altered.
--
-- Everything below is idempotent (guarded create/replace, `if not exists`,
-- drop-then-create policies) so re-running it is harmless.

-- ---------- 1. table ----------
create table if not exists public.student_ai_access (
  id uuid primary key default gen_random_uuid(),
  -- both linkages: auth user (stable identity) + profile (the app's main user row)
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  -- human label for the key (a student has one key for now).
  label text default 'Default API key',
  status text not null default 'pending'
    check (status in ('pending', 'active', 'suspended', 'revoked', 'exhausted')),
  -- LiteLLM/provider linkage. key_id is the proxy's identifier for the key (NOT
  -- the secret). key_hint is a MASKED display hint only (e.g. "sk-…a1b2").
  litellm_key_id text,
  litellm_virtual_key_hint text,
  -- DOLLAR budget — core requirement, NOT optional. Default $5 per key.
  monthly_budget_usd numeric not null default 5,
  budget_period text not null default 'calendar_month',
  allowed_models text[],
  -- dollar-spend usage, refreshed from the proxy in Phase 3B (spend sync).
  last_synced_spend_usd numeric not null default 0,
  last_synced_at timestamptz,
  issued_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- one access record (one API key) per student keeps admin upserts + reads simple.
  unique (profile_id)
);

create index if not exists student_ai_access_user_id_idx on public.student_ai_access (user_id);
create index if not exists student_ai_access_status_idx on public.student_ai_access (status);

-- ---------- 2. keep updated_at fresh ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists student_ai_access_set_updated_at on public.student_ai_access;
create trigger student_ai_access_set_updated_at
  before update on public.student_ai_access
  for each row execute function public.touch_updated_at();

-- ---------- 3. RLS ----------
alter table public.student_ai_access enable row level security;

-- Students may read ONLY their own metadata (is_self checks profiles.id ↔ auth.uid()).
drop policy if exists "ai_access self read" on public.student_ai_access;
create policy "ai_access self read"
  on public.student_ai_access
  for select
  using (public.is_self(profile_id));

-- Admins may read everything.
drop policy if exists "ai_access admin read" on public.student_ai_access;
create policy "ai_access admin read"
  on public.student_ai_access
  for select
  using (public.is_admin());

-- Admins may create / update / revoke (suspend/revoke are status updates, never
-- a row delete). Writes in the app actually run through the server-only
-- service-role client (which bypasses RLS); this policy is defense-in-depth so a
-- cookie-bound admin session could write too, and so NO non-admin ever can.
drop policy if exists "ai_access admin write" on public.student_ai_access;
create policy "ai_access admin write"
  on public.student_ai_access
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Mentors intentionally get NO policy here → no access to key metadata.

-- ============================================================================
-- After running this you should have:
--   • table public.student_ai_access (RLS enabled)
--   • policies: "ai_access self read", "ai_access admin read", "ai_access admin write"
-- Verify with:
--   select polname from pg_policies
--   where schemaname = 'public' and tablename = 'student_ai_access' order by polname;
-- ============================================================================
