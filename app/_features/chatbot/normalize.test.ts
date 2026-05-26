import assert from "node:assert/strict"
import test from "node:test"

import { normalizeText } from "./normalize"

test("normalizeText supprime les accents, ponctuation et espaces en trop", () => {
  assert.equal(normalizeText("  Médecin   traitant!! "), "medecin traitant")
})

test("normalizeText conserve les chiffres utiles", () => {
  assert.equal(normalizeText("Le 31 14"), "31 14")
})

test("normalizeText normalise une phrase avec apostrophes", () => {
  assert.equal(normalizeText("J'ai besoin d'aide"), "besoin aide")
})

test("normalizeText retire les stop words pour les phrases naturelles", () => {
  assert.equal(normalizeText("j'ai mal à la tête"), "mal tete")
  assert.equal(normalizeText("j'ai des douleurs thoraciques depuis ce matin"), "douleurs thoraciques")
  assert.equal(normalizeText("je cherche un médecin"), "cherche medecin")
})
