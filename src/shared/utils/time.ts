export type Time = `${number}:${number}` // Exemplo: "08:30"

export function isValidTime(value: string): value is Time {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
}
