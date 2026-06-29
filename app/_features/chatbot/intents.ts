import type { QuickReply } from "./types"

export interface ConversationalIntentResult {
  message: string
  quickReplies?: QuickReply[]
  resourceIds?: string[]
}

function hasToken(input: string, token: string): boolean {
  const parts = input.split(" ").filter(Boolean)
  return parts.includes(token)
}

function hasPhrase(input: string, phrase: string): boolean {
  return input.includes(phrase)
}

function hasAnyPhrase(input: string, phrases: string[]): boolean {
  return phrases.some((phrase) => hasPhrase(input, phrase))
}

export function detectConversationalIntent(
  normalizedInput: string,
  defaultQuickReplies: QuickReply[] = [],
): ConversationalIntentResult | undefined {
  if (!normalizedInput) {
    return undefined
  }

  const isGreeting =
    hasToken(normalizedInput, "bonjour") ||
    hasToken(normalizedInput, "bonsoir") ||
    hasToken(normalizedInput, "salut") ||
    hasToken(normalizedInput, "coucou") ||
    hasToken(normalizedInput, "hello")

  if (isGreeting) {
    return {
      message:
        "Bonjour. Je suis l'assistant d'orientation CPTS. Donnez votre besoin en une phrase et je vous proposerai la bonne ressource.",
      quickReplies: defaultQuickReplies,
    }
  }

  const asksWhatIsCpts =
    hasToken(normalizedInput, "cpts") &&
    (hasAnyPhrase(normalizedInput, [
      "c est quoi",
      "qu est ce que",
      "qui est",
      "definition",
      "a quoi sert",
      "c est qui",
    ]) ||
      normalizedInput === "cpts")

  if (asksWhatIsCpts) {
    return {
      message:
        "La CPTS (Communauté Professionnelle Territoriale de Santé) coordonne les acteurs de santé d'un territoire pour améliorer l'accès aux soins, la prévention et l'orientation des patients.",
      resourceIds: ["presentation"],
      quickReplies: defaultQuickReplies,
    }
  }

  const isCapabilitiesQuestion =
    hasAnyPhrase(normalizedInput, [
      "qui etes vous",
      "que pouvez vous faire",
      "que peux tu faire",
      "comment ca marche",
      "a quoi servez vous",
      "a quoi tu sers",
      "comment vous pouvez m aider",
      "comment tu peux m aider",
      "comment m aider",
      "comment pouvez vous m aider",
      "comment tu peux aider",
      "comment peux tu m aider",
    ])

  if (isCapabilitiesQuestion) {
    return {
      message:
        "Je peux vous orienter vers les pages utiles du site CPTS: médecin traitant, annuaire, prévention, santé mentale, formations, supports, coordonnées et présentation de la CPTS.",
      quickReplies: defaultQuickReplies,
    }
  }

  const asksTerritoryHelp =
    hasToken(normalizedInput, "cpts") &&
    (hasAnyPhrase(normalizedInput, ["peux m aider", "peut m aider", "vous pouvez m aider", "aider", "aide"])
      || hasAnyPhrase(normalizedInput, ["bordeaux", "gironde", "pessac", "merignac"]))

  if (asksTerritoryHelp) {
    return {
      message:
        "Oui, la CPTS peut vous orienter selon votre besoin de santé sur le territoire. Je vous propose de commencer par la présentation, puis les ressources de prise en charge.",
      resourceIds: ["presentation", "medecin-traitant", "annuaire"],
      quickReplies: defaultQuickReplies,
    }
  }

  const asksProGuidance = hasAnyPhrase(normalizedInput, [
    "je suis professionnel",
    "je suis medecin",
    "je suis infirmier",
    "je suis pharmacien",
    "je suis soignant",
  ])

  if (asksProGuidance) {
    return {
      message:
        "Pour les professionnels, je peux vous orienter vers les outils, les formations, la commande de supports et l'adhésion.",
      resourceIds: ["pro-actions-outils", "pro-formations", "pro-supports"],
      quickReplies: defaultQuickReplies,
    }
  }

  const asksPatientGuidance = hasAnyPhrase(normalizedInput, [
    "je suis patient",
    "je suis usager",
    "je cherche un soin",
    "ou consulter",
  ])

  if (asksPatientGuidance) {
    return {
      message:
        "Je peux vous aider à trouver rapidement un parcours adapté. Commencez par l'annuaire ou la recherche de médecin traitant.",
      resourceIds: ["annuaire", "medecin-traitant", "coordonnees"],
      quickReplies: defaultQuickReplies,
    }
  }

  const isThanks =
    hasToken(normalizedInput, "merci") ||
    hasPhrase(normalizedInput, "je vous remercie") ||
    hasPhrase(normalizedInput, "merci beaucoup")

  if (isThanks) {
    return {
      message:
        "Avec plaisir. Si besoin, je peux encore vous orienter vers une page précise ou un contact CPTS.",
      quickReplies: defaultQuickReplies,
    }
  }

  const asksHelp =
    normalizedInput === "aide" ||
    normalizedInput === "besoin d aide" ||
    hasPhrase(normalizedInput, "je suis perdu") ||
    hasPhrase(normalizedInput, "je ne sais pas") ||
    hasPhrase(normalizedInput, "aidez moi") ||
    hasPhrase(normalizedInput, "je ne trouve pas")

  if (asksHelp) {
    return {
      message:
        "Je peux vous guider pas à pas. Donnez un thème simple (ex: médecin traitant, annuaire santé mentale, apnée du sommeil, octobre rose, adhésion pro).",
      quickReplies: defaultQuickReplies,
    }
  }

  const asksContact =
    hasToken(normalizedInput, "contact") ||
    hasToken(normalizedInput, "email") ||
    hasToken(normalizedInput, "mail") ||
    hasPhrase(normalizedInput, "comment vous contacter") ||
    hasPhrase(normalizedInput, "joindre la cpts") ||
    hasPhrase(normalizedInput, "adresse mail")

  if (asksContact) {
    return {
      message:
        "Je vous propose les coordonnées de contact. Pour un avis médical, contactez en priorité votre professionnel de santé référent.",
      resourceIds: ["contact-email", "coordonnees"],
      quickReplies: defaultQuickReplies,
    }
  }

  const isClosing = hasAnyPhrase(normalizedInput, ["au revoir", "a bientot", "bonne journee", "bonne soiree"])

  if (isClosing) {
    return {
      message: "Merci pour votre message. Je reste disponible si vous avez une autre question.",
      quickReplies: defaultQuickReplies,
    }
  }

  return undefined
}
