import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type MedecinDelegantRow = Pick<
  Database["public"]["Tables"]["medecins_delegants"]["Row"],
  "id" | "nom" | "prenom" | "rpps"
>

export type MedecinDelegantOption = {
  id: string
  label: string
  rpps: string
}

export function formatMedecinDelegantLabel(prenom: string, nom: string) {
  return `Dr ${prenom} ${nom}`
}

function toMedecinDelegantOption(row: MedecinDelegantRow): MedecinDelegantOption {
  return {
    id: row.id,
    label: formatMedecinDelegantLabel(row.prenom, row.nom),
    rpps: row.rpps,
  }
}

export async function getActiveMedecinsDelegants(
  supabase: AppSupabaseClient,
): Promise<MedecinDelegantOption[]> {
  const result = await supabase
    .from("medecins_delegants")
    .select("id,nom,prenom,rpps")
    .eq("actif", true)
    .order("nom", { ascending: true })
    .order("prenom", { ascending: true })

  if (result.error) {
    throw new Error("Impossible de charger les médecins délégants.")
  }

  return (result.data ?? []).map((row) => toMedecinDelegantOption(row as MedecinDelegantRow))
}

export async function getActiveMedecinDelegantById(
  supabase: AppSupabaseClient,
  medecinDelegantId: string,
): Promise<MedecinDelegantOption | null> {
  const result = await supabase
    .from("medecins_delegants")
    .select("id,nom,prenom,rpps")
    .eq("id", medecinDelegantId)
    .eq("actif", true)
    .maybeSingle()

  if (result.error || !result.data) {
    return null
  }

  return toMedecinDelegantOption(result.data as MedecinDelegantRow)
}

export function getSelectedMedecinDelegantId(
  medecinsDelegants: readonly MedecinDelegantOption[],
  rpps: string,
) {
  return medecinsDelegants.find((medecinDelegant) => medecinDelegant.rpps === rpps)?.id ?? ""
}
