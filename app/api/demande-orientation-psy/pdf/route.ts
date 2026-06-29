import React from "react";
import { NextResponse } from "next/server";
import { z } from "zod";
import { renderToBuffer } from "@react-pdf/renderer";
import { applyRateLimit, enforceTrustedOrigin } from "@/lib/api-security";
import { groupRowsBySection } from "@/lib/demande-orientation-psy/sections";
import { buildRows } from "@/lib/demande-orientation-psy/transform";
import { OrientationPsyPdf } from "@/lib/demande-orientation-psy/pdf-template";

export const runtime = "nodejs";

const orientationRequestSchema = z
  .object({
    generatedAt: z.string().trim().min(10).max(64),
    originPath: z.string().trim().max(200).optional(),
    data: z.record(z.union([z.string().max(5000), z.array(z.string().max(5000))])),
  })
  .strict();

export async function POST(request: Request) {
  const originResponse = enforceTrustedOrigin(request);
  if (originResponse) return originResponse;

  const rateLimitResponse = applyRateLimit(request, "orientation-psy-pdf");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const parsed = orientationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Les données du formulaire sont invalides." },
        { status: 400 },
      );
    }

    const rows = buildRows(parsed.data.data);
    const sections = groupRowsBySection(rows);

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const filename = `demande-orientation-psy-${dd}${mm}${yyyy}.pdf`;

    const element = React.createElement(OrientationPsyPdf, {
      sections,
      generatedAt: parsed.data.generatedAt,
      originPath: parsed.data.originPath,
    }) as Parameters<typeof renderToBuffer>[0];
    const buffer = await renderToBuffer(element);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF." },
      { status: 500 },
    );
  }
}
