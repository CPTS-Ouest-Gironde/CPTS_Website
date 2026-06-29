export const DATE_FIELD_KEYS = new Set(["patientDdn", "suicidairePaaDate"]);

export function formatDateFr(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function formatDatetimeFr(isoDatetime: string): string {
  try {
    const date = new Date(isoDatetime);
    const parts = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("day")}/${get("month")}/${get("year")} à ${get("hour")}h${get("minute")}`;
  } catch {
    return isoDatetime;
  }
}
