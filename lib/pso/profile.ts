import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type PharmacyRow = Database["public"]["Tables"]["pharmacies"]["Row"]
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

type PharmacySummary = Pick<PharmacyRow, "adresse" | "finess" | "id" | "nom">
type ProfileSummary = Pick<ProfileRow, "first_name" | "id" | "last_name" | "pharmacie_id" | "rpps" | "titulaire">

export type PsoProfileRecord = ProfileSummary & {
  pharmacy: PharmacySummary | null
}

export async function getPsoProfileRecord(
  supabase: AppSupabaseClient,
  userId: string,
): Promise<PsoProfileRecord | null> {
  const profileResult = await supabase
    .from("profiles")
    .select("id,first_name,last_name,rpps,pharmacie_id,titulaire")
    .eq("id", userId)
    .maybeSingle()

  if (profileResult.error || !profileResult.data) {
    return null
  }

  let pharmacy: PharmacySummary | null = null

  if (profileResult.data.pharmacie_id) {
    const pharmacyResult = await supabase
      .from("pharmacies")
      .select("id,nom,finess,adresse")
      .eq("id", profileResult.data.pharmacie_id)
      .maybeSingle()

    if (!pharmacyResult.error && pharmacyResult.data) {
      pharmacy = pharmacyResult.data as PharmacySummary
    }
  }

  return {
    ...(profileResult.data as ProfileSummary),
    pharmacy,
  }
}

export function getPsoDisplayName(profile: Pick<ProfileRow, "first_name" | "last_name"> | null) {
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim()
  return fullName || "Professionnel"
}
