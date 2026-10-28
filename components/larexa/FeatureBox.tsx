import { useId } from 'react'
import { clsx } from 'clsx'
import { Icon } from '@/components/ui/Icon'

interface FeatureBoxProps {
  /** CMS Font Awesome name, e.g. `fas fa-music`. */
  icon: string
  title: string
  text: string
  /** 2 — floating icon in a shadowed box; 5 — icon in a soft circle. */
  style?: 2 | 5
}

/** Larexa feature box with a gradient icon (SVG fill, since the icons are not a font). */
export function FeatureBox({ icon, title, text, style = 2 }: FeatureBoxProps) {
  const gradientId = useId()
  return (
    <div className={clsx('feature-box h-full', style === 2 ? 'f-style-2' : 'f-style-5')}>
      <svg aria-hidden="true" className="absolute size-0">
        <linearGradient id={gradientId} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--gradient-start)' }} />
          <stop offset="1" style={{ stopColor: 'var(--gradient-end)' }} />
        </linearGradient>
      </svg>
      <div className="feature-box-icon">
        <Icon name={icon} fill={`url(#${gradientId})`} />
      </div>
      <h3 className="feature-box-title">{title}</h3>
      <p className="feature-box-desc">{text}</p>
    </div>
  )
}
