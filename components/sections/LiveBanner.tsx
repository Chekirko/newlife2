import { getYouTubeEmbedUrl } from '@/lib/youtube'

// =========================================
// LiveBanner — shown at the top of the homepage and /media only while the
// configured channel is live (resolved in lib/live-stream.ts). Embeds the
// current broadcast.
// =========================================

interface LiveBannerProps {
  videoId: string
  label: string
}

export function LiveBanner({ videoId, label }: LiveBannerProps) {
  return (
    <section className="bg-gray-100 py-8 lg:py-12">
      <div className="container-larexa">
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wide text-red-600">Наживо</span>
          </span>
          <h2 className="mt-1.5 text-xl font-bold text-gray-800 lg:text-2xl">{label}</h2>
        </div>
        <div className="mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-black shadow-card">
          <iframe
            src={getYouTubeEmbedUrl(videoId)}
            title={label}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

export default LiveBanner
