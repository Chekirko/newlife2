// =========================================
// SOCIAL — shared registry of supported social platforms.
//
// Single source of truth for the platform set, each one's Font Awesome icon,
// accessible label, and brand color. Imported by BOTH the Sanity schema
// (`siteSettings.ts` — to build the platform dropdown) and the frontend
// (`getSiteSettings()` + header/footer — to render). Pure data, no server
// deps, so it is safe inside the Studio bundle.
//
// To support a brand-new platform: add one entry here. It immediately becomes
// available in the /studio dropdown AND renders with the right icon/color.
// A content manager can also pick "Інша" (other) for any novel link without a
// code change — it renders with a generic globe icon and a custom label.
// =========================================

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'telegram'
  | 'tiktok'
  | 'viber'
  | 'threads'
  | 'twitter'
  | 'other'

interface PlatformMeta {
  /** Default accessible label (overridable per-item via `label`). */
  label: string
  /** Font Awesome class. */
  icon: string
  /** Brand color (inline background). */
  color: string
}

export const SOCIAL_PLATFORMS: Record<SocialPlatform, PlatformMeta> = {
  facebook: { label: 'Facebook', icon: 'fab fa-facebook-f', color: '#3b5998' },
  instagram: { label: 'Instagram', icon: 'fab fa-instagram', color: '#e4405f' },
  youtube: { label: 'YouTube', icon: 'fab fa-youtube', color: '#ff0000' },
  telegram: { label: 'Telegram', icon: 'fab fa-telegram-plane', color: '#229ed9' },
  tiktok: { label: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
  viber: { label: 'Viber', icon: 'fab fa-viber', color: '#7360f2' },
  threads: { label: 'Threads', icon: 'fab fa-threads', color: '#000000' },
  twitter: { label: 'X (Twitter)', icon: 'fab fa-x-twitter', color: '#000000' },
  other: { label: 'Посилання', icon: 'fas fa-globe', color: '#4cbd89' },
}

/** Dropdown list for the Sanity schema (`options.list`): title = label, value = key. */
export const SOCIAL_PLATFORM_OPTIONS = (
  Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]
).map((value) => ({ title: SOCIAL_PLATFORMS[value].label, value }))

/** A CMS social item resolved into a render-ready link. */
export interface SocialLink {
  platform: SocialPlatform
  url: string
  label: string
  icon: string
  color: string
}

/** Resolve a raw CMS item → render-ready link (unknown platform falls back to "other"). */
export function resolveSocialLink(item: {
  platform?: string | null
  url?: string | null
  label?: string | null
}): SocialLink {
  const key = (
    item.platform && item.platform in SOCIAL_PLATFORMS ? item.platform : 'other'
  ) as SocialPlatform
  const meta = SOCIAL_PLATFORMS[key]
  return {
    platform: key,
    url: item.url ?? '',
    label: item.label?.trim() || meta.label,
    icon: meta.icon,
    color: meta.color,
  }
}
