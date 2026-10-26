// ============================================
// Shared utility functions
// ============================================

const MONTHS_UK = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
]

/** Format ISO date string to Ukrainian readable format: "25 грудня 2025" */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return `${d.getDate()} ${MONTHS_UK[d.getMonth()]} ${d.getFullYear()}`
}

/** Like formatDate but adds the time: "25 грудня 2025, 18:00" (events carry a time). */
export function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate)
  const time = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
  return `${formatDate(isoDate)}, ${time}`
}

/**
 * Serialize a value into a JSON-LD `__html` string, escaping `<` as `<`
 * so CMS-authored content containing `</script>` cannot break out of the
 * surrounding <script type="application/ld+json"> tag.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Preserve a real ISO date/time; never synthesize missing editorial dates. */
export function schemaDate(value: string | null | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return undefined
  const day = new Date(value.slice(0, 10))
  if (!Number.isFinite(Date.parse(value)) || !Number.isFinite(day.getTime())) return undefined
  return day.toISOString().slice(0, 10) === value.slice(0, 10) ? value : undefined
}
