-- BuildAI — initial schema + RLS
-- Run in Supabase SQL editor (or supabase db push). Starting point — review before production.

create extension if not exists "pgcrypto";

-- ---------- enums ----------
do $$ begin
  create type user_role as enum ('student','mentor','admin');
exception when duplicate_object then null; end $$;
do $$ begin
  create type college_status as enum ('lead','pilot','active','churned');
exception when duplicate_object then null; end $$;
do $$ begin
  create type cert_tier as enum ('participated','apprentice','distinction');
exception when duplicate_object then null; end $$;

-- ---------- core tables ----------
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text,
  college_id uuid,
  cohort_id uuid,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  tier text,
  tpo_contact text,
  status college_status default 'lead',
  created_at timestamptz default now()
);

create table if not exists cohorts (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  name text not null,
  start_date date,
  weeks int default 13,
  status text default 'planned',
  created_at timestamptz default now()
);

create table if not exists pods (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  name text not null,
  lead_mentor_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  cohort_id uuid references cohorts(id) on delete cascade,
  pod_id uuid references pods(id),
  tier_awarded cert_tier,
  created_at timestamptz default now()
);

create table if not exists mentor_assignments (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references profiles(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  pod_id uuid references pods(id),
  created_at timestamptz default now(),
  unique (mentor_id, student_id)
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  week int,
  module text,
  deliverable text,
  status text default 'in_progress',
  rubric_scores jsonb,
  mentor_notes text,
  created_at timestamptz default now()
);

create table if not exists student_api_keys (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  litellm_key_id text,
  key_alias text,
  budget_inr numeric,
  spend_inr numeric default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists llm_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  model text,
  prompt_tokens int,
  completion_tokens int,
  cost_inr numeric,
  latency_ms int,
  langfuse_trace_id text,
  ts timestamptz default now()
);

-- ---------- lead capture (public forms) ----------
create table if not exists pilot_inquiries (
  id uuid primary key default gen_random_uuid(),
  college text, contact_name text, role text, email text, phone text,
  city text, students_estimate text, start_term text, message text,
  handled boolean default false, notes text, created_at timestamptz default now()
);
create table if not exists student_waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text, college text, year text, branch text, email text,
  phone text, portfolio text, reason text,
  handled boolean default false, notes text, created_at timestamptz default now()
);
create table if not exists mentor_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text, company text, role text, years_exp text, linkedin text,
  github text, areas text, hours_per_week text, email text, note text,
  handled boolean default false, notes text, created_at timestamptz default now()
);

-- ---------- helper functions ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.mentors_student(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from mentor_assignments ma
    join profiles p on p.id = ma.mentor_id
    where p.user_id = auth.uid() and ma.student_id = target
  );
$$;

create or replace function public.is_self(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = target and user_id = auth.uid());
$$;

-- ---------- enable RLS ----------
alter table profiles enable row level security;
alter table colleges enable row level security;
alter table cohorts enable row level security;
alter table pods enable row level security;
alter table enrollments enable row level security;
alter table mentor_assignments enable row level security;
alter table progress enable row level security;
alter table student_api_keys enable row level security;
alter table llm_events enable row level security;
alter table pilot_inquiries enable row level security;
alter table student_waitlist enable row level security;
alter table mentor_applications enable row level security;

-- ---------- policies ----------
-- profiles
create policy "profiles self read" on profiles for select using (user_id = auth.uid() or is_admin());
create policy "profiles self update" on profiles for update using (user_id = auth.uid() or is_admin());
create policy "profiles admin write" on profiles for insert with check (is_admin());

-- reference data readable by any authenticated user; writable by admin
create policy "colleges read" on colleges for select using (auth.role() = 'authenticated');
create policy "colleges admin" on colleges for all using (is_admin()) with check (is_admin());
create policy "cohorts read" on cohorts for select using (auth.role() = 'authenticated');
create policy "cohorts admin" on cohorts for all using (is_admin()) with check (is_admin());
create policy "pods read" on pods for select using (auth.role() = 'authenticated');
create policy "pods admin" on pods for all using (is_admin()) with check (is_admin());
create policy "enrollments read" on enrollments for select using (is_self(student_id) or mentors_student(student_id) or is_admin());
create policy "enrollments admin" on enrollments for all using (is_admin()) with check (is_admin());

-- mentor_assignments
create policy "assignments read" on mentor_assignments for select using (
  is_admin() or exists (select 1 from profiles p where p.id = mentor_id and p.user_id = auth.uid())
);
create policy "assignments admin" on mentor_assignments for all using (is_admin()) with check (is_admin());

-- progress / keys / events: student sees own, mentor sees assigned, admin sees all
create policy "progress read" on progress for select using (is_self(student_id) or mentors_student(student_id) or is_admin());
create policy "progress write mentor/admin" on progress for all using (mentors_student(student_id) or is_admin()) with check (mentors_student(student_id) or is_admin());
create policy "keys read" on student_api_keys for select using (is_self(student_id) or is_admin());
create policy "keys admin" on student_api_keys for all using (is_admin()) with check (is_admin());
create policy "events read" on llm_events for select using (is_self(student_id) or mentors_student(student_id) or is_admin());
create policy "events admin write" on llm_events for insert with check (is_admin());

-- lead tables: inserts happen via service role (bypasses RLS). Reads restricted to admin.
create policy "pilot admin read" on pilot_inquiries for select using (is_admin());
create policy "waitlist admin read" on student_waitlist for select using (is_admin());
create policy "mentorapp admin read" on mentor_applications for select using (is_admin());
