BEGIN;

create or replace function public.submit_satisfaction_ps(
  p_user_id uuid,
  p_annee_reference integer,
  p_response jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'FORBIDDEN';
  end if;

  if exists (
    select 1
    from public.satisfaction_ps_submissions
    where user_id = p_user_id
      and annee_reference = p_annee_reference
  ) then
    raise exception 'ALREADY_SUBMITTED';
  end if;

  insert into public.satisfaction_ps (
    annee_reference,
    chartes_connaissance,
    chartes_souhait_reception,
    chartes_dispositifs_utilises,
    chartes_satisfaction,
    chartes_suggestions,
    chartes_suggestions_texte,
    site_connaissance,
    site_consultation,
    site_utilite,
    site_rubriques_utiles,
    outils_connaissance,
    outils_utilisation,
    acces_distinct_pertinent,
    site_outil_prevention,
    site_suggestions_texte,
    vmv_connaissance,
    vmv_utilise,
    vmv_utilite_texte,
    vmv_suggestions,
    vmv_suggestions_texte
  )
  select
    p_annee_reference,
    (p_response->>'chartes_connaissance')::boolean,
    (p_response->>'chartes_souhait_reception')::boolean,
    (p_response->>'chartes_dispositifs_utilises')::boolean,
    (p_response->>'chartes_satisfaction')::boolean,
    (p_response->>'chartes_suggestions')::boolean,
    p_response->>'chartes_suggestions_texte',
    (p_response->>'site_connaissance')::boolean,
    (p_response->>'site_consultation')::boolean,
    (p_response->>'site_utilite')::boolean,
    p_response->>'site_rubriques_utiles',
    (p_response->>'outils_connaissance')::boolean,
    (p_response->>'outils_utilisation')::boolean,
    (p_response->>'acces_distinct_pertinent')::boolean,
    (p_response->>'site_outil_prevention')::boolean,
    p_response->>'site_suggestions_texte',
    (p_response->>'vmv_connaissance')::boolean,
    (p_response->>'vmv_utilise')::boolean,
    p_response->>'vmv_utilite_texte',
    (p_response->>'vmv_suggestions')::boolean,
    p_response->>'vmv_suggestions_texte';

  insert into public.satisfaction_ps_submissions (user_id, annee_reference)
  values (p_user_id, p_annee_reference);
end;
$$;

revoke all on function public.submit_satisfaction_ps(uuid, integer, jsonb) from public;
grant execute on function public.submit_satisfaction_ps(uuid, integer, jsonb) to authenticated;

COMMIT;
