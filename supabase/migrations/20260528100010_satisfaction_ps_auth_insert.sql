BEGIN;

drop policy if exists satisfaction_ps_insert_anon on public.satisfaction_ps;
drop policy if exists satisfaction_ps_insert_authenticated on public.satisfaction_ps;

-- Applies to authenticated users.
-- Allows connected professionals to submit anonymous questionnaire answers.
-- Needed because the form is now protected by authentication instead of public anonymous access.
create policy satisfaction_ps_insert_authenticated
  on public.satisfaction_ps
  for insert to authenticated
  with check (true);

COMMIT;
