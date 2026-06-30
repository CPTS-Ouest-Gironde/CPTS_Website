BEGIN;

create table if not exists public.satisfaction_ps_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  annee_reference integer not null default extract(year from now()),
  created_at timestamptz not null default now(),
  constraint satisfaction_ps_submissions_unique unique (user_id, annee_reference)
);

alter table public.satisfaction_ps_submissions enable row level security;

drop policy if exists satisfaction_ps_submissions_select_own on public.satisfaction_ps_submissions;
-- Applies to authenticated users.
-- Allows a professional to read only their own annual submission trace.
-- Needed to block duplicate questionnaire submissions without linking identity to answers.
create policy satisfaction_ps_submissions_select_own
  on public.satisfaction_ps_submissions
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists satisfaction_ps_submissions_insert_own on public.satisfaction_ps_submissions;
-- Applies to authenticated users.
-- Allows a professional to create only their own annual submission trace.
-- Needed to enforce one questionnaire response per user and year.
create policy satisfaction_ps_submissions_insert_own
  on public.satisfaction_ps_submissions
  for insert to authenticated
  with check (auth.uid() = user_id);

COMMIT;
