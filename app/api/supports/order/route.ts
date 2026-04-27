import { Resend } from "resend"
import { NextResponse } from "next/server"
import {
  applyRateLimit,
  enforceTrustedOrigin,
  escapeHtml,
  getFormNotificationRecipients,
  supportOrderSchema,
  toMailtoHref,
  toTelHref,
} from "@/lib/api-security"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const originResponse = enforceTrustedOrigin(request)
  if (originResponse) {
    return originResponse
  }

  const rateLimitResponse = applyRateLimit(request, "supports-order")
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    const parsedBody = supportOrderSchema.safeParse(body)

    if (!parsedBody.success) {
      const firstIssue = parsedBody.error.issues[0]
      return NextResponse.json(
        { error: firstIssue?.message || "Les donnees du formulaire sont invalides." },
        { status: 400 }
      )
    }

    const { name, email, phone, address, supports } = parsedBody.data

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Le service est temporairement indisponible." },
        { status: 503 }
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

    const safeSubjectName = name.replace(/[\r\n]+/g, " ")
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeAddress = escapeHtml(address)
    const safeFirstName = escapeHtml(name.split(" ")[0] || name)
    const mailtoHref = toMailtoHref(email)
    const telHref = toTelHref(phone)

    const supportsTableRows = supports
      .map(
        (support) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 15px; color: #111827; font-weight: 600;">${escapeHtml(support.name)}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #6b7280;">${escapeHtml(support.description)}</p>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 14px; font-weight: 700; padding: 6px 16px; border-radius: 8px;">
            ${support.quantity}
          </span>
        </td>
      </tr>
    `
      )
      .join("")

    const totalItems = supports.reduce((sum, s) => sum + s.quantity, 0)

    const { data, error } = await resend.emails.send({
      from: "CPTS Ouest Gironde <contact@cpts-ouest-gironde.fr>",
      to: notificationRecipients,
      subject: `Nouvelle commande de supports - ${safeSubjectName}`,
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
                Nouvelle commande de supports visuels
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Order Summary -->
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 32px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #166534; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Total de la commande</p>
                <p style="margin: 8px 0 0 0; font-size: 36px; color: #15803d; font-weight: 700;">${totalItems}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #166534;">support${totalItems > 1 ? "s" : ""} commandé${totalItems > 1 ? "s" : ""}</p>
              </div>

              <!-- Customer Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #111827; font-weight: 700;">Informations du demandeur</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Nom complet</p>
                          <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${safeName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                          <a href="${mailtoHref}" style="font-size: 16px; color: #16a34a; text-decoration: none; font-weight: 500;">${safeEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</p>
                          <a href="${telHref}" style="font-size: 16px; color: #16a34a; text-decoration: none; font-weight: 500;">${escapeHtml(phone)}</a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Adresse postale</p>
                          <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.5;">${safeAddress}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Supports Ordered -->
              <div>
                <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827; font-weight: 700;">Supports commandés</h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 16px; text-align: left; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Support</th>
                      <th style="padding: 16px; text-align: center; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${supportsTableRows}
                  </tbody>
                </table>
              </div>

              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${mailtoHref}" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 50px; text-decoration: none;">
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
                Cette commande a été passée depuis le formulaire de commande<br>
                <a href="https://cpts-ouest-gironde.fr/professionnels/supports" style="color: #16a34a; text-decoration: none;">cpts-ouest-gironde.fr/professionnels/supports</a>
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
        { error: "Erreur lors de l'envoi de la commande." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id ?? null })
  } catch (err) {
    console.error("Catch error:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la commande." },
      { status: 500 }
    )
  }
}
