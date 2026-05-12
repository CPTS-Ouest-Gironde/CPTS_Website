import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  applyRateLimit,
  enforceTrustedOrigin,
  escapeHtml,
} from "@/lib/api-security";
import { formatDatetimeFr } from "@/lib/demande-orientation-psy/format";
import { groupRowsBySection, type Section } from "@/lib/demande-orientation-psy/sections";
import { buildRows } from "@/lib/demande-orientation-psy/transform";

export const runtime = "nodejs";

const orientationRequestSchema = z
  .object({
    generatedAt: z.string().trim().min(10).max(64),
    originPath: z.string().trim().max(200).optional(),
    data: z.record(z.union([z.string().max(5000), z.array(z.string().max(5000))])),
  })
  .strict();


function buildPlainText(
  sections: Section[],
  generatedAt: string,
  originPath?: string,
): string {
  const lines: string[] = [];
  lines.push("Nouveau formulaire d'orientation IDE psy");
  lines.push(`Date de generation : ${formatDatetimeFr(generatedAt)}`);
  if (originPath) {
    lines.push(`Source : ${originPath}`);
  }

  if (sections.length === 0) {
    lines.push("");
    lines.push("- Aucun champ renseigne");
  } else {
    for (const section of sections) {
      lines.push("");
      lines.push(`=== ${section.title} ===`);
      for (const row of section.rows) {
        lines.push(`${row.label} : ${row.value}`);
      }
    }
  }

  return lines.join("\n");
}

function buildSectionsHtml(sections: Section[]): string {
  if (sections.length === 0) {
    return `<tr><td colspan="2" style="padding:12px;border:1px solid #e5e7eb;">Aucun champ renseigné</td></tr>`;
  }

  return sections
    .map(
      (section) => `
        <tr>
          <td colspan="2" style="padding:8px 12px;background:#1e3a5f;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;">
            ${escapeHtml(section.title)}
          </td>
        </tr>
        ${section.rows
          .map(
            (row) => `
          <tr>
            <td style="padding:9px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;vertical-align:top;width:38%;">${escapeHtml(row.label)}</td>
            <td style="padding:9px 12px;border:1px solid #e5e7eb;vertical-align:top;white-space:pre-wrap;">${escapeHtml(row.value)}</td>
          </tr>`,
          )
          .join("")}`,
    )
    .join("");
}

export async function POST(request: Request) {
  const originResponse = enforceTrustedOrigin(request);
  if (originResponse) {
    return originResponse;
  }

  const rateLimitResponse = applyRateLimit(request, "orientation-psy");
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const parsedBody = orientationRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Les donnees du formulaire sont invalides." },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Le service est temporairement indisponible." },
        { status: 503 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const isProd = process.env.NODE_ENV === "production";
    const recipientEmail = isProd
      ? process.env.IDE_PSY_PROD_EMAIL
      : process.env.IDE_PSY_DEV_EMAIL;

    if (!recipientEmail) {
      console.error(
        isProd
          ? "IDE_PSY_PROD_EMAIL manquante en prod"
          : "IDE_PSY_DEV_EMAIL manquante en dev",
      );
      return NextResponse.json(
        { error: "Aucun destinataire de notification n'est configuré." },
        { status: 503 },
      );
    }

    const recipients = [recipientEmail];

    const rows = buildRows(parsedBody.data.data);
    const sections = groupRowsBySection(rows);
    const plainTextBody = buildPlainText(
      sections,
      parsedBody.data.generatedAt,
      parsedBody.data.originPath,
    );
    const sectionsHtml = buildSectionsHtml(sections);

    const { error } = await resend.emails.send({
      from: "CPTS Ouest Gironde <contact@cpts-ouest-gironde.fr>",
      to: recipients,
      subject: "Demande d'orientation IDE psy - formulaire web",
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="720" cellpadding="0" cellspacing="0" style="max-width:720px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px;border-bottom:1px solid #e5e7eb;">
                <h1 style="margin:0;font-size:20px;color:#111827;">Demande d'orientation IDE psy</h1>
                <p style="margin:8px 0 0 0;font-size:14px;color:#6b7280;">Envoi automatique depuis le formulaire web /espace-pro/demande-orientation-psy</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px 0;font-size:13px;color:#4b5563;">
                  Date de génération : <strong>${escapeHtml(formatDatetimeFr(parsedBody.data.generatedAt))}</strong>
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;">
                  ${sectionsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                Données de santé : ce mail contient des informations sensibles. Merci d'appliquer vos règles de confidentialité et de conservation.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
      text: plainTextBody,
    });

    if (error) {
      console.error("Resend error (orientation-psy):", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du formulaire." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Catch error (orientation-psy):", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du formulaire." },
      { status: 500 },
    );
  }
}
