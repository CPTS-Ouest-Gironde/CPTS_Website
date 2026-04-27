import assert from "node:assert/strict"
import test from "node:test"

import { chatbotConfig } from "./chatbot.config"
import { createInitialState, processQuickReply, processUserInput, restartConversation } from "./engine"
import type { ChatbotConfig } from "./types"

function getLastBotMessage(stateMessages: ReturnType<typeof createInitialState>["messages"]) {
  const reversed = [...stateMessages].reverse()
  return reversed.find((message) => message.role === "bot")
}

function getLastBotMessageWithSuggestions(stateMessages: ReturnType<typeof createInitialState>["messages"]) {
  const reversed = [...stateMessages].reverse()
  return reversed.find((message) => message.role === "bot" && (message.suggestions?.length ?? 0) > 0)
}

test("processUserInput répond à une salutation avec un message conversationnel", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "bonjour", chatbotConfig)

  const lastBotMessage = getLastBotMessage(nextState.messages)
  const privacyNotice = nextState.messages.find((message) => message.text.includes("pas enregistré sur nos serveurs"))

  assert.ok(privacyNotice)
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

test("processUserInput fallback propose un contact quand aucun match", () => {
  const initialState = createInitialState(chatbotConfig)
  const nextState = processUserInput(initialState, "texte totalement inconnu xyz", chatbotConfig)

  const botMessages = nextState.messages.filter((message) => message.role === "bot")
  const hasContactSuggestion = botMessages.some((message) =>
    message.suggestions?.some((item) => item.resource.id === "contact-email"),
  )

  assert.ok(hasContactSuggestion)
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
