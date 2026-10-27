// =========================================
// MapEmbed — Google Maps iframe wrapper (+ external link)
// Used on: Contact page
// =========================================

interface MapEmbedProps {
  src: string
  className?: string
}

export function MapEmbed({ src, className = '' }: MapEmbedProps) {
  const mapsUrl = new URL(src)
  mapsUrl.searchParams.delete('output')
  return (
    <div className={`flex w-full h-full min-h-[300px] flex-col rounded-xl overflow-hidden bg-gray-100 ${className}`}>
      <iframe
        src={src}
        className="min-h-[250px] w-full flex-1 border-0 grayscale hover:grayscale-0 transition-all duration-500"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Розташування церкви «Нове Життя» в Google Maps"
      />
      <a href={mapsUrl.toString()} target="_blank" rel="noopener noreferrer" className="block bg-white px-3 py-4 text-center font-medium text-primary-text underline">Відкрити в Google Maps</a>
    </div>
  )
}

export default MapEmbed
