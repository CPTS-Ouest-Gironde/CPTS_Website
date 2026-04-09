import { NextResponse } from "next/server"
import { isIP } from "node:net"
import { z } from "zod"
import {
  containsForbiddenLink,
  isValidPersonName,
  isValidPostalAddress,
} from "@/lib/message-content"

type RateLimitKey = "contact" | "supports-order"

type RateLimitBucket = {
  count: number
  resetAt: number
}

type RateLimitRule = {
  limit: number
  message: string
  windowMs: number
}

const RATE_LIMIT_RULES: Record<RateLimitKey, RateLimitRule> = {
  contact: {
    limit: 1,
    message:
      "Veuillez attendre que la CPTS Ouest Gironde revienne vers vous avant de renvoyer un message.",
    windowMs: 12 * 60 * 60 * 1000,
  },
  "supports-order": {
    limit: 2,
    message:
      "Veuillez attendre le retour de la CPTS Ouest Gironde avant de renvoyer une commande.",
    windowMs: 12 * 60 * 60 * 1000,
  },
}

declare global {
  var __cptsRateLimitStore: Map<string, RateLimitBucket> | undefined
}

const rateLimitStore = globalThis.__cptsRateLimitStore ?? new Map<string, RateLimitBucket>()

if (!globalThis.__cptsRateLimitStore) {
  globalThis.__cptsRateLimitStore = rateLimitStore
}

export const contactRequestSchema = z
  .object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(10).max(2000),
  })
  .strict()

const orderItemSchema = z
  .object({
    id: z.string().trim().min(1).max(100),
    name: z.string().trim().min(1).max(150),
    quantity: z.number().int().min(1).max(100),
    description: z.string().trim().min(1).max(500),
  })
  .strict()

export const supportOrderSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .refine((value) => !containsForbiddenLink(value), {
        message: "Les liens ne sont pas autorises dans le nom.",
      })
      .refine(isValidPersonName, {
        message: "Le nom et le prenom contiennent des caracteres invalides.",
      }),
    email: z.string().trim().email().max(254),
    phone: z
      .string()
      .trim()
      .min(8)
      .max(32)
      .transform((value) => value.replace(/[\s.-]/g, ""))
      .refine((value) => /^(?:(?:\+|00)33|0)[1-9][0-9]{8}$/.test(value), {
        message: "Format de telephone invalide",
      }),
    address: z
      .string()
      .trim()
      .min(10)
      .max(200)
      .refine((value) => !containsForbiddenLink(value), {
        message: "Les liens ne sont pas autorises dans l'adresse postale.",
      })
      .refine(isValidPostalAddress, {
        message: "L'adresse postale contient des caracteres invalides.",
      }),
    supports: z.array(orderItemSchema).min(1).max(50),
  })
  .strict()

function parseIpCandidate(candidate: string | null) {
  if (!candidate) {
    return null
  }

  const trimmedCandidate = candidate.trim()
  if (!trimmedCandidate) {
    return null
  }

  if (isIP(trimmedCandidate)) {
    return trimmedCandidate
  }

  const ipv4WithPortMatch = trimmedCandidate.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/)
  if (ipv4WithPortMatch && isIP(ipv4WithPortMatch[1]) === 4) {
    return ipv4WithPortMatch[1]
  }

  const ipv6WithPortMatch = trimmedCandidate.match(/^\[([0-9A-Fa-f:]+)\]:\d+$/)
  if (ipv6WithPortMatch && isIP(ipv6WithPortMatch[1]) === 6) {
    return ipv6WithPortMatch[1]
  }

  return null
}

function getClientIp(request: Request) {
  // Priority order:
  // 1) x-vercel-forwarded-for (trusted in production on Vercel because platform-managed)
  // 2) x-forwarded-for first IP only for non-Vercel production fallback deployments
  // 3) stable local fallback to keep rate limiting effective in dev
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for")
  if (vercelForwardedFor) {
    const firstVercelIp = parseIpCandidate(vercelForwardedFor.split(",")[0] ?? null)
    if (firstVercelIp) {
      return firstVercelIp
    }
  }

  const isVercelRuntime = process.env.VERCEL === "1"
  if (!isVercelRuntime && process.env.NODE_ENV === "production") {
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) {
      const firstForwardedIp = parseIpCandidate(forwardedFor.split(",")[0] ?? null)
      if (firstForwardedIp) {
        return firstForwardedIp
      }
    }
  }

  return process.env.NODE_ENV === "production" ? "unknown" : "unknown-local"
}

function pruneExpiredRateLimitBuckets(now: number) {
  for (const [bucketKey, bucket] of rateLimitStore) {
    if (bucket.resetAt <= now) {
      rateLimitStore.delete(bucketKey)
    }
  }
}

function normalizeHost(value: string) {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return null
  }

  try {
    if (/^[a-z]+:\/\//i.test(trimmedValue)) {
      return new URL(trimmedValue).host.toLowerCase()
    }

    return new URL(`https://${trimmedValue}`).host.toLowerCase()
  } catch {
    return null
  }
}

export function applyRateLimit(request: Request, key: RateLimitKey) {
  const clientIp = getClientIp(request)
  const bucketKey = `${key}:${clientIp}`
  const now = Date.now()
  const rule = RATE_LIMIT_RULES[key]
  pruneExpiredRateLimitBuckets(now)
  const bucket = rateLimitStore.get(bucketKey)

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(bucketKey, {
      count: 1,
      resetAt: now + rule.windowMs,
    })
    return null
  }

  if (bucket.count >= rule.limit) {
    return NextResponse.json(
      { error: rule.message },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)),
        },
      }
    )
  }

  bucket.count += 1
  rateLimitStore.set(bucketKey, bucket)
  return null
}

export function enforceTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin")

  if (!origin) {
    return NextResponse.json({ error: "Origine non autorisee." }, { status: 403 })
  }

  const requestUrl = new URL(request.url)
  const requestHost = normalizeHost(requestUrl.host)
  if (!requestHost) {
    return NextResponse.json({ error: "Configuration serveur invalide." }, { status: 500 })
  }
  const trustedHosts = new Set<string>([requestHost])

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (configuredSiteUrl) {
    const configuredHost = normalizeHost(configuredSiteUrl)
    if (!configuredHost) {
      return NextResponse.json({ error: "Configuration serveur invalide." }, { status: 500 })
    }
    trustedHosts.add(configuredHost)
  }

  const originHost = normalizeHost(origin)
  if (!originHost || !trustedHosts.has(originHost)) {
    return NextResponse.json({ error: "Origine non autorisee." }, { status: 403 })
  }

  return null
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      case "'":
        return "&#39;"
      default:
        return char
    }
  })
}

export function toMailtoHref(email: string) {
  return `mailto:${encodeURIComponent(email)}`
}

export function toTelHref(phone: string) {
  return `tel:${phone}`
}

export function getFormNotificationRecipients() {
  const configuredRecipients =
    process.env.NODE_ENV === "production"
      ? process.env.RESEND_PROD_NOTIFICATION_EMAIL || process.env.RESEND_NOTIFICATION_EMAIL
      : process.env.RESEND_DEV_NOTIFICATION_EMAIL || process.env.RESEND_NOTIFICATION_EMAIL

  if (!configuredRecipients) {
    return null
  }

  const recipients = configuredRecipients
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  if (recipients.length === 0) {
    return null
  }

  const parsedRecipients = z.array(z.string().email()).safeParse(recipients)

  if (!parsedRecipients.success) {
    return null
  }

  return parsedRecipients.data
}
