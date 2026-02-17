import {
  // Hero variants
  HeroSlider,
  HeroGradientImage,
  type HeroSlide,
  // About variants
  AboutWithStats,
  // Testimonials
  TestimonialsGrid,
  type TestimonialData,
  // FAQ
  FAQSplit,
  type FAQItem,
  // ActionBox
  ActionBoxFullWidth,
} from '@/components'
import { PastorGreeting } from '@/components/sections/PastorGreeting'
import { OurVision } from '@/components/sections/OurVision'
import { Ministries, type MinistryItem } from '@/components/sections/Ministries'
import { EventsSlider, type EventItem } from '@/components/sections/EventsSlider'
import { NewsSlider, type NewsItem } from '@/components/sections/NewsSlider'

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

      {/* EVENTS - EventsSlider (під Hero) */}
      <EventsSlider
        preTitle="Не пропустіть"
        title="Найближчі події"
        description="Анонси подій та заходів нашої церкви"
        events={eventsData}
        className="bg-gray-100"
      />

      {/* OUR VISION - Before Pastor Greeting */}
      <OurVision
        preTitle="Хто ми"
        title="Люди, які знаходять Щастя і  дарують Його іншим"
        subtitle="Церква «Нове Життя» — це спільнота людей, які вірять у силу Божої любові та прагнуть ділитися нею з кожним."
        visionHighlight="Наша місія —"
        visionText="Допомагати кожній людині пізнати Бога як джерело істинного Щастя, відновлювати сім'ї та служити громаді через практичну любов, змінюючи атмосферу в Україні."
        image1="/images/vision1.jpg"
        image2="/images/vision2.jpg"
      />

      {/* PASTOR WELCOME - PastorGreeting з Larexa demo style */}
      <PastorGreeting
        preTitle="Вітання пастора"
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

      {/* WHAT YOU'LL FIND - Що ви знайдете в церкві */}
      <Ministries
        preTitle="Що ви знайдете"
        title="Більше, ніж просто церква"
        description="Церква — це місце, де кожен може знайти спільноту, підтримку та духовне зростання."
        items={whatYouFindItems}
        columns={3}
        className="bg-gray-100"
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

      {/* NEWS - NewsSlider (після розкладу богослужінь) */}
      <NewsSlider
        preTitle="Останні новини"
        title="Що нового в церкві"
        description="Новини та оновлення з життя нашої спільноти"
        news={newsData}
        className="bg-gray-50"
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
// DATA - What You'll Find Items
// ============================================
const whatYouFindItems: MinistryItem[] = [
  {
    icon: 'fas fa-book-bible',
    title: 'Проповідь Слова Божого',
    description: 'Зрозуміле викладання Біблії, яке допомагає застосувати біблійні принципи у повсякденному житті та дає відповіді на важливі питання.',
    image: '/images/action1.jpg',
  },
  {
    icon: 'fas fa-music',
    title: 'Прославлення',
    description: 'Жива музика, щирі пісні та атмосфера Божої присутності, де ви можете вільно висловити свою любов до Бога.',
    image: '/images/action2.jpg',
  },
  {
    icon: 'fas fa-heart',
    title: 'Дружня спільнота',
    description: 'Теплі стосунки, щира дружба та люди, які стануть для вас справжньою сім’єю у вірі.',
    image: '/images/action3.jpg',
  },
  {
    icon: 'fas fa-hands-helping',
    title: 'Практична допомога',
    description: 'Підтримка у складних життєвих ситуаціях: душпастирська опіка, матеріальна допомога та молитвенна підтримка.',
    image: '/images/action4.jpg',
  },
  {
    icon: 'fas fa-child',
    title: 'Робота з молоддю та дітьми',
    description: 'Цікаві програми для молоді та дітей, де вони можуть розвиватися, дружити та пізнавати Бога.',
    image: '/images/action5.jpg',
  },
  {
    icon: 'fas fa-door-open',
    title: 'Атмосфера прийняття',
    description: 'Місце, де вас приймуть такими, якими ви є, без осуду. Божа любов для кожного.',
    image: '/images/action6.jpg',
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
// DATA - Events (for EventsSlider)
// ============================================
const eventsData: EventItem[] = [
  {
    id: '1',
    title: 'Великодній концерт',
    image: '/images/event1.jpg',
    date: '20 квітня 2026',
    tag: 'Подія',
    description: 'Святковий концерт до Великодня з участю церковного хору та запрошених гостей.',
    href: '/events/easter-concert'
  },
  {
    id: '2',
    title: 'Молодіжна конференція',
    image: '/images/event2.jpg',
    date: '15-17 травня 2026',
    tag: 'Конференція',
    description: 'Три дні натхнення, навчання та спілкування для молоді з усієї України.',
    href: '/events/youth-conference'
  },
  {
    id: '3',
    title: 'Сімейний пікнік',
    image: '/images/event3.jpg',
    date: '1 червня 2026',
    tag: 'Родина',
    description: 'Спільний відпочинок на природі для всієї родини з іграми та смачною їжею.',
    href: '/events/family-picnic'
  },
  {
    id: '4',
    title: 'Біблійна школа',
    image: '/images/event4.jpg',
    date: 'Щосуботи о 16:00',
    tag: 'Навчання',
    description: 'Курс "Основи віри" для тих, хто хоче глибше пізнати Слово Боже.',
    href: '/events/bible-school'
  },
]

// ============================================
// DATA - News (for NewsSlider)
// ============================================
const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Підсумки місіонерської поїздки до Молдови',
    date: '28 січня 2026',
    mainCategory: 'Місія',
    categories: ['Служіння', 'Звіти'],
    text: 'Наша команда повернулася з місіонерської поїздки до Молдови. Ми відвідали три села, провели дитячі програми, роздавали гуманітарну допомогу та ділилися Євангелієм. Дякуємо всім, хто підтримав цю поїздку молитвами та пожертвами.',
    image: '/images/news1.jpg',
    href: '/news/mission-trip'
  },
  {
    id: '2',
    title: 'Новий курс біблійної школи стартує у лютому',
    date: '25 січня 2026',
    mainCategory: 'Навчання',
    categories: ['Біблійна школа'],
    text: 'Запрошуємо на новий курс для тих, хто хоче глибше пізнати Слово Боже. Курс розрахований на 12 тижнів і охоплює основи християнської віри, вивчення Старого та Нового Заповітів.',
    image: '/images/news2.jpg',
    href: '/news/bible-school'
  },
  {
    id: '3',
    title: 'Різдвяні благодійні заходи: результати',
    date: '20 січня 2026',
    mainCategory: 'Служіння',
    categories: ['Благодійність'],
    text: 'Дякуємо всім, хто долучився до різдвяних благодійних заходів. Разом ми зібрали понад 500 подарунків для дітей з малозабезпечених родин та передали продуктові набори для людей похилого віку.',
    image: '/images/news3.jpg',
    href: '/news/christmas-charity'
  },
  {
    id: '4',
    title: 'Молодіжне зібрання: нові формати спілкування',
    date: '15 січня 2026',
    mainCategory: 'Молодь',
    categories: ['Спілкування'],
    text: 'Наша молодіжна група впроваджує нові формати зустрічей. Тепер кожну другу п\'ятницю ми проводимо тематичні вечори з дискусіями, настільними іграми та спільною вечерею.',
    image: '/images/news4.jpg',
    href: '/news/youth-meetings'
  },
  {
    id: '5',
    title: 'Хор церкви виступив на міському фестивалі',
    date: '10 січня 2026',
    mainCategory: 'Культура',
    categories: ['Хор', 'Події'],
    text: 'Церковний хор взяв участь у міському різдвяному фестивалі та виконав програму з колядок та духовних пісень. Виступ зібрав понад 300 глядачів і став справжнім свідченням Божої любові.',
    image: '/images/news5.jpg',
    href: '/news/choir-festival'
  },
  {
    id: '6',
    title: 'Волонтерський проєкт: допомога переселенцям',
    date: '5 січня 2026',
    mainCategory: 'Волонтерство',
    categories: ['Допомога', 'Служіння'],
    text: 'Волонтери нашої церкви продовжують допомагати родинам переселенців. За останній місяць ми забезпечили житлом дві родини та допомогли з працевлаштуванням п\'яти людям.',
    image: '/images/news6.jpg',
    href: '/news/volunteer-project'
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
