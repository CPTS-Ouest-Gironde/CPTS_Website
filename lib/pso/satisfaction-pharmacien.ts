export const satisfactionPharmacienOpenMonths = [9, 10] as const

export function getSatisfactionPharmacienReferenceYear(date = new Date()) {
  return date.getFullYear()
}

export function isSatisfactionPharmacienResponseWindowOpen(date = new Date()) {
  const month = date.getMonth() + 1

  return satisfactionPharmacienOpenMonths.includes(
    month as (typeof satisfactionPharmacienOpenMonths)[number],
  )
}
