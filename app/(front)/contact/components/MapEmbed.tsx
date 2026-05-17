// =========================================
// MapEmbed — Google Maps iframe wrapper
// Used on: Contact page
// =========================================

interface MapEmbedProps {
  src: string
  className?: string
}

export function MapEmbed({ src, className = '' }: MapEmbedProps) {
  return (
    <div className={`w-full h-full min-h-[300px] rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={src}
        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
        style={{ border: 0, minHeight: '100%' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
    </div>
  )
}

export default MapEmbed
