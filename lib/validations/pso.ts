import { z } from "zod"

export const psoPatientSexeValues = ["homme", "femme"] as const
export const psoPatientAgeValues = ["<15", "15-20", "21-30", "31-40", "41-50", ">50"] as const
export const psoOrientationValues = [
  "officine",
  "medecin_delegant",
  "medecin_traitant",
  "urgences",
] as const
export const psoProductCountValues = ["0", "1", "2", "3", "4", "5", ">5"] as const
export const satisfactionPatientRaisonVenueValues = [
  "affiche_saison",
  "gene_symptomes",
  "pas_acces_medecin",
  "autres",
] as const
export const satisfactionPatientRaisonConsultationValues = [
  "effets_indesirables",
  "pas_amelioration",
  "aggravation",
  "bilan_allergologique",
] as const

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/
const rppsRegex = /^\d{10,11}$/
const finessRegex = /^\d{9}$/

function optionalTrimmedText(maxLength: number) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value
      }

      const trimmedValue = value.trim()
      return trimmedValue === "" ? undefined : trimmedValue
    },
    z.string().max(maxLength).optional(),
  )
}

function requiredTrimmedText(minLength: number, maxLength: number) {
  return z.string().trim().min(minLength).max(maxLength)
}

const scoreOneToFive = z.number().int().min(1).max(5)

export const pmoEntrySchema = z.object({
  dateRealisation: z.string().regex(dateOnlyRegex, "Date invalide."),
  medecinDelegantId: z.string().uuid("Médecin délégant invalide."),
  patientSexe: z.enum(psoPatientSexeValues),
  patientAge: z.enum(psoPatientAgeValues),
  patientMedecinTraitant: z.boolean(),
  orientation: z.enum(psoOrientationValues),
  prescriptionAntiH1: z.boolean(),
  prescriptionCollyre: z.boolean(),
  prescriptionAntiallergiqueNasal: z.boolean(),
  prescriptionCorticoideNasal: z.boolean(),
  nbProduitsPmo: z.enum(psoProductCountValues),
  dispensationConseil: z.boolean(),
  nbProduitsConseil: z.enum(psoProductCountValues),
  effetIndesirableDescription: optionalTrimmedText(2000),
  effetIndesirableSignale: z.boolean(),
  renouvellement: z.boolean(),
}).superRefine((value, ctx) => {
  if (value.effetIndesirableSignale && !value.effetIndesirableDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["effetIndesirableDescription"],
      message: "La description de l'effet indésirable est obligatoire.",
    })
  }

  if (!value.effetIndesirableSignale && value.effetIndesirableDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["effetIndesirableDescription"],
      message: "La description doit rester vide si aucun effet indésirable n'est signalé.",
    })
  }
})

export const satisfactionPharmacienSchema = z
  .object({
    satisfactionGlobale: scoreOneToFive,
    faciliteMiseEnPlace: scoreOneToFive,
    beneficePratique: scoreOneToFive,
    accesSoins: scoreOneToFive,
    appreciationPatients: scoreOneToFive,
    nbEffetsIndesirablesGraves: z.number().int().min(0),
    autresIncidents: z.boolean(),
    incidentsDescription: optionalTrimmedText(2000),
    commentaire: optionalTrimmedText(2000),
  })
  .superRefine((value, ctx) => {
    if (value.autresIncidents && !value.incidentsDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["incidentsDescription"],
        message: "La description des incidents est obligatoire.",
      })
    }
  })

export const satisfactionPatientSchema = z
  .object({
    raisonVenue: z.enum(satisfactionPatientRaisonVenueValues),
    raisonVenueAutre: optionalTrimmedText(500),
    raisonNonRenouvellement: optionalTrimmedText(500),
    satisfactionPriseEnCharge: scoreOneToFive,
    conseilsAide: scoreOneToFive,
    faciliteVie: scoreOneToFive,
    souhaitRenouvellement: z.boolean(),
    consultationMedecinApres: z.boolean(),
    raisonConsultation: z.enum(satisfactionPatientRaisonConsultationValues).optional(),
    commentaire: optionalTrimmedText(2000),
  })
  .superRefine((value, ctx) => {
    if (value.raisonVenue === "autres" && !value.raisonVenueAutre) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raisonVenueAutre"],
        message: "Merci de préciser la raison de venue.",
      })
    }

    if (value.consultationMedecinApres && !value.raisonConsultation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raisonConsultation"],
        message: "Merci de préciser la raison de consultation.",
      })
    }

    if (!value.consultationMedecinApres && value.raisonConsultation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raisonConsultation"],
        message: "La raison de consultation doit rester vide.",
      })
    }

    if (value.souhaitRenouvellement && value.raisonNonRenouvellement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["raisonNonRenouvellement"],
        message: "La raison doit rester vide si vous souhaitez renouveler cette prise en charge.",
      })
    }
  })

export const completeProfileSchema = z.object({
  firstName: requiredTrimmedText(1, 120),
  lastName: requiredTrimmedText(1, 120),
  rpps: z.string().trim().regex(rppsRegex, "Le RPPS doit contenir 10 ou 11 chiffres."),
  pharmacieNom: requiredTrimmedText(2, 160),
  pharmacieFiness: z.string().trim().regex(finessRegex, "Le FINESS doit contenir 9 chiffres."),
  titulaire: z.boolean(),
  pharmacieAdresse: optionalTrimmedText(300),
})

export type PmoEntryInput = z.infer<typeof pmoEntrySchema>
export type SatisfactionPharmacienInput = z.infer<typeof satisfactionPharmacienSchema>
export type SatisfactionPatientInput = z.infer<typeof satisfactionPatientSchema>
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>
