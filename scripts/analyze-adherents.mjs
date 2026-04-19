#!/usr/bin/env node
/**
 * Script d'analyse du CSV d'adhérents CPTS
 *
 * Usage :
 *   node scripts/analyze-adherents.mjs <fichier.csv>
 *
 * Génère :
 * - Un rapport détaillé dans la console
 * - Un CSV des lignes problématiques à corriger : <fichier>-issues.csv
 * - Un CSV des lignes valides prêtes à l'import : <fichier>-clean.csv
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const DATA_DIR = join(PROJECT_ROOT, "docs/cpts/import-adherents");

// Arguments
const csvFileName = process.argv[2];
if (!csvFileName) {
  console.error("Usage: node scripts/analyze-adherents.mjs <fichier.csv>");
  process.exit(1);
}

const csvPath = join(DATA_DIR, csvFileName);
if (!existsSync(csvPath)) {
  console.error(`Fichier introuvable : ${csvPath}`);
  process.exit(1);
}

// Normalisation des noms
function normalizeName(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .toLowerCase()
    .split(/(\s|-|')/g)
    .map((part) => {
      if (part.length === 0) return part;
      if (/[\s\-']/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

function normalizeEmail(email) {
  if (!email || typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(normalized) ? normalized : null;
}

// Lecture du CSV
const csvContent = readFileSync(csvPath, "utf-8");
const rows = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

console.log("=".repeat(70));
console.log(`ANALYSE DU FICHIER : ${csvFileName}`);
console.log("=".repeat(70));
console.log(`Lignes totales (hors en-tête) : ${rows.length}`);

// Détection des colonnes
const firstRow = rows[0] || {};
const nomKey = Object.keys(firstRow).find((k) => /^nom$/i.test(k.trim()));
const prenomKey = Object.keys(firstRow).find((k) =>
  /^pr[eé]nom$/i.test(k.trim()),
);
const emailKey = Object.keys(firstRow).find((k) =>
  /mail|email/i.test(k.trim()),
);

if (!nomKey || !prenomKey || !emailKey) {
  console.error("Colonnes manquantes. Attendu : Nom, Prénom, Adresse mail");
  console.error(`Détecté : ${Object.keys(firstRow).join(", ")}`);
  process.exit(1);
}

// Analyse des lignes
const stats = {
  total: rows.length,
  valid: 0,
  noEmail: 0,
  invalidEmail: 0,
  noName: 0,
  duplicates: 0,
  emptyRow: 0,
};

const issues = [];
const validRows = [];
const seenEmails = new Map();

for (const [index, row] of rows.entries()) {
  const lineNumber = index + 2; // +1 pour l'index 0, +1 pour la ligne d'en-tête
  const rawNom = row[nomKey] || "";
  const rawPrenom = row[prenomKey] || "";
  const rawEmail = row[emailKey] || "";

  const firstName = normalizeName(rawPrenom);
  const lastName = normalizeName(rawNom);
  const email = normalizeEmail(rawEmail);

  // Ligne complètement vide
  if (!firstName && !lastName && !rawEmail) {
    stats.emptyRow++;
    issues.push({
      ligne: lineNumber,
      probleme: "Ligne vide",
      nom: "",
      prenom: "",
      email: "",
    });
    continue;
  }

  // Pas d'email du tout
  if (!rawEmail.trim()) {
    stats.noEmail++;
    issues.push({
      ligne: lineNumber,
      probleme: "Email manquant",
      nom: rawNom,
      prenom: rawPrenom,
      email: "",
    });
    continue;
  }

  // Email présent mais invalide
  if (!email) {
    stats.invalidEmail++;
    issues.push({
      ligne: lineNumber,
      probleme: "Email format invalide",
      nom: rawNom,
      prenom: rawPrenom,
      email: rawEmail,
    });
    continue;
  }

  // Nom ou prénom manquant
  if (!firstName || !lastName) {
    stats.noName++;
    issues.push({
      ligne: lineNumber,
      probleme: "Nom ou prénom manquant",
      nom: rawNom,
      prenom: rawPrenom,
      email: rawEmail,
    });
    continue;
  }

  // Doublon
  if (seenEmails.has(email)) {
    stats.duplicates++;
    const firstOccurrence = seenEmails.get(email);
    issues.push({
      ligne: lineNumber,
      probleme: `Doublon (première occurrence ligne ${firstOccurrence})`,
      nom: rawNom,
      prenom: rawPrenom,
      email: rawEmail,
    });
    continue;
  }

  seenEmails.set(email, lineNumber);
  stats.valid++;
  validRows.push({
    Nom: lastName,
    Prénom: firstName,
    "Adresse mail": email,
  });
}

// Rapport console
console.log("");
console.log("RÉSUMÉ");
console.log("-".repeat(70));
console.log(`  Lignes vides                    : ${stats.emptyRow}`);
console.log(`  Email manquant                  : ${stats.noEmail}`);
console.log(`  Email format invalide           : ${stats.invalidEmail}`);
console.log(`  Nom ou prénom manquant          : ${stats.noName}`);
console.log(`  Doublons internes               : ${stats.duplicates}`);
console.log("-".repeat(70));
console.log(`  Lignes valides pour import      : ${stats.valid}`);
console.log(`  Total problèmes                 : ${issues.length}`);
console.log(`  Total lignes analysées          : ${stats.total}`);
console.log("-".repeat(70));

// Génération des fichiers
const baseName = basename(csvFileName, extname(csvFileName));
const issuesPath = join(DATA_DIR, `${baseName}-issues.csv`);
const cleanPath = join(DATA_DIR, `${baseName}-clean.csv`);

// Fichier des problèmes
if (issues.length > 0) {
  const issuesCSV = stringify(issues, {
    header: true,
    columns: ["ligne", "probleme", "nom", "prenom", "email"],
  });
  writeFileSync(issuesPath, issuesCSV);
  console.log(`\nRapport des problèmes    : ${issuesPath}`);
}

// Fichier propre
if (validRows.length > 0) {
  const cleanCSV = stringify(validRows, {
    header: true,
    columns: ["Nom", "Prénom", "Adresse mail"],
  });
  writeFileSync(cleanPath, cleanCSV);
  console.log(`CSV propre prêt à importer : ${cleanPath}`);
}

console.log("");
console.log("PROCHAINES ÉTAPES SUGGÉRÉES");
console.log("-".repeat(70));
if (stats.noEmail > 0 || stats.invalidEmail > 0) {
  console.log(`  1. Ouvrir ${baseName}-issues.csv et transmettre à Corinne`);
  console.log(`     pour récupérer les emails manquants`);
}
if (stats.duplicates > 0) {
  console.log(`  2. Vérifier les doublons (plusieurs pros même adresse ?)`);
}
if (stats.valid > 0) {
  console.log(
    `  3. Pour importer uniquement les ${stats.valid} lignes valides :`,
  );
  console.log(
    `     node scripts/import-adherents.mjs ${baseName}-clean.csv --limit=70`,
  );
}
console.log("=".repeat(70));
