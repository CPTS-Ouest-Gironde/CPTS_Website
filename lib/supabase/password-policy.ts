export const PASSWORD_MIN_LENGTH = 8

export const PASSWORD_REQUIREMENTS = [
  `Au moins ${PASSWORD_MIN_LENGTH} caractères`,
  "Au moins une lettre minuscule",
  "Au moins une lettre majuscule",
  "Au moins un chiffre",
] as const

export function validatePasswordPolicy(password: string) {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)

  const isValid = hasMinLength && hasLowercase && hasUppercase && hasDigit

  return {
    isValid,
    hasMinLength,
    hasLowercase,
    hasUppercase,
    hasDigit,
  }
}
