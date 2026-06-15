-- BuildAI — Phase 2A: Auth roles + auto-provisioned profiles
-- Additive and NON-DESTRUCTIVE. Safe to run after 0001_init.sql on a live project.
-- Run in: Supabase Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- What 0001 already created (do NOT re-create): the `profiles` table, the
-- `user_role` enum ('student','mentor','admin'), RLS on profiles, and the
-- is_admin()/is_self()/mentors_student() helpers. This migration only adds:
--   1. a default-student auto-provision trigger on auth.users (so every new
--      Supabase Auth user gets exactly one profile row, role = 'student'),
--   2. a one-time backfill for any existing auth users without a profile,
--   3. a helpful index on profiles.role.
-- Everything here is idempotent (guarded create/replace, `if not exists`,
-- `on conflict do nothing`) so re-running it is harmless.

-- ---------- 1. auto-create a profile when an auth user is created ----------
-- SECURITY DEFINER: the trigger runs as the function owner and bypasses RLS,
-- so we do NOT need a public INSERT policy on profiles (kept admin-only).
-- New users always start as 'student' — the least-privileged role. Elevating a
-- user to mentor/admin is a deliberate manual step (see admin bootstrap below).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, full_name)
  values (
    new.id,
    'student',
    nullif(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Recreate the trigger idempotently.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 2. backfill profiles for users created before the trigger ----------
-- Defaults each to 'student'; existing profiles are untouched (NOT NULL safe,
-- no role is changed for anyone who already has a profile).
insert into public.profiles (user_id, role)
select u.id, 'student'
from auth.users u
left join public.profiles p on p.user_id = u.id
where p.id is null
on conflict (user_id) do nothing;

-- ---------- 3. index for role-based lookups ----------
-- profiles.user_id is already UNIQUE (indexed) from 0001. Add role for
-- admin/mentor filtering on dashboards.
create index if not exists profiles_role_idx on public.profiles (role);

-- ============================================================================
-- ADMIN BOOTSTRAP — run MANUALLY, once, AFTER creating the admin auth user.
-- ============================================================================
-- There is intentionally NO public/self-serve way to become an admin. To make
-- the first admin:
--   1. Create the user in Supabase Dashboard → Authentication → Users →
--      "Add user" (set an email + password). The trigger above gives them a
--      'student' profile automatically.
--   2. Then run ONE of the following in the SQL Editor, substituting the email
--      you just created (do NOT commit a real email to the repo):
--
--      update public.profiles
--      set role = 'admin'
--      where user_id = (select id from auth.users where email = 'ADMIN_EMAIL_HERE');
--
--   3. Repeat with role = 'mentor' for any mentor test users.
-- Verify with:
--      select u.email, p.role from public.profiles p
--      join auth.users u on u.id = p.user_id order by p.role;
-- ============================================================================
