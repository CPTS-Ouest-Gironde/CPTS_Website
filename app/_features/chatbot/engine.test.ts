import assert from "node:assert/strict"
import test from "node:test"

import { chatbotConfig } from "./chatbot.config"
import { createInitialState, hydrateState, processQuickReply, processUserInput, restartConversation } from "./engine"
import { searchResourcesFuzzy } from "./fuzzySearch"
import { cleanExtract } from "./articlesSearch"
import type { ChatbotConfig } from "./types"
import { trackEvent } from "./useChatbotAnalytics"

function getLastBotMessage(stateMessages: ReturnType<typeof createInitialState>["messages"]) {
  const reversed = [...stateMessages].reverse()
  return reversed.find((message) => message.role === "bot")
}

function getLastBotMessageWithSuggestions(stateMessages: ReturnType<typeof createInitialState>["messages"]) {
  const reversed = [...stateMessages].reverse()
  return reversed.find((message) => message.role === "bot" && (message.suggestions?.length ?? 0) > 0)
}

test("createInitialState avec context error-page démarre sur le node start-error", () => {
  const defaultState = createInitialState(chatbotConfig)
  const errorState = createInitialState(chatbotConfig, { context: "error-page" })

  assert.equal(defaultState.currentNodeId, "start")
  assert.equal(errorState.currentNodeId, "start-error")

  const firstErrorMessage = errorState.messages[0]
  assert.ok(firstErrorMessage)
  assert.equal(firstErrorMessage.role, "bot")
  assert.match(firstErrorMessage.text, /Vous semblez vous être perdu/)
  const errorQuickReplyIds = firstErrorMessage.quickReplies?.map((reply) => reply.id) ?? []
  assert.deepEqual(errorQuickReplyIds, [
    "qr-medecin-traitant",
    "qr-annuaire",
    "qr-page-accueil",
    "qr-contact-cpts",
  ])
})

test("processUserInput répond à une salutation avec un message conversationnel sans notice vie privée", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "bonjour", chatbotConfig)

  const lastBotMessage = getLastBotMessage(nextState.messages)
  const privacyNotice = nextState.messages.find((message) => message.text.includes("pas enregistré sur nos serveurs"))

  assert.equal(privacyNotice, undefined)
  assert.ok(lastBotMessage)
  assert.match(lastBotMessage.text, /assistant d'orientation CPTS/i)
})

test("processUserInput répond poliment aux remerciements", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "merci beaucoup", chatbotConfig)

  const lastBotMessage = getLastBotMessage(nextState.messages)

  assert.ok(lastBotMessage)
  assert.match(lastBotMessage.text, /avec plaisir/i)
})

test("processUserInput propose des ressources de contact sur demande", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "comment vous contacter", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const lastBotMessage = getLastBotMessage(nextState.messages)

  assert.ok(suggestionMessage)
  assert.ok(suggestionMessage.suggestions?.some((item) => item.resource.id === "contact-email"))
  assert.equal(lastBotMessage?.text, "Est-ce que cela répond à votre question ?")
})

test("processUserInput explique la CPTS et propose la page présentation", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "c'est quoi la cpts ?", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage)
  assert.match(suggestionMessage.text, /communaut. professionnelle territoriale de sant./i)
  assert.ok(suggestionMessage.suggestions?.some((item) => item.resource.id === "presentation"))
  assert.ok(!suggestionMessage.suggestions?.some((item) => item.resource.id === "pro-adhesion"))
})

test("processUserInput matche les synonymes docteur et psy", () => {
  const initialState = createInitialState(chatbotConfig)
  const doctorState = processUserInput(initialState, "docteur", chatbotConfig)
  const psyState = processUserInput(initialState, "psy", chatbotConfig)

  const doctorSuggestions = getLastBotMessageWithSuggestions(doctorState.messages)
  const psySuggestions = getLastBotMessageWithSuggestions(psyState.messages)

  assert.ok(doctorSuggestions?.suggestions?.some((item) => item.resource.id === "medecin-traitant"))
  assert.ok(psySuggestions?.suggestions?.some((item) => item.resource.id === "sante-mentale-annuaire"))
})

test("processUserInput ignore la salutation quand une demande suit", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Bonjour je cherche un médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const lastBotMessage = getLastBotMessage(nextState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "medecin-traitant"))
  assert.notEqual(lastBotMessage?.text, "Bonjour. Je suis l'assistant d'orientation CPTS. Donnez votre besoin en une phrase et je vous proposerai la bonne ressource.")
})

test("processUserInput medecin retraite suggere le parcours et les démarches sans annuaire santé mentale", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Mon médecin part à la retraite, comment en trouver un autre", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestionIds.includes("medecin-traitant"))
  assert.ok(suggestionIds.includes("patients-medecin-traitant"))
  assert.ok(!suggestionIds.includes("sante-mentale-annuaire"))
})

test("processUserInput declaration medecin traitant priorise la page démarches patient", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(
    initialState,
    "Comment déclarer mon médecin traitant à l'Assurance Maladie",
    chatbotConfig,
  )

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "patients-medecin-traitant")
})

test("processUserInput cherche medecin priorise la page démarches patient", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Je cherche un médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "patients-medecin-traitant")
  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "medecin-traitant"))
})

test("processUserInput annuaire sante mentale garde la ressource spécialisée", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Annuaire santé mentale", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "sante-mentale-annuaire")
})

test("processUserInput annuaire seul ne priorise pas l'annuaire santé mentale", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Annuaire", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "annuaire")
  assert.notEqual(suggestionMessage?.suggestions?.[0]?.resource.id, "sante-mentale-annuaire")
})

test("processUserInput aide Mon Espace Santé matche le tutoriel ou la page principale", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Comment utiliser mon espace santé", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestionIds.includes("patients-tuto-espace-sante") || suggestionIds.includes("mon-espace-sante"))
})

test("processUserInput Mon Espace Santé matche la page principale", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Mon espace santé", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "mon-espace-sante")
})

test("processUserInput dispositifs du territoire matche la ressource professionnelle quand audienceContext est pro", () => {
  // Strict patient default: a pro must declare via documents-role-check (or any quick reply
  // that sets audienceContext = "pro") before free-text input can surface pro-only resources.
  const initialState = { ...createInitialState(chatbotConfig), audienceContext: "pro" as const }
  const nextState = processUserInput(initialState, "Dispositifs du territoire", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "pro-dispositifs-territoire")
})

test("processUserInput matche une douleur à la tête en phrase naturelle", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "j'ai mal à la tête", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "symptomes-douleur"))
})

test("processUserInput matche une migraine en symptomes-douleur", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "J'ai une grosse migraine depuis 2 jours", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "symptomes-douleur"))
})

test("processUserInput matche une douleur thoracique avec contexte temporel", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "J'ai des douleur thoracique depuis ce matin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "urgence-15")
})

test("processUserInput mention police non urgente ne propose pas urgence-17", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "J'ai vu la police hier soir", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestionIds.includes("urgence-17"))
})

test("processUserInput matche les violences conjugales formulées naturellement", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je suis battue par mon mari", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("sm-face-aux-violences"))
  assert.ok(suggestedIds.includes("urgence-3919"))
})

test("processUserInput violence conjugale garde uniquement les ressources violence", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Mon mari me frappe", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestions = suggestionMessage?.suggestions ?? []

  assert.ok(suggestions.length > 0)
  assert.ok(suggestions.every((item) => item.resource.sensitivityCategory === "violence"))
  assert.ok(!suggestions.some((item) => item.resource.id === "sf-vaccination-grippe-2025"))
  assert.ok(!suggestions.some((item) => item.resource.id === "prevention-familiale"))
})

test("processUserInput matche la déprime avec contexte temporel", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je déprime depuis 3 mois", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "sante-mentale"))
})

test("processUserInput matche une demande de vaccination grippe naturelle", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je veux me faire vacciner contre la grippe", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "sf-vaccination-grippe-2025"))
})

test("processUserInput vaccination grippe exclut les symptômes en suggestion secondaire", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Je veux me faire vacciner contre la grippe", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.equal(suggestionIds[0], "sf-vaccination-grippe-2025")
  assert.ok(!suggestionIds.includes("symptomes-douleur"))
})

test("processUserInput distingue vaccin grippe et grippe symptome", () => {
  const initialState = createInitialState(chatbotConfig)
  const vaccineState = processUserInput(initialState, "Je veux me faire vacciner contre la grippe", chatbotConfig)
  const symptomState = processUserInput(initialState, "J'ai la grippe", chatbotConfig)

  const vaccineSuggestion = getLastBotMessageWithSuggestions(vaccineState.messages)
  const symptomSuggestion = getLastBotMessageWithSuggestions(symptomState.messages)

  assert.equal(vaccineSuggestion?.suggestions?.[0]?.resource.id, "sf-vaccination-grippe-2025")
  assert.equal(symptomSuggestion?.suggestions?.[0]?.resource.id, "symptomes-douleur")
})

test("processQuickReply Non autre chose ne retourne pas au message accueil", () => {
  const initialState = createInitialState(chatbotConfig)
  const suggestedState = processUserInput(initialState, "je cherche un médecin", chatbotConfig)
  const noReply = [...suggestedState.messages]
    .reverse()
    .find((message) => message.quickReplies?.some((reply) => reply.id === "qr-resource-follow-up-no"))
    ?.quickReplies?.find((reply) => reply.id === "qr-resource-follow-up-no")

  assert.ok(noReply)

  const nextState = processQuickReply(suggestedState, noReply, chatbotConfig)
  const lastBotMessage = getLastBotMessage(nextState.messages)

  assert.notEqual(lastBotMessage?.text, chatbotConfig.nodes.start.message)
  assert.ok(
    nextState.currentNodeId === "fallback" ||
      nextState.messages.some((message) => message.text === "Voici une autre piste possible :"),
  )
})

test("processQuickReply Non autre chose après médecin ne propose aucune ressource pro", () => {
  const initialState = createInitialState(chatbotConfig)
  const suggestedState = processUserInput(initialState, "Je cherche un médecin", chatbotConfig)
  const noReply = [...suggestedState.messages]
    .reverse()
    .find((message) => message.quickReplies?.some((reply) => reply.id === "qr-resource-follow-up-no"))
    ?.quickReplies?.find((reply) => reply.id === "qr-resource-follow-up-no")

  assert.ok(noReply)

  const nextState = processQuickReply(suggestedState, noReply, chatbotConfig)
  const suggestions = getLastBotMessageWithSuggestions(nextState.messages)?.suggestions ?? []

  assert.ok(suggestions.every((item) => item.resource.audience !== "pro"))
})

test("searchResourcesFuzzy ne retourne jamais de ressource sensible", () => {
  const fuzzyResults = searchResourcesFuzzy("police secours danger suicide samu urgence violence", chatbotConfig)

  assert.ok(fuzzyResults.every((resource) => !resource.isSensitive))
})

test("processUserInput répond aux formulations familières de type chatbot", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "comment tu peux m'aider", chatbotConfig)

  const lastBotMessage = getLastBotMessage(nextState.messages)

  assert.ok(lastBotMessage)
  assert.match(lastBotMessage.text, /je peux vous orienter/i)
})

test("processUserInput fallback affiche les relances guidées quand aucun match", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "texte totalement inconnu xyz", chatbotConfig)

  const lastBotMessage = getLastBotMessage(nextState.messages)
  const fallbackQuickReplyIds = lastBotMessage?.quickReplies?.map((reply) => reply.id) ?? []

  assert.equal(nextState.currentNodeId, "fallback")
  assert.deepEqual(fallbackQuickReplyIds, [
    "qr-fallback-pro",
    "qr-fallback-sante-mentale",
    "qr-fallback-prevention",
    "qr-fallback-document",
    "qr-fallback-urgence",
    "qr-fallback-contact",
    "qr-retour-accueil",
  ])
  assert.equal(lastBotMessage?.suggestions, undefined)
  const config: ChatbotConfig = {
    ...chatbotConfig,
    nodes: {
      ...chatbotConfig.nodes,
      restart: {
        id: "restart",
        message: "Redémarrage dédié",
      },
    },
    rules: {
      ...chatbotConfig.rules,
      restartNodeId: "restart",
    },
  }

  const restartState = restartConversation(config)

  assert.equal(restartState.currentNodeId, "restart")
  assert.equal(restartState.messages[0]?.text, "Redémarrage dédié")
})

test("processQuickReply qr-fallback-document mène à documents-role-check", () => {
  const initialState = createInitialState(chatbotConfig)
  const fallbackState = processUserInput(initialState, "texte totalement inconnu xyz", chatbotConfig)
  const documentReply = chatbotConfig.nodes.fallback.quickReplies?.find((reply) => reply.id === "qr-fallback-document")

  assert.ok(documentReply)

  const documentsState = processQuickReply(fallbackState, documentReply, chatbotConfig)
  const lastBotMessage = getLastBotMessage(documentsState.messages)

  assert.equal(documentsState.currentNodeId, "documents-role-check")
  assert.match(lastBotMessage?.text ?? "", /professionnel de santé/i)
})

test("processQuickReply branche patient mène à documents-patient sans ressource pro", () => {
  const initialState = createInitialState(chatbotConfig)
  const fallbackState = processUserInput(initialState, "texte totalement inconnu xyz", chatbotConfig)
  const documentReply = chatbotConfig.nodes.fallback.quickReplies?.find((reply) => reply.id === "qr-fallback-document")

  assert.ok(documentReply)

  const roleCheckState = processQuickReply(fallbackState, documentReply, chatbotConfig)
  const patientReply = chatbotConfig.nodes["documents-role-check"].quickReplies?.find(
    (reply) => reply.id === "qr-docs-pro-non",
  )

  assert.ok(patientReply)

  const patientState = processQuickReply(roleCheckState, patientReply, chatbotConfig)
  const lastBotMessage = getLastBotMessage(patientState.messages)
  const suggestedResourceIds =
    lastBotMessage?.quickReplies?.flatMap((reply) => reply.actionResourceIds ?? []) ?? []
  const proResourceIds = Object.values(chatbotConfig.resources)
    .filter((resource) => resource.type !== "email" && resource.type !== "phone" && resource.href.startsWith("/professionnels"))
    .map((resource) => resource.id)

  assert.equal(patientState.currentNodeId, "documents-patient")
  assert.ok(suggestedResourceIds.length > 0)
  assert.ok(suggestedResourceIds.every((resourceId) => !proResourceIds.includes(resourceId)))
})

test("processUserInput mammographie matche sf-octobre-rose-2025", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "mammographie", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage)
  assert.ok(suggestionMessage.suggestions?.some((item) => item.resource.id === "sf-octobre-rose-2025"))
})

test("processUserInput oriente la douleur ovarienne sans matcher urgence-17", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "qui appeler si j'ai mal au ovaire", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("symptomes-douleur"))
  assert.ok(!suggestedIds.includes("urgence-17"))
})

test("processUserInput filtre les ressources récemment proposées", () => {
  const initialState = createInitialState(chatbotConfig)
  const firstState = processUserInput(initialState, "mammographie", chatbotConfig)
  const secondState = processUserInput(firstState, "mammographie", chatbotConfig)
  const lastBotMessage = getLastBotMessage(secondState.messages)

  assert.ok(firstState.recentlySuggested.includes("sf-octobre-rose-2025"))
  assert.equal(secondState.currentNodeId, "fallback")
  assert.match(lastBotMessage?.text ?? "", /pas bien compris/i)
})

test("processUserInput douleur thoracique priorise urgence-15", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "douleur thoracique", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "urgence-15")
})

test("restartConversation reset recentlySuggested", () => {
  const initialState = createInitialState(chatbotConfig)
  const suggestedState = processUserInput(initialState, "mammographie", chatbotConfig)
  const restartState = restartConversation(chatbotConfig)

  assert.ok(suggestedState.recentlySuggested.length > 0)
  assert.deepEqual(restartState.recentlySuggested, [])
})

test("processUserInput utilise Fuse quand le matcher principal ne trouve rien", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "psicotherapye", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage)
  assert.match(suggestionMessage.text, /peut-être cherchez-vous/i)
  assert.ok(suggestionMessage.suggestions?.some((item) => item.resource.id === "sm-pro-approches"))
})

test("processUserInput enrichit une question sur l'endometriose avec un extrait d'article", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "endométriose c'est quoi", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(extractMessage)
  assert.match(extractMessage.text, /endom.triose/i)
  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "sf-endometriose"))
})

test("processUserInput enrichit une question sur Mars Bleu avec un extrait d'article", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "qu'est-ce que mars bleu", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(extractMessage)
  assert.match(extractMessage.text, /cancer colorectal/i)
  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "sf-mars-bleu-2026"))
})

test("processUserInput retourne un extrait pertinent sur le dépistage colorectal", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "comment ça se dépiste le cancer colorectal", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(extractMessage)
  assert.match(extractMessage.text, /d.pist/i)
  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "sf-mars-bleu-2026"))
})

test("processUserInput marqueur exploratoire \"qu'est-ce que mars bleu\" priorise sf-mars-bleu-2026 avec extrait", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "qu'est-ce que mars bleu", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(extractMessage, "extrait Mars Bleu attendu pour une question exploratoire")
  assert.ok(suggestionIds.includes("sf-mars-bleu-2026"))
})

test("processUserInput marqueur exploratoire \"comment se passe le dépistage colorectal\" cible Mars Bleu pas Octobre Rose", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "comment se passe le dépistage colorectal", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(extractMessage, "extrait Mars Bleu attendu sur dépistage colorectal")
  assert.ok(suggestionIds.includes("sf-mars-bleu-2026"), "sf-mars-bleu-2026 attendu en suggestion")
  assert.ok(!suggestionIds.includes("sf-octobre-rose-2025"), "sf-octobre-rose-2025 (cancer du sein) ne doit pas remonter sur dépistage colorectal")
})

test("processUserInput marqueur exploratoire \"j'ai des questions sur l'endométriose\" cible l'article endométriose pas Questions Psy", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "j'ai des questions sur l'endométriose", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestionIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(extractMessage, "extrait endométriose attendu")
  assert.match(extractMessage.text, /endom.triose/i)
  assert.ok(suggestionIds.includes("sf-endometriose"))
  assert.ok(!suggestionIds.includes("ao-questions-psy"), "ao-questions-psy ne doit pas remonter")
})

test("processUserInput non-régression: \"Je cherche un médecin\" priorise toujours patients-medecin-traitant", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "Je cherche un médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "patients-medecin-traitant")
  assert.equal(extractMessage, undefined, "pas d'extrait d'article attendu : matcher classique doit gagner sur cette requête")
})

test("processUserInput \"comment se passe le dépistage colorectal\" affiche un extrait + le CTA", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "comment se passe le dépistage colorectal", chatbotConfig)

  const extractMessage = nextState.messages.find((message) => message.text.includes("Voici ce que j'ai trouvé"))
  const ctaMessage = nextState.messages.find((message) =>
    message.text.includes("Vous pouvez retrouver plus d'informations dans cet article"),
  )

  assert.ok(extractMessage, "le message bot 'Voici ce que j'ai trouvé : …' doit exister")
  assert.match(extractMessage.text, /d.pist|colorectal/i)
  assert.ok(ctaMessage, "le CTA 'Vous pouvez retrouver…' doit suivre l'extrait")
})

test("processUserInput \"qu'est-ce que mars bleu\" affiche au maximum une ressource (sf-mars-bleu-2026)", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "qu'est-ce que mars bleu", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestions = suggestionMessage?.suggestions ?? []

  assert.equal(suggestions.length, 1, "une seule ressource doit accompagner l'extrait")
  assert.equal(suggestions[0]?.resource.id, "sf-mars-bleu-2026")
})

test("cleanExtract supprime les balises ** orphelines après troncature", () => {
  assert.equal(
    cleanExtract("**ovaires**, le **muscle de"),
    "ovaires, le muscle de",
  )
})

test("processUserInput affiche le fallback quand ni matcher ni Fuse ne trouvent rien", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "zzqxwv blorf snargle", chatbotConfig)
  const lastBotMessage = getLastBotMessage(nextState.messages)

  assert.equal(nextState.currentNodeId, "fallback")
  assert.match(lastBotMessage?.text ?? "", /pas bien compris/i)
})

test("trackEvent respecte le consentement analytics", () => {
  const calls: unknown[][] = []
  const localStorageMock = {
    value: "refused",
    getItem(key: string) {
      return key === "cookie-consent" ? this.value : null
    },
  }
  const previousWindow = globalThis.window

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: localStorageMock,
      gtag: (...args: unknown[]) => {
        calls.push(args)
      },
    },
  })

  try {
    trackEvent("chatbot_restart", {})
    assert.equal(calls.length, 0)

    localStorageMock.value = "accepted"
    trackEvent("chatbot_restart", {})

    assert.deepEqual(calls, [["event", "chatbot_restart", {}]])
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    })
  }
})

test("processQuickReply 'Vaccinations' depuis le node prevention mène à prevention-vaccinations", () => {
  const initialState = createInitialState(chatbotConfig)
  const preventionReply = chatbotConfig.nodes.start.quickReplies?.find((reply) => reply.id === "qr-prevention")

  assert.ok(preventionReply)

  const preventionState = processQuickReply(initialState, preventionReply, chatbotConfig)
  assert.equal(preventionState.currentNodeId, "prevention")

  const vaccinationsReply = chatbotConfig.nodes.prevention.quickReplies?.find(
    (reply) => reply.id === "qr-prevention-vaccinations",
  )

  assert.ok(vaccinationsReply)

  const vaccinationsState = processQuickReply(preventionState, vaccinationsReply, chatbotConfig)
  const lastBotMessage = getLastBotMessage(vaccinationsState.messages)

  assert.equal(vaccinationsState.currentNodeId, "prevention-vaccinations")
  assert.match(lastBotMessage?.text ?? "", /campagnes de vaccination/i)

  const grippeReply = chatbotConfig.nodes["prevention-vaccinations"].quickReplies?.find(
    (reply) => reply.id === "qr-prevention-vac-grippe",
  )

  assert.ok(grippeReply)
  assert.deepEqual(grippeReply.actionResourceIds, ["sf-vaccination-grippe-2025"])
})

test("processUserInput 'violence' propose sm-face-aux-violences et le 3919", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "violence", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.ok(suggestionMessage)
  const suggestedIds = suggestionMessage.suggestions?.map((item) => item.resource.id) ?? []
  assert.ok(suggestedIds.includes("sm-face-aux-violences"))
  assert.ok(suggestedIds.includes("urgence-3919"))
})

test("processQuickReply ouvre le sous-flow médecin traitant puis ajoute le suivi après ressource", () => {
  const initialState = createInitialState(chatbotConfig)
  const rootReply = chatbotConfig.nodes.start.quickReplies?.find((reply) => reply.id === "qr-medecin-traitant")

  assert.ok(rootReply)

  const situationState = processQuickReply(initialState, rootReply, chatbotConfig)
  const situationMessage = situationState.messages.find((message) => message.text === "Quelle est votre situation ?")
  const situationSuggestions = getLastBotMessageWithSuggestions(situationState.messages)
  const searchReply = chatbotConfig.nodes["medecin-traitant"].quickReplies?.find(
    (reply) => reply.id === "qr-medecin-traitant-chercher",
  )

  assert.equal(situationState.currentNodeId, "medecin-traitant")
  assert.equal(situationMessage?.text, "Quelle est votre situation ?")
  assert.ok(situationSuggestions?.suggestions?.some((item) => item.resource.id === "patients-medecin-traitant"))
  assert.ok(searchReply)

  const resourceState = processQuickReply(situationState, searchReply, chatbotConfig)
  const suggestionMessage = getLastBotMessageWithSuggestions(resourceState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "medecin-traitant"))
  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "patients-medecin-traitant"))
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION 1 — Détresse suicidaire : verrouille la sortie urgence-3114
// ─────────────────────────────────────────────────────────────────────────────

test("ACTION 1 — processUserInput 'je veux mourir' propose urgence-3114", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je veux mourir", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-3114"), "urgence-3114 attendu sur 'je veux mourir'")
})

test("ACTION 1 — processUserInput 'pensées suicidaires' propose urgence-3114", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "j'ai des pensées suicidaires depuis plusieurs jours", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-3114"), "urgence-3114 attendu sur 'pensées suicidaires'")
})

test("ACTION 1 — processUserInput 'je veux en finir' propose urgence-3114", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je veux en finir", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-3114"), "urgence-3114 attendu sur 'je veux en finir'")
})

test("ACTION 1 — processUserInput 'je ne veux plus vivre' propose urgence-3114", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je ne veux plus vivre", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-3114"), "urgence-3114 attendu sur 'je ne veux plus vivre'")
})

test("ACTION 1 — processUserInput 'je vais me suicider' propose urgence-3114", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je vais me suicider", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-3114"), "urgence-3114 attendu sur 'je vais me suicider'")
})

test("ACTION 1 — processUserInput 'mettre fin à mes jours' propose urgence-3114", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je veux mettre fin à mes jours", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-3114"), "urgence-3114 attendu sur 'mettre fin à mes jours'")
})

test("ACTION 1 — processUserInput 'suicide' seul propose urgence-3114 (régression sur boost 20)", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je pense au suicide", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(
    suggestedIds.includes("urgence-3114"),
    "urgence-3114 attendu sur 'je pense au suicide' avec le nouveau boost à 20",
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION 2 — Faux positifs viol / abus : verrouille l'absence de match
// ─────────────────────────────────────────────────────────────────────────────

test("ACTION 2 — processUserInput 'j'aime le violet' ne propose PAS sm-face-aux-violences", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "j'aime le violet", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestedIds.includes("sm-face-aux-violences"), "faux positif 'violet' éliminé")
})

test("ACTION 2 — processUserInput 'abuser de l'alcool' ne propose PAS sm-face-aux-violences", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "ne pas abuser de l'alcool", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestedIds.includes("sm-face-aux-violences"), "faux positif 'abuser' éliminé")
})

test("ACTION 2 — processUserInput 'j'ai été violée' propose sm-face-aux-violences (couverture maintenue)", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "j'ai été violée hier soir", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("sm-face-aux-violences"), "sm-face-aux-violences attendu sur 'violée'")
})

test("ACTION 2 — processUserInput 'agression sexuelle' propose sm-face-aux-violences", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "agression sexuelle", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("sm-face-aux-violences"))
})

test("ACTION 2 — processUserInput 'viol' seul propose sm-face-aux-violences via exact match (boost 10)", () => {
  // Avec boost 10, CONTAINS = 95 (filtré sur substring "violet") mais EXACT = 130 → la
  // ressource sensible reste accessible si l'utilisateur tape simplement "viol".
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "viol", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("sm-face-aux-violences"), "exact-match 'viol' doit toujours fonctionner")
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION 3 — audienceContext strict : patient anonyme jamais exposé aux pros
// ─────────────────────────────────────────────────────────────────────────────

test("ACTION 3 — audienceContext null + 'questionnaire médecin' ne propose PAS ao-questionnaire-medecin", () => {
  const initialState = createInitialState(chatbotConfig)
  assert.equal(initialState.audienceContext, null, "état initial = null")

  const nextState = processUserInput(initialState, "questionnaire médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestedIds.includes("ao-questionnaire-medecin"), "ressource pro filtrée en mode anonyme")
})

test("ACTION 3 — audienceContext null + 'formulaire MAS' ne propose PAS ao-formulaire-mas", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "formulaire MAS", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestedIds.includes("ao-formulaire-mas"), "ressource pro filtrée en mode anonyme")
})

test("ACTION 3 — audienceContext null + 'supports cpts' ne propose PAS pro-supports", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "supports cpts", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestedIds.includes("pro-supports"), "ressource pro filtrée en mode anonyme")
})

test("ACTION 3 — audienceContext 'pro' + 'questionnaire médecin' propose ao-questionnaire-medecin", () => {
  const initialState = { ...createInitialState(chatbotConfig), audienceContext: "pro" as const }
  const nextState = processUserInput(initialState, "questionnaire médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("ao-questionnaire-medecin"), "ressource pro visible pour un pro déclaré")
})

test("ACTION 3 — audienceContext null + 'actions outils' ne propose PAS pro-actions-outils", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "actions outils", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(!suggestedIds.includes("pro-actions-outils"))
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION 4 — Urgence vitale : étouffement / respiration / conscience
// ─────────────────────────────────────────────────────────────────────────────

test("ACTION 4 — processUserInput 'j'étouffe je vais mourir' propose urgence-15", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "j'étouffe je vais mourir", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-15"), "urgence-15 attendu sur étouffement aigu")
})

test("ACTION 4 — processUserInput 'je n'arrive plus à respirer' propose urgence-15", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je n'arrive plus à respirer", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-15"))
})

test("ACTION 4 — processUserInput 'je perds connaissance' propose urgence-15", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "je perds connaissance", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("urgence-15"))
})

test("ACTION 4 — distinction 'je veux mourir' (3114) vs 'je vais mourir' (urgence-15)", () => {
  const initialState = createInitialState(chatbotConfig)
  const wantsToDie = processUserInput(initialState, "je veux mourir", chatbotConfig)
  const isGoingToDie = processUserInput(initialState, "j'étouffe je vais mourir", chatbotConfig)

  const wantsIds = getLastBotMessageWithSuggestions(wantsToDie.messages)?.suggestions?.map((s) => s.resource.id) ?? []
  const isGoingIds = getLastBotMessageWithSuggestions(isGoingToDie.messages)?.suggestions?.map((s) => s.resource.id) ?? []

  assert.ok(wantsIds.includes("urgence-3114"), "'je veux mourir' → 3114 (idéation)")
  assert.ok(isGoingIds.includes("urgence-15"), "'je vais mourir' avec étouffement → 15 (urgence physique)")
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION 5 — Ameli / formulaire / déclaration médecin traitant
// ─────────────────────────────────────────────────────────────────────────────

test("ACTION 5 — processUserInput 'formulaire ameli médecin' priorise patients-medecin-traitant", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "formulaire ameli médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "patients-medecin-traitant")
})

test("ACTION 5 — processUserInput 'comment déclarer mon médecin' priorise patients-medecin-traitant", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "comment déclarer mon médecin", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)

  assert.equal(suggestionMessage?.suggestions?.[0]?.resource.id, "patients-medecin-traitant")
})

test("ACTION 5 — processUserInput 'démarche ameli' propose patients-medecin-traitant", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "démarche ameli", chatbotConfig)

  const suggestionMessage = getLastBotMessageWithSuggestions(nextState.messages)
  const suggestedIds = suggestionMessage?.suggestions?.map((item) => item.resource.id) ?? []

  assert.ok(suggestedIds.includes("patients-medecin-traitant"))
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION 6 — Tests de couverture supplémentaires (gap audit)
// ─────────────────────────────────────────────────────────────────────────────

test("ACTION 6 — restartConversation reset audienceContext à null", () => {
  const customState = {
    ...createInitialState(chatbotConfig),
    audienceContext: "pro" as const,
    lastUserInput: "un input précédent",
  }
  assert.equal(customState.audienceContext, "pro")
  assert.equal(customState.lastUserInput, "un input précédent")

  const restartedState = restartConversation(chatbotConfig)

  assert.equal(restartedState.audienceContext, null, "audienceContext doit être null après restart")
  assert.equal(restartedState.lastUserInput, undefined, "lastUserInput doit être undefined après restart")
})

test("ACTION 6 — processUserInput input vide retourne l'état inchangé", () => {
  const initialState = createInitialState(chatbotConfig)
  const emptyState = processUserInput(initialState, "", chatbotConfig)
  const whitespaceState = processUserInput(initialState, "   \n  \t  ", chatbotConfig)

  assert.equal(emptyState, initialState, "input vide → état inchangé (référentiel)")
  assert.equal(whitespaceState, initialState, "whitespace seul → état inchangé")
})

test("ACTION 6 — processUserInput input long (≥ 200 chars) reste traité sans crash", () => {
  const initialState = createInitialState(chatbotConfig)
  const longInput = "je cherche un médecin traitant ".repeat(10).trim() // ~310 chars before trim
  const nextState = processUserInput(initialState, longInput, chatbotConfig)

  // Pas de crash, et un message bot a été ajouté.
  assert.ok(nextState.messages.length > initialState.messages.length)
})

test("ACTION 6 — hydrateState fallback createInitialState si sessionStorage JSON invalide", () => {
  const previousWindow = globalThis.window
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      sessionStorage: {
        getItem: () => "this is not valid JSON {{{",
        setItem: () => undefined,
      },
    },
  })

  try {
    const state = hydrateState(chatbotConfig)
    assert.equal(state.currentNodeId, chatbotConfig.rules.startNodeId)
    assert.deepEqual(state.recentlySuggested, [])
    assert.equal(state.audienceContext, null)
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    })
  }
})

test("ACTION 6 — hydrateState fallback si version persistée obsolète", () => {
  const previousWindow = globalThis.window
  const obsoleteState = {
    version: 1,
    state: {
      currentNodeId: "start",
      messages: [],
      recentlySuggested: ["sf-octobre-rose-2025"],
      audienceContext: "patient",
    },
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      sessionStorage: {
        getItem: () => JSON.stringify(obsoleteState),
        setItem: () => undefined,
      },
    },
  })

  try {
    const state = hydrateState(chatbotConfig)
    assert.equal(state.currentNodeId, chatbotConfig.rules.startNodeId)
    assert.deepEqual(state.recentlySuggested, [], "version obsolète doit reset recentlySuggested")
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    })
  }
})
