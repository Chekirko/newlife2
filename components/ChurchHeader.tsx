import Link from 'next/link'
import Image from '@/components/ui/SiteImage'
import { Icon } from '@/components/ui/Icon'
import { NavLink } from './navigation/NavLink'
import { NavDropdown } from './navigation/NavDropdown'
import { MobileMenu } from './navigation/MobileMenu'
import type { SiteSettings } from '@/lib/site-settings'

const navItems = [
  { label: 'Головна', href: '/' },
  { label: 'Про нас', children: [
    { label: 'Про церкву', href: '/about' }, { label: 'Історія', href: '/history' }, { label: 'Команда', href: '/team' },
  ] },
  { label: 'Служіння', href: '/ministries' }, { label: 'Новини', href: '/news' },
  { label: 'Події', href: '/events' },
  { label: 'Медіа', children: [{ label: 'Відео', href: '/media' }, { label: 'Фото', href: '/media/photos' }] },
  { label: 'Контакти', href: '/contact' },
]

function NavigationItems({ mobile = false }: { mobile?: boolean }) {
  return <ul className={mobile ? 'space-y-2' : 'flex items-center'}>
    {navItems.map(item => <li key={item.label} className="relative">
      {item.children ? <NavDropdown label={item.label} paths={item.children.map(child => child.href)} mobile={mobile}>
        <ul>{item.children.map(child => <li key={child.href}>
          <NavLink href={child.href} className="block px-4 py-2 hover:bg-gray-50">{child.label}</NavLink>
        </li>)}</ul>
      </NavDropdown> : <NavLink href={item.href!} className="block px-4 py-2 text-[15px] font-medium">{item.label}</NavLink>}
    </li>)}
  </ul>
}

export default function ChurchHeader({ settings }: { settings: SiteSettings }) {
  const sundayService = settings.services.find(service => service.day === 'Неділя') ?? settings.services[0]
  return <>
    <div className="h-11 border-b border-gray-200 bg-gray-100">
      <div className="container-larexa flex h-full items-center justify-between text-sm">
        <div className="hidden items-center gap-6 text-gray-600 md:flex">
          <a href={`tel:${settings.phone}`} className="flex items-center gap-2"><Icon name="fas fa-phone" className="text-primary-text" />{settings.phoneDisplay}</a>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-2"><Icon name="fas fa-envelope" className="text-primary-text" />{settings.email}</a>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {sundayService && <span className="hidden text-gray-600 sm:inline"><Icon name="far fa-clock" className="mr-1 text-primary-text" />{sundayService.day}: {sundayService.time}</span>}
          <div className="flex gap-2">{settings.social.map(social => <a key={social.platform + social.url}
            href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}
            style={{ backgroundColor: social.color }} className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-white hover:opacity-80">
            <Icon name={social.icon} />
          </a>)}</div>
        </div>
      </div>
    </div>
    <header className="sticky top-0 z-[1000] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
      <div className="container-larexa flex items-center justify-between py-3 lg:min-h-[120px]">
        <Link href="/" aria-label="Церква «Нове життя» — головна" className="flex shrink-0 items-center">
          <Image src="/images/logo-dark.svg" alt="Нове життя — церква, м. Борислав" width={1203} height={461} className="h-14 w-auto" />
        </Link>
        <nav aria-label="Головна навігація" className="hidden items-center lg:flex">
          <NavigationItems />
          <Link href="/contact" className="btn btn-grad ml-4">Відвідати</Link>
        </nav>
        <MobileMenu><NavigationItems mobile /><Link href="/contact" className="btn btn-grad mt-4 block text-center">Відвідати</Link></MobileMenu>
      </div>
    </header>
  </>
}
