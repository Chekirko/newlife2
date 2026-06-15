import { NotFoundView } from '@/components'

// Rendered for notFound() calls inside the (front) segment (e.g. unknown
// news/ministry/team slug). The (front) layout supplies header + footer.
export default function NotFound() {
  return <NotFoundView />
}
