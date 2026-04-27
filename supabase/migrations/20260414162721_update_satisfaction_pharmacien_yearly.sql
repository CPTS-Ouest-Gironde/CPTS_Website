-- =========================================================
-- Update satisfaction_pharmacien yearly uniqueness
-- Autorise une réponse pharmacien par année de référence
-- =========================================================

BEGIN;

alter table if exists public.satisfaction_pharmacien
  add column if not exists annee_reference integer;

alter table if exists public.satisfaction_pharmacien
  alter column annee_reference set default extract(year from now())::integer;

update public.satisfaction_pharmacien
set annee_reference = extract(year from created_at)::integer
where annee_reference is distinct from extract(year from created_at)::integer;

alter table if exists public.satisfaction_pharmacien
  alter column annee_reference set not null;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select constraint_name_subquery.constraint_name
    from (
      select
        c.conname as constraint_name,
        array_agg(a.attname::text order by u.ordinality) as column_names
      from pg_constraint c
      join pg_class t
        on t.oid = c.conrelid
      join pg_namespace n
        on n.oid = t.relnamespace
      join unnest(c.conkey) with ordinality as u(attnum, ordinality)
        on true
      join pg_attribute a
        on a.attrelid = c.conrelid
       and a.attnum = u.attnum
      where n.nspname = 'public'
        and t.relname = 'satisfaction_pharmacien'
        and c.contype = 'u'
      group by c.conname
    ) as constraint_name_subquery
    where constraint_name_subquery.column_names = array['user_id']::text[]
  loop
    execute format(
      'alter table public.satisfaction_pharmacien drop constraint if exists %I',
      constraint_name
    );
  end loop;
end
$$;

do $$
declare
  index_name text;
begin
  for index_name in
    select index_name_subquery.index_name
    from (
      select
        i.relname as index_name,
        array_agg(a.attname::text order by key_column.ordinality) as column_names
      from pg_index idx
      join pg_class t
        on t.oid = idx.indrelid
      join pg_namespace n
        on n.oid = t.relnamespace
      join pg_class i
        on i.oid = idx.indexrelid
      join unnest(idx.indkey) with ordinality as key_column(attnum, ordinality)
        on true
      join pg_attribute a
        on a.attrelid = t.oid
       and a.attnum = key_column.attnum
      where n.nspname = 'public'
        and t.relname = 'satisfaction_pharmacien'
        and idx.indisunique
        and idx.indisvalid
      group by i.relname
    ) as index_name_subquery
    where index_name_subquery.column_names = array['user_id']::text[]
      and index_name_subquery.index_name <> 'satisfaction_pharmacien_user_year_unique'
  loop
    execute format('drop index if exists public.%I', index_name);
  end loop;
end
$$;

create unique index if not exists satisfaction_pharmacien_user_year_unique
  on public.satisfaction_pharmacien (user_id, annee_reference);

COMMIT;
