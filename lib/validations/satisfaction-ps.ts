import { z } from "zod"

const REQUIRED_BOOLEAN_ERROR = "Veuillez répondre à cette question."
const requiredBoolean = z.boolean({
  invalid_type_error: REQUIRED_BOOLEAN_ERROR,
  required_error: REQUIRED_BOOLEAN_ERROR,
})

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

export const satisfactionPsSchema = z.object({
  accesDistinctPertinent: requiredBoolean,
  chartesConnaissance: requiredBoolean,
  chartesDispositifsUtilises: requiredBoolean,
  chartesSatisfaction: requiredBoolean,
  chartesSouhaitReception: requiredBoolean,
  chartesSuggestions: requiredBoolean,
  chartesSuggestionsTexte: optionalTrimmedText(2000),
  outilsConnaissance: requiredBoolean,
  outilsUtilisation: requiredBoolean,
  siteConnaissance: requiredBoolean,
  siteConsultation: requiredBoolean,
  siteOutilPrevention: requiredBoolean,
  siteRubriquesUtiles: optionalTrimmedText(1000),
  siteSuggestionsTexte: optionalTrimmedText(2000),
  siteUtilite: requiredBoolean,
  vmvConnaissance: requiredBoolean,
  vmvSuggestions: requiredBoolean,
  vmvSuggestionsTexte: optionalTrimmedText(2000),
  vmvUtilise: requiredBoolean,
  vmvUtiliteTexte: optionalTrimmedText(1000),
})

export type SatisfactionPsInput = z.infer<typeof satisfactionPsSchema>
