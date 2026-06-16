// =========================================
// STATS_FALLBACK — typed default church stats (AboutWithStats).
//
// Pure data, no runtime dependencies (the AboutStat import is type-only and
// erased at build time). Shared by `lib/homepage.ts` (fallback) and the
// standalone `scripts/seed-homepage-sections.ts` node script. Canonical SHAPE.
// =========================================

import type { AboutStat } from '../app/(front)/components/AboutWithStats'

export const STATS_FALLBACK: AboutStat[] = [
  { value: '19+', label: 'Років служіння' },
  { value: '350+', label: 'Членів церкви' },
  { value: '6', label: 'Служінь' },
  { value: '50+', label: 'Волонтерів' },
]
