import assert from "node:assert/strict"
import test from "node:test"

import { chatbotConfig } from "./chatbot.config"
import { createInitialState, processQuickReply, processUserInput, restartConversation } from "./engine"
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

test("processUserInput affiche le fallback quand ni matcher ni Fuse ne trouvent rien", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "zzqxwv nombre sans aucun lien territorial", chatbotConfig)
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
  const situationMessage = getLastBotMessage(situationState.messages)
  const searchReply = chatbotConfig.nodes["medecin-traitant"].quickReplies?.find(
    (reply) => reply.id === "qr-medecin-traitant-chercher",
  )

  assert.equal(situationState.currentNodeId, "medecin-traitant")
  assert.equal(situationMessage?.text, "Quelle est votre situation ?")
  assert.ok(searchReply)

  const resourceState = processQuickReply(situationState, searchReply, chatbotConfig)
  const suggestionMessage = getLastBotMessageWithSuggestions(resourceState.messages)
  const followUpMessage = getLastBotMessage(resourceState.messages)

  assert.ok(suggestionMessage?.suggestions?.some((item) => item.resource.id === "medecin-traitant"))
  assert.equal(followUpMessage?.text, "Est-ce que cela répond à votre question ?")
})
