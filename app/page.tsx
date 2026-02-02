import {
  // Hero variants
  HeroSlider,
  HeroGradientImage,
  type HeroSlide,
  // About variants
  AboutWithStats,
  // Services
  ServicesCards,
  type ServiceItem,
  // Blog
  BlogCarousel,
  type BlogPostData,
  // Testimonials
  TestimonialsGrid,
  type TestimonialData,
  // FAQ
  FAQSplit,
  type FAQItem,
  // ActionBox
  ActionBoxFullWidth,
} from '@/components'
import { AboutWithDecorations } from '@/components/sections/AboutWithDecorations'

// ============================================
// HOMEPAGE - Церква "Нове Життя"
// Using actual Larexa components
// ============================================

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION - HeroSlider з Larexa */}
      <HeroSlider
        slides={heroSlides}
        height="h-[500px] lg:h-[750px]"
        overlayDark={4}
        autoplay={true}
        autoplaySpeed={6000}
        showArrows={true}
        showDots={true}
      />

      {/* PASTOR WELCOME - AboutWithDecorations з Larexa demo style */}
      <AboutWithDecorations
        preTitle="Про нас"
        title="Ласкаво просимо до нашої церковної родини"
        subtitle="Наша дружня команда завжди готова допомогти вам зрозуміти ваші духовні потреби та підтримати на шляху віри."
        description="Дорогі друзі! Я вірю, що ваш візит на наш сайт — не випадковість. Бог має чудовий план для вашого життя, і ми хочемо допомогти вам відкрити його."
        description2="У церкві «Нове Життя» ви знайдете теплу атмосферу, щирі стосунки та можливість зростати духовно. Ми віримо, що разом ми можемо змінювати наше місто та світ навколо."
        quote={{
          author: 'Пастор Іван Петренко',
          role: 'Старший пастор церкви'
        }}
        image="/images/pastor-welcome.jpg"
      />

      {/* WHAT WE DO - ServicesCards з Larexa */}
      <ServicesCards
        preTitle="Наші служіння"
        title="Що ми робимо"
        description="У нас є служіння для кожного віку та інтересу. Знайдіть своє місце в нашій спільноті."
        items={ministryItems}
        columns={3}
        className="py-16 lg:py-24 bg-gray-100"
      />

      {/* SERVICE SCHEDULE - HeroGradientImage з Larexa (як CTA) */}
      <HeroGradientImage
        preTitle="Приєднуйтесь до нас"
        title="Розклад богослужінь"
        subtitle="Неділя: 10:00 — Головне богослужіння | Середа: 18:00 — Молитовне зібрання | П'ятниця: 19:00 — Молодіжне зібрання"
        primaryButtonText="Запланувати візит"
        primaryButtonHref="/contact"
        secondaryButtonText="Як нас знайти"
        secondaryButtonHref="/contact#map"
        showWaveDivider={true}
        className="py-12"
      />

      {/* ABOUT WITH STATS - AboutWithStats з Larexa */}
      <AboutWithStats
        preTitle="Про нашу церкву"
        title="Ми — спільнота віруючих людей"
        description="Церква «Нове Життя» заснована у 2005 році. За ці роки ми виросли з маленької групи в велику церковну сім'ю."
        description2="Наша місія — допомагати людям знайти Бога, будувати міцні стосунки та служити громаді."
        stats={churchStats}
        buttonText="Дізнатися більше"
        buttonHref="/about"
        className="py-16 lg:py-24"
      />

      {/* ANNOUNCEMENTS / EVENTS - BlogCarousel з Larexa */}
      <BlogCarousel
        preTitle="Не пропустіть"
        title="Найближчі події"
        description="Анонси подій та заходів нашої церкви"
        posts={eventPosts}
        className="py-16 lg:py-24 bg-gray-100"
      />

      {/* NEWS - BlogCarousel з Larexa */}
      <BlogCarousel
        preTitle="Останні новини"
        title="Що нового в церкві"
        description="Новини та оновлення з життя нашої спільноти"
        posts={newsPosts}
        className="py-16 lg:py-24"
      />

      {/* TESTIMONIALS - TestimonialsGrid з Larexa */}
      <TestimonialsGrid
        preTitle="Свідчення"
        title="Що кажуть наші члени"
        testimonials={testimonials}
        columns={2}
        className="py-16 lg:py-24 bg-gray-100"
      />

      {/* FAQ - FAQSplit з Larexa */}
      <FAQSplit
        title="Часті запитання"
        description="Ми розуміємо, що перший візит до нової церкви може викликати питання. Ось відповіді на найпоширеніші з них."
        items={faqItems}
        contactTitle="Залишились питання?"
        contactDescription="Не знайшли відповідь? Зв'яжіться з нами, і ми з радістю допоможемо!"
        contactButtonText="Зв'язатися"
        contactButtonHref="/contact"
        className="py-16 lg:py-24"
      />

      {/* CONNECT CTA - ActionBoxFullWidth з Larexa (has subtitle and multiple buttons) */}
      <ActionBoxFullWidth
        title="Готові зробити наступний крок?"
        subtitle="Ми будемо раді познайомитися з вами особисто. Заплануйте свій перший візит або зв'яжіться з нами."
        buttonText="Запланувати візит"
        buttonHref="/contact"
        secondaryButtonText="Дізнатися більше"
        secondaryButtonHref="/about"
        isGradient={true}
        className="py-16 lg:py-20"
      />
    </>
  )
}

// ============================================
// DATA - Hero Slides
// ============================================
const heroSlides: HeroSlide[] = [
  {
    id: '1',
    backgroundImage: '/images/hero-church-1.jpg',
    preTitle: 'Ласкаво просимо',
    title: 'Знайди надію, знайди дім',
    subtitle: 'Церква «Нове Життя» — це місце, де кожен може зустріти Бога, знайти спільноту та розкрити своє призначення.',
    buttonText: 'Дізнатися більше',
    buttonHref: '/about',
    secondaryButtonText: 'Запланувати візит',
    secondaryButtonHref: '/contact',
    align: 'center'
  },
  {
    id: '2',
    backgroundImage: '/images/hero-church-2.jpg',
    preTitle: 'Кожної неділі о 10:00',
    title: 'Приєднуйтесь до богослужіння',
    subtitle: 'Прославлення, проповідь Слова та спільнота — чекаємо на вас!',
    buttonText: 'Як нас знайти',
    buttonHref: '/contact',
    align: 'center'
  },
  {
    id: '3',
    backgroundImage: '/images/hero-church-3.jpg',
    preTitle: 'Молодіжне служіння',
    title: 'Знайди своє місце',
    subtitle: 'Щоп\'ятниці о 19:00 — worship, спілкування та навчання для молоді.',
    buttonText: 'Молодіжне служіння',
    buttonHref: '/ministries/youth',
    align: 'center'
  },
]

// ============================================
// DATA - Ministry Items (Services)
// ============================================
const ministryItems: ServiceItem[] = [
  {
    icon: 'fas fa-child',
    title: 'Дитяче служіння',
    description: 'Програми для дітей від 3 до 12 років з біблійними уроками та творчістю.',
    link: '/ministries/children',
    linkText: 'Дізнатися більше'
  },
  {
    icon: 'fas fa-users',
    title: 'Молодіжне служіння',
    description: 'Спільнота для молоді з worship, навчанням та активностями.',
    link: '/ministries/youth',
    linkText: 'Дізнатися більше'
  },
  {
    icon: 'fas fa-female',
    title: 'Жіноче служіння',
    description: 'Підтримка, спілкування та духовний розвиток для жінок.',
    link: '/ministries/women',
    linkText: 'Дізнатися більше'
  },
  {
    icon: 'fas fa-male',
    title: 'Чоловіче служіння',
    description: 'Братство, наставництво та спільні проєкти для чоловіків.',
    link: '/ministries/men',
    linkText: 'Дізнатися більше'
  },
  {
    icon: 'fas fa-music',
    title: 'Музичне служіння',
    description: 'Прославлення через музику та творчість у церкві.',
    link: '/ministries/worship',
    linkText: 'Дізнатися більше'
  },
  {
    icon: 'fas fa-hands-helping',
    title: 'Соціальне служіння',
    description: 'Допомога нужденним та служіння в громаді міста.',
    link: '/ministries/outreach',
    linkText: 'Дізнатися більше'
  },
]

// ============================================
// DATA - Church Stats
// ============================================
const churchStats = [
  { value: '19+', label: 'Років служіння' },
  { value: '350+', label: 'Членів церкви' },
  { value: '6', label: 'Служінь' },
  { value: '50+', label: 'Волонтерів' },
]

// ============================================
// DATA - Event Posts (Announcements)
// ============================================
const eventPosts: BlogPostData[] = [
  {
    id: '1',
    title: 'Великодній концерт',
    tag: 'Подія',
    date: '20 квітня 2026',
    excerpt: 'Святковий концерт до Великодня з участю церковного хору та запрошених гостей.',
    href: '/events/easter-concert'
  },
  {
    id: '2',
    title: 'Молодіжна конференція',
    tag: 'Конференція',
    date: '15-17 травня 2026',
    excerpt: 'Три дні натхнення, навчання та спілкування для молоді з усієї України.',
    href: '/events/youth-conference'
  },
]

// ============================================
// DATA - News Posts
// ============================================
const newsPosts: BlogPostData[] = [
  {
    id: '1',
    title: 'Підсумки місіонерської поїздки',
    tag: 'Місія',
    date: '28 січня 2026',
    excerpt: 'Наша команда повернулася з місіонерської поїздки до Молдови.',
    href: '/news/mission-trip'
  },
  {
    id: '2',
    title: 'Новий курс біблійної школи',
    tag: 'Навчання',
    date: '25 січня 2026',
    excerpt: 'Запрошуємо на новий курс "Основи віри" для тих, хто хоче глибше пізнати Слово Боже.',
    href: '/news/bible-school'
  },
  {
    id: '3',
    title: 'Різдвяні благодійні заходи',
    tag: 'Служіння',
    date: '20 січня 2026',
    excerpt: 'Дякуємо всім, хто долучився до різдвяних благодійних заходів.',
    href: '/news/christmas-charity'
  },
]

// ============================================
// DATA - Testimonials
// ============================================
const testimonials: TestimonialData[] = [
  {
    id: '1',
    name: 'Марія К.',
    position: 'Член церкви 5 років',
    quote: 'Церква «Нове Життя» стала для мене справжнім домом. Тут я знайшла підтримку, друзів і, найголовніше, глибші стосунки з Богом.',
    rating: 5
  },
  {
    id: '2',
    name: 'Олександр П.',
    position: 'Член церкви 3 роки',
    quote: 'Коли я вперше прийшов до церкви, я шукав відповіді на важливі питання. Тут я знайшов не лише відповіді, але й справжню сім\'ю у Христі.',
    rating: 5
  },
]

// ============================================
// DATA - FAQ Items
// ============================================
const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Який дрес-код у церкві?',
    answer: 'У нас немає суворого дрес-коду. Одягайтеся так, як вам комфортно. Більшість людей приходять у повсякденному одязі.'
  },
  {
    id: '2',
    question: 'Де залишити дітей під час богослужіння?',
    answer: 'У нас є дитяче служіння для різних вікових груп, яке проходить одночасно з дорослим богослужінням. Волонтери зустрінуть вас біля входу.'
  },
  {
    id: '3',
    question: 'Чи є парковка біля церкви?',
    answer: 'Так, у нас є безкоштовна парковка біля будівлі церкви. Волонтери допоможуть вам знайти місце для паркування.'
  },
  {
    id: '4',
    question: 'Скільки триває богослужіння?',
    answer: 'Недільне богослужіння зазвичай триває близько 1,5 години і включає час прославлення, проповідь та спільну молитву.'
  },
  {
    id: '5',
    question: 'Чи потрібно бути членом церкви?',
    answer: 'Ні, членство не є обов\'язковим для відвідування. Ми раді всім гостям!'
  },
]
