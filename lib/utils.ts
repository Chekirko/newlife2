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
