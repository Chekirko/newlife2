// ============================================
// Shared utility functions
// ============================================

const timeZone = 'Europe/Kyiv'
const dateFormatter = new Intl.DateTimeFormat('uk-UA', { timeZone, day: 'numeric', month: 'long', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('uk-UA', { timeZone, hour: '2-digit', minute: '2-digit' })

/** Format ISO date string to Ukrainian readable format: "25 грудня 2025" */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate)).replace(/\s*р\.$/, '')
}

/** Like formatDate but adds the time: "25 грудня 2025, 18:00" (events carry a time). */
export function formatEventDate(isoDate: string): string {
  return `${formatDate(isoDate)}, ${timeFormatter.format(new Date(isoDate))}`
}

/** UTC instant at Kyiv midnight, including days when the UTC offset changes. */
export function startOfKyivDay(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const part = (name: string) => parts.find(value => value.type === name)!.value
  const midnight = Date.parse(`${part('year')}-${part('month')}-${part('day')}T00:00:00Z`)
  const offsetParts = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(new Date(midnight)).find(value => value.type === 'timeZoneName')!.value
  const match = offsetParts.match(/GMT([+-])(\d{2}):(\d{2})/)
  const offset = match ? (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3])) : 0
  return new Date(midnight - offset * 60_000).toISOString()
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
