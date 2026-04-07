import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config"

const PROTECTED_PRO_ROUTES = [
  "/professionnels",
  "/professionnels/supports",
  "/professionnels/actions-outils",
  "/professionnels/formations",
] as const

const PUBLIC_PRO_EXCEPTIONS = ["/professionnels/adhesion"] as const

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

  const { pathname, search } = request.nextUrl
  const isProtectedPath = isProtectedProfessionnelsPath(pathname)
  const isLoginPath = pathname === "/login"

  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("next", `${pathname}${search}`)

    return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
  }

  if (isLoginPath && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/professionnels"
    redirectUrl.search = ""

    return copySetCookieHeaders(response, NextResponse.redirect(redirectUrl))
  }

  return response
}
