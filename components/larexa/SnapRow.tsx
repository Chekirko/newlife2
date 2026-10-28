import { Children, useId, type ReactNode } from 'react'
import { SnapArrows } from './SnapArrows'

interface SnapRowProps {
  /** Names the list and its scroll buttons. */
  label: string
  children: ReactNode
}

/** Server-rendered scroll-snap row (1/2/3 cards per view, no autoplay); only the arrows hydrate. */
export function SnapRow({ label, children }: SnapRowProps) {
  const trackId = useId()
  return (
    <div>
      <ul id={trackId} aria-label={label} className="flex snap-x snap-mandatory gap-[30px] overflow-x-auto [scrollbar-width:thin]">
        {Children.map(children, child => (
          <li className="shrink-0 basis-full snap-start sm:basis-[calc((100%-30px)/2)] md:basis-[calc((100%-60px)/3)]">{child}</li>
        ))}
      </ul>
      <SnapArrows trackId={trackId} label={label} />
    </div>
  )
}
