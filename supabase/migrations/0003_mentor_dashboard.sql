-- BuildAI — Phase 2C: Mentor dashboard read access
-- Additive and NON-DESTRUCTIVE. Safe to run after 0001_init.sql + 0002_auth_roles.sql.
-- Run in: Supabase Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- NO NEW TABLES. The mentor↔student map (`mentor_assignments`), `progress`,
-- `enrollments`, `cohorts`, and `pods` already exist from 0001, and 0001's RLS
-- already lets a mentor read:
--   • their own `mentor_assignments` rows,
--   • assigned students' `progress` and `enrollments` (via mentors_student()),
--   • `cohorts` / `pods` (authenticated read).
--
-- The ONE gap this migration closes: a mentor could not read the *profile rows*
-- (names) of their assigned students — 0001's "profiles self read" policy only
-- allows `user_id = auth.uid() OR is_admin()`. This adds a scoped, additive
-- SELECT policy so a mentor can read EXACTLY the profiles of students assigned to
-- them, and nothing more. Students gain no new access; admins already see all.
--
-- Safety:
--   • mentors_student() is SECURITY DEFINER, so it bypasses RLS internally — no
--     policy recursion.
--   • Postgres combines multiple permissive SELECT policies with OR, so this only
--     GRANTS additional narrow read access; it never widens it for students.
--   • Idempotent: drop-if-exists then create.

drop policy if exists "profiles mentor read assigned" on public.profiles;
create policy "profiles mentor read assigned"
  on public.profiles
  for select
  using (public.mentors_student(id));

-- After running this, no schema/tables change — only the policy above is added.
-- Verify with:
--   select polname from pg_policies
--   where schemaname = 'public' and tablename = 'profiles'
--   order by polname;
-- You should see: "profiles admin write", "profiles mentor read assigned",
--                  "profiles self read", "profiles self update".
