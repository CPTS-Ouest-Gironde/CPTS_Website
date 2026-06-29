import assert from "node:assert/strict"
import test from "node:test"

import { normalizeText } from "./normalize"

test("normalizeText supprime les accents, ponctuation et espaces en trop", () => {
  assert.equal(normalizeText("  Médecin   traitant!! "), "medecin traitant")
})

test("normalizeText conserve les chiffres utiles", () => {
  assert.equal(normalizeText("Le 31 14"), "le 31 14")
})

test("normalizeText normalise une phrase avec apostrophes", () => {
  assert.equal(normalizeText("J'ai besoin d'aide"), "j ai besoin d aide")
})
