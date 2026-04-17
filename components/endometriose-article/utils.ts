import type { Tone } from "@/app/data/endometriose-depistage-prise-en-charge.schema";

export function sectionToneClass(tone: Tone) {
  return tone === "neutral" ? "bg-muted/30" : "bg-background";
}
