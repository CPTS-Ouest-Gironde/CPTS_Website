import assert from "node:assert/strict"
import test from "node:test"

import { matchResources } from "./matcher"
import type { ChatResource, KeywordIndexEntry } from "./types"

const resources: Record<string, ChatResource> = {
  "medecin-traitant": {
    id: "medecin-traitant",
    type: "internal",
    title: "Médecin traitant",
    href: "/patients/medecin-traitant",
  },
  annuaire: {
    id: "annuaire",
    type: "internal",
    title: "Annuaire",
    href: "/patients/annuaire",
  },
  coordonnees: {
    id: "coordonnees",
    type: "internal",
    title: "Coordonnées",
    href: "/patients/coordonnees",
  },
  faq: {
    id: "faq",
    type: "internal",
    title: "FAQ",
    href: "/faq",
  },
  "pro-formations": {
    id: "pro-formations",
    type: "internal",
    title: "Formations",
    href: "/professionnels/formations",
  },
  "sf-mars-bleu-2026": {
    id: "sf-mars-bleu-2026",
    type: "internal",
    title: "Mars bleu",
    href: "/prevention/sante-familiale/prevention-cancer-colorectal-mars-bleu-2026",
  },
  "etp-apnee-sommeil": {
    id: "etp-apnee-sommeil",
    type: "internal",
    title: "Apnée du sommeil",
    href: "/prevention/education-therapeutique/syndrome-apnee-sommeil",
  },
  "sante-mentale-annuaire": {
    id: "sante-mentale-annuaire",
    type: "internal",
    title: "Annuaire santé mentale",
    href: "/sante-mental?open=annuaire",
  },
  "pro-adhesion": {
    id: "pro-adhesion",
    type: "internal",
    title: "Adhérer à la CPTS",
    href: "/professionnels/adhesion",
  },
  "ms-prevention-sexuelle": {
    id: "ms-prevention-sexuelle",
    type: "internal",
    title: "Prévention santé sexuelle",
    href: "/prevention/memos-suivi?openMemo=prevention-sexuelle",
  },
  "ms-bon-usage-systeme-sante": {
    id: "ms-bon-usage-systeme-sante",
    type: "internal",
    title: "Bon usage du système de santé",
    href: "/prevention/memos-suivi?openMemo=bon-usage",
  },
}

const keywordIndex: KeywordIndexEntry[] = [
  { keyword: "medecin traitant", resourceId: "medecin-traitant", scoreBoost: 10 },
  { keyword: "annuaire", resourceId: "annuaire", scoreBoost: 4 },
  { keyword: "urgence", resourceId: "coordonnees" },
  { keyword: "faq", resourceId: "faq" },
  { keyword: "formation", resourceId: "pro-formations", scoreBoost: 8 },
  { keyword: "mars bleu", resourceId: "sf-mars-bleu-2026", scoreBoost: 12 },
  { keyword: "apnee du sommeil", resourceId: "etp-apnee-sommeil", scoreBoost: 14 },
  { keyword: "annuaire sante mentale", resourceId: "sante-mentale-annuaire", scoreBoost: 14 },
  { keyword: "adherer", resourceId: "pro-adhesion", scoreBoost: 12 },
  { keyword: "prevention sexuelle", resourceId: "ms-prevention-sexuelle", scoreBoost: 14 },
  { keyword: "systeme de sante", resourceId: "ms-bon-usage-systeme-sante", scoreBoost: 14 },
]

function runMatch(input: string) {
  return matchResources({
    input,
    keywordIndex,
    resources,
    minScore: 45,
    maxSuggestions: 3,
    fuzzyDistanceThreshold: 1,
  })
}

test("matchResources priorise le match exact", () => {
  const matches = runMatch("médecin traitant")

  assert.equal(matches[0]?.resource.id, "medecin-traitant")
  assert.ok((matches[0]?.score ?? 0) > 100)
})

test("matchResources détecte un mot-clé contenu dans une phrase", () => {
  const matches = runMatch("Je cherche un annuaire de professionnels")

  assert.equal(matches[0]?.resource.id, "annuaire")
})

test("matchResources fait un fuzzy léger sans librairie", () => {
  const matches = runMatch("je cherche un medcin traitant")

  assert.equal(matches[0]?.resource.id, "medecin-traitant")
})

test("matchResources limite le résultat au top 3", () => {
  const matches = runMatch("medecin traitant annuaire urgence faq")

  assert.equal(matches.length, 3)
})

test("matchResources détecte un mot-clé dans une phrase libre", () => {
  const matches = runMatch("Pouvez-vous proposer des formations ?")

  assert.equal(matches[0]?.resource.id, "pro-formations")
})

test("matchResources détecte une campagne santé dans une phrase libre", () => {
  const matches = runMatch("Je cherche les infos sur mars bleu")

  assert.equal(matches[0]?.resource.id, "sf-mars-bleu-2026")
})

test("matchResources détecte l'apnée du sommeil", () => {
  const matches = runMatch("apnée du sommeil")

  assert.equal(matches[0]?.resource.id, "etp-apnee-sommeil")
})

test("matchResources détecte l'annuaire santé mentale", () => {
  const matches = runMatch("annuaire santé mentale")

  assert.equal(matches[0]?.resource.id, "sante-mentale-annuaire")
})

test("matchResources détecte l'adhésion CPTS", () => {
  const matches = runMatch("adérer a la cpts")

  assert.equal(matches[0]?.resource.id, "pro-adhesion")
})

test("matchResources détecte la prévention sexuelle", () => {
  const matches = runMatch("prévention sexuelle")

  assert.equal(matches[0]?.resource.id, "ms-prevention-sexuelle")
})

test("matchResources détecte le système de santé", () => {
  const matches = runMatch("systéme de santé")

  assert.equal(matches[0]?.resource.id, "ms-bon-usage-systeme-sante")
})
