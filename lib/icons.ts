import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {
  faArrowDown, faArrowRight, faBookBible, faChevronDown, faChevronLeft, faChevronRight,
  faChild, faCircleQuestion, faCross, faDoorOpen, faDove, faEnvelope, faGlobe,
  faHandHoldingHeart, faHandshake, faHandsHelping, faHeart, faLocationDot,
  faMugHot, faMusic, faPhone, faPlay, faPray, faScrewdriverWrench, faSearch,
  faShirt, faSpinner, faSquareParking, faStar, faTimes, faTriangleExclamation, faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark, faCalendarAlt, faClock, faImages, faNewspaper, faPlayCircle, faUser } from '@fortawesome/free-regular-svg-icons'
import {
  faFacebookF, faInstagram, faTelegramPlane, faThreads, faTiktok, faViber, faXTwitter, faYoutube,
} from '@fortawesome/free-brands-svg-icons'

const definitions = [faArrowDown, faArrowRight, faBookBible, faBookmark, faCalendarAlt, faChevronDown,
  faChevronLeft, faChevronRight, faChild, faCircleQuestion, faClock, faCross, faDoorOpen,
  faDove, faEnvelope, faGlobe, faHandHoldingHeart, faHandshake, faHandsHelping, faHeart,
  faImages, faLocationDot, faMugHot, faMusic, faNewspaper, faPhone, faPlay, faPlayCircle,
  faPray, faScrewdriverWrench, faSearch, faShirt, faSpinner, faSquareParking, faStar,
  faTimes, faTriangleExclamation, faUser, faUsers, faFacebookF, faInstagram,
  faTelegramPlane, faThreads, faTiktok, faViber, faXTwitter, faYoutube]

export const icons: Record<string, IconDefinition> = Object.fromEntries(
  definitions.map(icon => [`fa-${icon.iconName}`, icon]),
)
Object.assign(icons, {
  'fa-calendar-alt': faCalendarAlt, 'fa-map-marker-alt': faLocationDot,
  'fa-times': faTimes, 'fa-search': faSearch, 'fa-play-circle': faPlayCircle,
  'fa-hands-helping': faHandsHelping, 'fa-pray': faPray, 'fa-telegram-plane': faTelegramPlane,
})
