export const FIELD_LABELS: Record<string, string> = {
  adresseurNom: "Adresseur - Nom et prénoms",
  adresseurRpps: "Adresseur - RPPS",
  patientPrenom: "Patient - Prénom",
  patientDdn: "Patient - DDN",
  patientAdresse: "Patient - Adresse",
  patientCp: "Patient - Code postal",
  patientCommune: "Patient - Commune",
  patientTelephone: "Patient - Téléphone",
  aidantTelephone: "Aidant familial - Téléphone",
  enfantsACharge: "Patient - Enfant(s) à charge",
  enfantsNombre: "Patient - Nombre d'enfants à charge",
  enfantsAges: "Patient - Âge(s) des enfants",
  atcdPsySuivi: "ATCD psy - Suivi",
  atcdPsyHospitalisation: "ATCD psy - Hospitalisation",
  paa: "PAA (TS, scarifications, hétéro-agressivité)",
  professionnelSante: "Professionnel de santé",
  modeVie: "Mode de vie",
  tttActuel: "TTT (actuel)",
  contexte: "Contexte - Motif de la demande",
  ruminationThemes: "Sommeil - Thèmes de rumination",
  humeur: "Humeur",
  suicidaireFrequences: "Idées suicidaires - Fréquences",
  suicidaireScenario: "Idées suicidaires - Scénario",
  suicidairePaaDate: "Idées suicidaires - Date de PAA programmée",
  toxiquesGlobal: "Consommation de toxiques - Oui/Non",
  toxiquesAlcool: "Consommation de toxiques - Alcool (quantité)",
  toxiqueAutre: "Consommation de toxiques - Précision (autre)",
  orientationProblematique: "Orientation - Problématique principale",
  orientationProposition: "Orientation - Compléments",
};

export function normalizeFieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  if (key.startsWith("orientation-")) return `Orientation - ${key.slice(12)}`;
  if (key.startsWith("toxique-")) return `Toxiques - ${key.slice(8)}`;
  if (key.startsWith("toxiques-")) return `Toxiques - ${key.slice(9)}`;
  if (key.startsWith("violence-")) return `Violences - ${key.slice(9)}`;
  if (key.startsWith("sommeil-")) return `Sommeil - ${key.slice(8)}`;
  if (key.startsWith("contact-")) return `Déjà contacté - ${key.slice(8)}`;
  if (key.startsWith("alimentation-")) return `Alimentation - ${key.slice(13)}`;
  if (key.startsWith("atcd-medical-")) return `ATCD médico-chir-allergie - ${key.slice(13)}`;
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
