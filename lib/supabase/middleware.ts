import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config"
import { isFullyAuthenticatedForProAccess } from "@/lib/supabase/pro-auth"
import {
  COMPLETE_PROFILE_PATH,
  getRequiredRolesForPath,
  hasAnyRole,
  hasRole,
  readUserAccessContext,
  requiresPharmacienProfileCompletion,
} from "@/lib/supabase/roles"

const PROTECTED_PRO_ROUTES = [
  "/professionnels",
  "/professionnels/supports",
  "/professionnels/actions-outils",
  "/professionnels/formations",
] as const

const PUBLIC_PRO_EXCEPTIONS = ["/professionnels/adhesion"] as const
const ESPACE_PRO_PATH = "/espace-pro"
const SETUP_PASSWORD_PATH = "/setup-password"
const RESET_PASSWORD_PATH = "/reset-password"

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

function isPublicException(pathname: string) {
  return PUBLIC_PRO_EXCEPTIONS.some((route) => matchesRoute(pathname, route))
}

function isProtectedProfessionnelsPath(pathname: string) {
  if (isPublicException(pathname)) {
    return false
  }

  return PROTECTED_PRO_ROUTES.some((route) => matchesRoute(pathname, route))
}

function isEspaceProPath(pathname: string) {
  return matchesRoute(pathname, ESPACE_PRO_PATH)
}

function copySetCookieHeaders(source: NextResponse, target: NextResponse) {
  source.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      target.headers.append(key, value)
    }
  })

  return target
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isFullyAuthenticated = await isFullyAuthenticatedForProAccess(user, () => supabase.auth.getClaims())

  const { pathname, search } = request.nextUrl
  const isProtectedPath = isProtectedProfessionnelsPath(pathname)
  const isEspaceProProtectedPath = isEspaceProPath(pathname)
  const isLoginPath = pathname === "/login"
  const isSetupPasswordPath = pathname === SETUP_PASSWORD_PATH
  const isResetPasswordPath = pathname === RESET_PASSWORD_PATH
  const isAllowedPendingPath = isSetupPasswordPath || isResetPasswordPath

  if ((isProtectedPath || isEspaceProProtectedPath) && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("next", `${pathname}${search}`)

    return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
  }

  if (user && !isFullyAuthenticated && !isAllowedPendingPath) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = SETUP_PASSWORD_PATH
    redirectUrl.search = ""

    return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
  }

  if (user && isEspaceProProtectedPath) {
    const { profile, roles } = await readUserAccessContext(supabase, user.id)
    const requiredRoles = getRequiredRolesForPath(pathname)

    if (pathname === COMPLETE_PROFILE_PATH && !hasRole(roles, "pharmacien_pso")) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/professionnels"
      redirectUrl.search = ""

      return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
    }

    if (requiredRoles && !hasAnyRole(roles, requiredRoles)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/professionnels"
      redirectUrl.search = ""

      return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
    }

    if (requiresPharmacienProfileCompletion(pathname, roles, profile?.rpps ?? null)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = COMPLETE_PROFILE_PATH
      redirectUrl.search = ""

      return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
    }
  }

  if (isLoginPath && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = isFullyAuthenticated ? "/professionnels" : SETUP_PASSWORD_PATH
    redirectUrl.search = ""

    return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
  }

  if (isSetupPasswordPath && user && isFullyAuthenticated) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/professionnels"
    redirectUrl.search = ""

    return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
  }

  return response
}
