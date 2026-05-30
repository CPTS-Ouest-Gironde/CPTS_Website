export type Row = { key: string; label: string; value: string };
export type Section = { title: string; rows: Row[] };

type SectionDef = {
  title: string;
  matches: (key: string) => boolean;
};

const SECTION_ORDER: SectionDef[] = [
  {
    title: "ADRESSEUR",
    matches: (k) => ["adresseurNom", "adresseurRpps"].includes(k),
  },
  {
    title: "PATIENT",
    matches: (k) =>
      [
        "patientPrenom",
        "patientDdn",
        "patientAdresse",
        "patientCp",
        "patientCommune",
        "patientTelephone",
        "aidantTelephone",
        "professionnelSante",
        "enfantsACharge",
        "enfantsNombre",
        "enfantsAges",
      ].includes(k),
  },
  {
    title: "ANTÉCÉDENTS",
    matches: (k) =>
      k.startsWith("atcd-medical-") ||
      ["atcdPsySuivi", "atcdPsyHospitalisation", "paa"].includes(k) ||
      k.startsWith("contact-"),
  },
  {
    title: "MODE DE VIE",
    matches: (k) => k === "modeVie",
  },
  {
    title: "TTT (ACTUEL)",
    matches: (k) => k === "tttActuel",
  },
  {
    title: "CONTEXTE - MOTIF DE LA DEMANDE",
    matches: (k) => k === "contexte",
  },
  {
    title: "SOMMEIL",
    matches: (k) =>
      k.startsWith("sommeil-") || k === "ruminationThemes",
  },
  {
    title: "ALIMENTATION",
    matches: (k) => k.startsWith("alimentation-"),
  },
  {
    title: "HUMEUR",
    matches: (k) => k === "humeur",
  },
  {
    title: "IDÉES SUICIDAIRES",
    matches: (k) =>
      ["suicidaireFrequences", "suicidaireScenario", "suicidairePaaDate"].includes(k),
  },
  {
    title: "VIOLENCES",
    matches: (k) => k.startsWith("violence-"),
  },
  {
    title: "CONSOMMATION DE TOXIQUES",
    matches: (k) => k === "toxiquesGlobal" || k.startsWith("toxique-"),
  },
  {
    title: "ORIENTATION",
    matches: (k) =>
      k.startsWith("orientation-") ||
      ["orientationProblematique", "orientationProposition"].includes(k),
  },
];

export function groupRowsBySection(rows: Row[]): Section[] {
  const sections: Section[] = [];

  for (const def of SECTION_ORDER) {
    const sectionRows = rows.filter((r) => def.matches(r.key));
    if (sectionRows.length > 0) {
      sections.push({ title: def.title, rows: sectionRows });
    }
  }

  const matchedKeys = new Set(sections.flatMap((s) => s.rows.map((r) => r.key)));
  const unmatched = rows.filter((r) => !matchedKeys.has(r.key));
  if (unmatched.length > 0) {
    sections.push({ title: "AUTRES", rows: unmatched });
  }

  return sections;
}
