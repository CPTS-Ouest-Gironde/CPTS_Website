BEGIN;

-- Retire la possibilité d'insérer directement dans la table réponses.
-- Toutes les soumissions doivent passer par la fonction RPC submit_satisfaction_ps
-- qui est SECURITY DEFINER et gère l'atomicité réponse + tracking.
drop policy if exists satisfaction_ps_insert_authenticated on public.satisfaction_ps;
drop policy if exists satisfaction_ps_insert_anon on public.satisfaction_ps;

COMMIT;
