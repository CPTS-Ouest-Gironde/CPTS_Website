import { normalizeFieldLabel } from "@/lib/demande-orientation-psy/field-labels";
import { DATE_FIELD_KEYS, formatDateFr } from "@/lib/demande-orientation-psy/format";
import type { Row } from "@/lib/demande-orientation-psy/sections";

export function normalizeFieldValue(key: string, value: string): string {
  const v = value === "on" ? "Oui" : value;
  return DATE_FIELD_KEYS.has(key) ? formatDateFr(v) : v;
}

export function buildRows(data: Record<string, string | string[]>): Row[] {
  const rows: Row[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("toxique-") && key.endsWith("-detail")) continue;

    if (key.startsWith("toxique-")) {
      const checkboxValue = Array.isArray(value) ? value[0] : value;
      if (checkboxValue !== "on") continue;

      const detailRaw = data[`${key}-detail`];
      const detailStr = !detailRaw
        ? ""
        : Array.isArray(detailRaw)
          ? detailRaw.filter(Boolean).join(", ")
          : detailRaw.trim();

      rows.push({
        key,
        label: `Toxiques - ${key.slice(8)}`,
        value: detailStr || "Oui",
      });
      continue;
    }

    rows.push({
      key,
      label: normalizeFieldLabel(key),
      value: Array.isArray(value)
        ? value.map((v) => normalizeFieldValue(key, v)).join(", ")
        : normalizeFieldValue(key, value),
    });
  }

  return rows;
}
