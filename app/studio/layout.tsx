import type { ReactNode } from 'react'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <html lang="uk"><body style={{ margin: 0 }}>{children}</body></html>
}
