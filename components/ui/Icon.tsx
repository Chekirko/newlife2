import 'server-only'
import { icons } from '@/lib/icons'
import { SvgIcon, type IconProps } from './SvgIcon'

/** Accepts existing CMS Font Awesome names without loading an icon font. */
export function Icon({ name = '', className = '', ...props }: IconProps) {
  const tokens = `${name} ${className}`.split(/\s+/)
  const key = tokens.find(token => Object.hasOwn(icons, token))
  const definition = key ? icons[key] : icons['fa-circle-question']
  return <SvgIcon definition={definition} name={name} className={className} {...props} />
}
