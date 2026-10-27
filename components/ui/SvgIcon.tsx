import type { SVGProps } from 'react'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export type IconProps = SVGProps<SVGSVGElement> & { name?: string }

export function SvgIcon({ definition, name = '', className = '', ...props }: IconProps & { definition: IconDefinition }) {
  const [width, height, , , paths] = definition.icon
  const classes = className.split(/\s+/).filter(token => !/^fa[brs]?$|^fa-/.test(token)).join(' ')
  return <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${width} ${height}`} fill="currentColor"
    className={`inline-block h-[1em] w-[1em] shrink-0 align-[-0.125em] ${`${name} ${className}`.split(/\s+/).includes('fa-spin') ? 'animate-spin' : ''} ${classes}`}
    {...props}>
    {(Array.isArray(paths) ? paths : [paths]).map((path, index) => <path key={index} d={path} />)}
  </svg>
}
