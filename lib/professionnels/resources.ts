type ProfessionalRole = string

export type ProfessionalResource = {
  id: string
  title: string
  description: string
  href: string
  ctaLabel: string
  allowedRoles?: readonly ProfessionalRole[]
}

export const PROFESSIONAL_RESOURCES: readonly ProfessionalResource[] = [
  {
    id: "supports",
    title: "Supports",
    description: "Commandez vos supports de communication pour vos actions CPTS.",
    href: "/professionnels/supports",
    ctaLabel: "Accéder aux supports",
  },
  {
    id: "actions-outils",
    title: "Actions & Outils",
    description: "Retrouvez les ressources métiers et les outils territoriaux.",
    href: "/professionnels/actions-outils",
    ctaLabel: "Accéder aux actions",
  },
  {
    id: "formations",
    title: "Formations",
    description: "Consultez les sessions de formation et les modalités d'inscription.",
    href: "/professionnels/formations",
    ctaLabel: "Accéder aux formations",
  },
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function normalizeRole(role: string) {
  return role.trim().toLowerCase()
}

export function getUserRolesFromAppMetadata(appMetadata: unknown) {
  if (!isRecord(appMetadata)) {
    return [] as string[]
  }

  const roles: string[] = []
  const role = appMetadata.role
  const metadataRoles = appMetadata.roles

  if (typeof role === "string" && role.trim()) {
    roles.push(role)
  }

  if (Array.isArray(metadataRoles)) {
    metadataRoles.forEach((metadataRole) => {
      if (typeof metadataRole === "string" && metadataRole.trim()) {
        roles.push(metadataRole)
      }
    })
  }

  return Array.from(new Set(roles.map(normalizeRole)))
}

export function canAccessProfessionalResource(
  resource: ProfessionalResource,
  userRoles: readonly string[],
) {
  if (!resource.allowedRoles || resource.allowedRoles.length === 0) {
    return true
  }

  const userRoleSet = new Set(userRoles.map(normalizeRole))
  return resource.allowedRoles.some((role) => userRoleSet.has(normalizeRole(role)))
}

export function getAccessibleProfessionalResources(userRoles: readonly string[]) {
  return PROFESSIONAL_RESOURCES.filter((resource) =>
    canAccessProfessionalResource(resource, userRoles),
  )
}
