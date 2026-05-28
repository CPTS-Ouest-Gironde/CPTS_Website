BEGIN;

insert into public.user_roles (user_id, role)
select '894a9fb2-ea34-4261-b205-c5e00e2f15f7', 'membre_ca'
where exists (
  select 1 from auth.users where id = '894a9fb2-ea34-4261-b205-c5e00e2f15f7'
)
on conflict (user_id, role) do nothing;

COMMIT;
