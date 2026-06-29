BEGIN;

alter table public.satisfaction_ps
  add constraint satisfaction_ps_chartes_suggestions_texte_len check (char_length(chartes_suggestions_texte) <= 2000),
  add constraint satisfaction_ps_site_rubriques_utiles_len check (char_length(site_rubriques_utiles) <= 1000),
  add constraint satisfaction_ps_site_suggestions_texte_len check (char_length(site_suggestions_texte) <= 2000),
  add constraint satisfaction_ps_vmv_utilite_texte_len check (char_length(vmv_utilite_texte) <= 1000),
  add constraint satisfaction_ps_vmv_suggestions_texte_len check (char_length(vmv_suggestions_texte) <= 2000);

COMMIT;
