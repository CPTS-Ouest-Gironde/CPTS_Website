const STOP_WORDS = new Set([
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "du",
  "de",
  "d",
  "je",
  "j",
  "tu",
  "il",
  "elle",
  "on",
  "nous",
  "vous",
  "ils",
  "elles",
  "me",
  "te",
  "se",
  "moi",
  "toi",
  "soi",
  "mon",
  "ma",
  "mes",
  "ton",
  "ta",
  "tes",
  "son",
  "sa",
  "ses",
  "notre",
  "votre",
  "leur",
  "ai",
  "as",
  "a",
  "avons",
  "avez",
  "ont",
  "suis",
  "es",
  "est",
  "sommes",
  "etes",
  "sont",
  "depuis",
  "hier",
  "aujourd",
  "hui",
  "demain",
  "plusieurs",
  "jours",
  "longtemps",
  "ce",
  "matin",
  "soir",
  "y",
  "et",
  "ou",
  "mais",
  "donc",
  "car",
  "ni",
  "a",
  "au",
  "aux",
  "en",
  "pour",
  "par",
  "sur",
  "sous",
  "dans",
  "avec",
  "sans",
])

export function stripStopWords(input: string): string {
  return input
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token))
    .join(" ")
}

export function normalizeTextPreservingStopWords(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function normalizeText(input: string): string {
  const normalized = normalizeTextPreservingStopWords(input)
  return stripStopWords(normalized).replace(/\s+/g, " ").trim()
}
