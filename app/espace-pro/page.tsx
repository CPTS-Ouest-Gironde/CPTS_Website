import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getDefaultEspaceProPath, readUserAccessContext } from "@/lib/supabase/roles"

export default async function EspaceProHomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro")
  }

  const { profile, roles } = await readUserAccessContext(supabase, user.id)
  redirect(getDefaultEspaceProPath(roles, profile))
}
