import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>

export async function hasSubmittedSatisfactionPsForYear(
  supabase: AppSupabaseClient,
  userId: string,
  referenceYear = new Date().getFullYear(),
) {
  const result = await supabase
    .from("satisfaction_ps_submissions")
    .select("id")
    .eq("user_id", userId)
    .eq("annee_reference", referenceYear)
    .maybeSingle()

  if (result.error) {
    throw new Error("Impossible de vérifier la soumission satisfaction PS.")
  }

  return Boolean(result.data)
}
