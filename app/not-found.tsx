import ChurchHeader from '@/components/ChurchHeader'
import ChurchFooter from '@/components/ChurchFooter'
import { NotFoundView } from '@/components'

// Global 404 for URLs that match no route at all. The root layout has no
// site chrome (so /studio stays clean), so we add header/footer here.
export default function NotFound() {
  return (
    <>
      <ChurchHeader />
      <main className="pt-[92px]">
        <NotFoundView />
      </main>
      <ChurchFooter />
    </>
  )
}
