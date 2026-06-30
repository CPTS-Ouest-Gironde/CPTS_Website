import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export const USER_ROLE_VALUES = [
  "adherent",
  "membre_ca",
  "collaborateur",
  "pharmacien_pso",
  "reporting_pso",
] as const

export type UserRole = (typeof USER_ROLE_VALUES)[number]

type AppSupabaseClient = SupabaseClient<Database>

type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"]
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type AccessProfile = Pick<ProfileRow, "pharmacie_id" | "rpps">

export type UserAccessContext = {
  profile: AccessProfile | null
  roles: UserRole[]
}

const ESPACE_PRO_PHARMACIEN_ROUTE_PREFIXES = ["/espace-pro/pmo", "/espace-pro/satisfaction"] as const

const ROLE_PROTECTED_ROUTES = [
  {
    roles: ["pharmacien_pso"] as const,
    route: "/espace-pro/pmo",
  },
  {
    roles: ["pharmacien_pso"] as const,
    route: "/espace-pro/satisfaction",
  },
  {
    roles: ["reporting_pso"] as const,
    route: "/espace-pro/dashboard",
  },
  {
    roles: ["membre_ca"] as const,
    route: "/espace-pro/satisfaction-ps/dashboard",
  },
  {
    roles: ["reporting_pso"] as const,
    route: "/espace-pro/qr-codes",
  },
] as const

export const COMPLETE_PROFILE_PATH = "/espace-pro/completer-profil"

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

function isUserRole(value: string): value is UserRole {
  return USER_ROLE_VALUES.includes(value as UserRole)
}

export function normalizeRole(role: string) {
  return role.trim().toLowerCase()
}

export function hasRole(roles: readonly string[], role: UserRole) {
  const normalizedRole = normalizeRole(role)
  return roles.some((candidateRole) => normalizeRole(candidateRole) === normalizedRole)
}

export function hasAnyRole(roles: readonly string[], requiredRoles: readonly UserRole[]) {
  return requiredRoles.some((requiredRole) => hasRole(roles, requiredRole))
}

export function getRequiredRolesForPath(pathname: string) {
  const matchingRoute = ROLE_PROTECTED_ROUTES.find(({ route }) => matchesRoute(pathname, route))
  return matchingRoute?.roles ?? null
}

export function hasCompletedPharmacienProfile(profile: AccessProfile | null) {
  return Boolean(profile?.rpps && profile?.pharmacie_id)
}

export function getDefaultEspaceProPath(roles: readonly string[], profile: AccessProfile | null) {
  if (hasRole(roles, "pharmacien_pso")) {
    return hasCompletedPharmacienProfile(profile) ? "/espace-pro/pmo" : COMPLETE_PROFILE_PATH
  }

  return "/professionnels"
}

export function requiresPharmacienProfileCompletion(pathname: string, roles: readonly string[], profile: AccessProfile | null) {
  if (!hasRole(roles, "pharmacien_pso")) {
    return false
  }

  if (hasCompletedPharmacienProfile(profile)) {
    return false
  }

  if (matchesRoute(pathname, COMPLETE_PROFILE_PATH)) {
    return false
  }

  return ESPACE_PRO_PHARMACIEN_ROUTE_PREFIXES.some((route) => matchesRoute(pathname, route))
}

export async function readUserAccessContext(supabase: AppSupabaseClient, userId: string): Promise<UserAccessContext> {
  const [rolesResult, profileResult] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase.from("profiles").select("rpps,pharmacie_id").eq("id", userId).maybeSingle(),
  ])

  const roles =
    rolesResult.error || !rolesResult.data
      ? []
      : rolesResult.data
          .map((row: Pick<UserRoleRow, "role">) => normalizeRole(row.role))
          .filter(isUserRole)

  const profile =
    profileResult.error || !profileResult.data
      ? null
      : (profileResult.data as AccessProfile)

  return {
    profile,
    roles,
  }
}
