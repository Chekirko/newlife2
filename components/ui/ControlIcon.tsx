import {
  faArrowDown, faChevronDown, faChevronLeft, faChevronRight, faLocationDot,
  faSearch, faSpinner, faTimes, faTriangleExclamation, type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt, faImages, faPlayCircle } from '@fortawesome/free-regular-svg-icons'
import { SvgIcon, type IconProps } from './SvgIcon'

// Client controls use a fixed small set; the CMS registry stays on the server.
const controls: Record<string, IconDefinition> = {
  'fa-arrow-down': faArrowDown, 'fa-chevron-down': faChevronDown,
  'fa-chevron-left': faChevronLeft, 'fa-chevron-right': faChevronRight,
  'fa-location-dot': faLocationDot, 'fa-search': faSearch, 'fa-spinner': faSpinner,
  'fa-times': faTimes, 'fa-triangle-exclamation': faTriangleExclamation,
  'fa-calendar-alt': faCalendarAlt, 'fa-images': faImages, 'fa-play-circle': faPlayCircle,
}

export function ControlIcon({ name = '', className = '', ...props }: IconProps) {
  const key = `${name} ${className}`.split(/\s+/).find(token => Object.hasOwn(controls, token))
  return key ? <SvgIcon definition={controls[key]} name={name} className={className} {...props} /> : null
}
