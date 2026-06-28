import { clsx } from 'clsx'

/**
 * Branded fallback shown where a Sanity image is optional and missing
 * (e.g. a ministry without a main photo). Fills its positioned parent with the
 * brand gradient + a centered, decorative photo icon. Presentational only —
 * safe in both server and client components.
 */
export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center justify-center bg-grad', className)}>
      <svg
        className="w-1/4 max-w-16 min-w-8 text-white/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  )
}

export default ImagePlaceholder
