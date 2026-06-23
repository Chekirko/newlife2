import { getYouTubeEmbedUrl } from '@/lib/youtube'

// =========================================
// LiveBanner — shown at the top of /media only while the configured channel is
// live (resolved in lib/live-stream.ts). Embeds the current broadcast.
// =========================================

interface LiveBannerProps {
  videoId: string
  label: string
}

export function LiveBanner({ videoId, label }: LiveBannerProps) {
  return (
    <section className="bg-gray-900 py-10 lg:py-14">
      <div className="container-larexa">
        <div className="mb-5 flex items-center justify-center gap-2.5">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-red-500" />
          </span>
          <span className="text-sm font-bold uppercase tracking-wide text-red-400">Наживо</span>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-white lg:text-3xl">{label}</h2>
        <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black">
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
