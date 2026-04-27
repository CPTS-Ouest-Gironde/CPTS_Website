const FORBIDDEN_LINK_PATTERN =
  /\b(?:https?:\/\/|www\.|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63})\b/i

const PERSON_NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/
const POSTAL_ADDRESS_PATTERN = /^[0-9A-Za-zÀ-ÖØ-öø-ÿ'.,/ -]+$/

export function containsForbiddenLink(value: string) {
  return FORBIDDEN_LINK_PATTERN.test(value)
}

export function isValidPersonName(value: string) {
  const trimmedValue = value.trim()
  return PERSON_NAME_PATTERN.test(trimmedValue)
}

export function isValidPostalAddress(value: string) {
  const trimmedValue = value.trim()
  return POSTAL_ADDRESS_PATTERN.test(trimmedValue) && /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(trimmedValue)
}
