import { Resend } from "resend"
import { NextResponse } from "next/server"
import {
  applyRateLimit,
  contactRequestSchema,
  enforceTrustedOrigin,
  escapeHtml,
  getFormNotificationRecipients,
  toMailtoHref,
} from "@/lib/api-security"
import { containsForbiddenLink } from "@/lib/message-content"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const originResponse = enforceTrustedOrigin(request)
  if (originResponse) {
    return originResponse
  }

  const rateLimitResponse = applyRateLimit(request, "contact")
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    const parsedBody = contactRequestSchema.safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Les donnees du formulaire sont invalides." },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, message } = parsedBody.data

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Le service est temporairement indisponible." },
        { status: 503 }
      )
    }

    const spamKeywords = [
      "viagra",
      "casino",
      "lottery",
      "bitcoin",
      "crypto",
      "investment",
      "click here",
      "buy now",
      "limited offer",
    ]
    const contentToCheck = `${firstName} ${lastName} ${message}`.toLowerCase()
    if (spamKeywords.some((keyword) => contentToCheck.includes(keyword))) {
      return NextResponse.json(
        { error: "Contenu suspect détecté" },
        { status: 400 }
      )
    }

    if (containsForbiddenLink(message)) {
      return NextResponse.json(
        { error: "Les liens ne sont pas autorises dans le message." },
        { status: 400 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const notificationRecipients = getFormNotificationRecipients()

    if (!notificationRecipients) {
      console.error("Form notification recipients are not configured")
      return NextResponse.json(
        { error: "Le service est temporairement indisponible." },
        { status: 503 }
      )
    }

    const safeSubjectFirstName = firstName.replace(/[\r\n]+/g, " ")
    const safeSubjectLastName = lastName.replace(/[\r\n]+/g, " ")
    const safeFirstName = escapeHtml(firstName)
    const safeLastName = escapeHtml(lastName)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)
    const replyToHref = toMailtoHref(email)

    const { data, error } = await resend.emails.send({
      from: "CPTS Ouest Gironde <contact@cpts-ouest-gironde.fr>",
      to: notificationRecipients,
      subject: `Nouveau message de ${safeSubjectFirstName} ${safeSubjectLastName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                CPTS Ouest Gironde
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Nouveau message depuis le site web
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding-bottom: 16px;">
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Prénom</p>
                          <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${safeFirstName}</p>
                        </td>
                        <td width="50%" style="padding-bottom: 16px;">
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Nom</p>
                          <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${safeLastName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                          <a href="${replyToHref}" style="font-size: 16px; color: #16a34a; text-decoration: none; font-weight: 500;">${safeEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">
                  <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
                </div>
              </div>

              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${replyToHref}" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 50px; text-decoration: none;">
                      Repondre a ${safeFirstName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">
                Ce message a été envoyé depuis le formulaire de contact du site<br>
                <a href="https://cpts-ouest-gironde.fr" style="color: #16a34a; text-decoration: none;">cpts-ouest-gironde.fr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      replyTo: email,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id ?? null })
  } catch (err) {
    console.error("Catch error:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    )
  }
}
