// Validation centralisée des liens du chatbot, partagée entre le moteur
// (validation/normalisation à l'hydratation sessionStorage) et le rendu
// (sanitizeLinkHref). Une seule source de vérité : un lien jugé sûr ici est
// rendu tel quel, sinon il retombe sur "#" et ne peut rien exécuter.

export const UNSAFE_HREF_FALLBACK = "#"

// Refuse les caractères de contrôle (tab, retours ligne, NUL, DEL...) : ils
// n'apparaissent jamais dans un lien légitime et servent à masquer un protocole.
function hasControlChars(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code < 32 || code === 127) {
      return true
    }
  }

  return false
}

// Lien interne : chemin enraciné `/...` (mais pas `//hôte` qui serait absolu).
export function isSafeInternalHref(href: string): boolean {
  return !hasControlChars(href) && href.startsWith("/") && !href.startsWith("//")
}

// Lien externe : uniquement https:// explicite.
export function isSafeExternalHref(href: string): boolean {
  return !hasControlChars(href) && /^https:\/\//i.test(href)
}

export function sanitizeLinkHref(href: string, allowAbsolute: boolean): string {
  if (isSafeInternalHref(href)) {
    return href
  }

  if (allowAbsolute && isSafeExternalHref(href)) {
    return href
  }

  return UNSAFE_HREF_FALLBACK
}
