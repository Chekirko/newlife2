'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ControlIcon as Icon } from '@/components/ui/ControlIcon'

export function NavDropdown({ label, paths, mobile, children }: { label: string; paths: string[]; mobile: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const button = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const active = paths.some(path => pathname === path || pathname.startsWith(`${path}/`))
  return <div className="relative" onMouseEnter={() => { if (!mobile) setOpen(true) }} onMouseLeave={() => { if (!mobile) setOpen(false) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
    onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); button.current?.focus() } }}>
    <button ref={button} type="button" aria-expanded={open} aria-controls={id}
      onClick={event => setOpen(value => event.detail > 0 && !mobile ? true : !value)}
      className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-[15px] font-medium hover:text-primary-text ${active ? 'text-primary-text' : 'text-gray-700'}`}>
      {label}<Icon name="fas fa-chevron-down" className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    <div id={id} hidden={!open} inert={!open} onClick={event => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}
      className={mobile ? 'ml-4 border-l border-gray-200' : 'absolute left-0 top-full min-w-48 rounded bg-white py-2 shadow-dropdown'}>{children}</div>
  </div>
}
