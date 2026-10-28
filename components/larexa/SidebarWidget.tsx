import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface SidebarWidgetProps {
  title: string
  children: ReactNode
  /** H2 in a page sidebar; H3 when the widget sits inside a titled section. */
  as?: 'h2' | 'h3'
  className?: string
}

/** Larexa sidebar `.widget` with a `.widget-title`. */
export function SidebarWidget({ title, children, as: Heading = 'h2', className }: SidebarWidgetProps) {
  return (
    <div className={clsx('widget', className)}>
      <Heading className="widget-title">{title}</Heading>
      {children}
    </div>
  )
}
