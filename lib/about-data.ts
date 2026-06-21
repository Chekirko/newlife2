// =========================================
// ABOUT PAGE CONTENT — typed fallback + canonical SHAPE for /about.
//
// Same spirit as the homepage `*-data.ts` modules: pure data, no runtime deps.
// The /about page reads its content from the Sanity `aboutPage` singleton via
// `getAboutPage()` (lib/about.ts), which merges CMS values over this fallback
// field-by-field — so an empty CMS field never leaves the page blank, and this
// object is also the single source of the content SHAPE used by the seed script.
//
// History is composed from members' accounts. Beliefs are a curated digest of
// the УЦХВЄ doctrinal statement (chve.org.ua/doctrine). Values and "what to
// expect" are a first draft per common church-site practice — the client edits
// all of this in /studio.
// =========================================

import type { AboutStat } from '@/app/(front)/components/AboutWithStats'

export type { AboutStat }

export interface AboutBelief {
  title: string
  text: string
}

export interface AboutIconItem {
  icon: string // Font Awesome class, e.g. 'fas fa-heart'
  title: string
  text: string
}

export type AboutValueIcon =
  | 'heart' | 'book' | 'spirit' | 'community' | 'mercy' | 'mission'

export interface AboutValue {
  iconKey: AboutValueIcon
  title: string
  text: string
  featured?: boolean // one card is highlighted with the brand gradient
}

export interface AboutContent {
  heroTitle: string
  whoWeAre: {
    preTitle: string
    heading: string
    denomination: string
    missionLabel: string
    mission: string
  }
  history: {
    preTitle: string
    title: string
    paragraphs: string[]
  }
  beliefs: {
    preTitle: string
    title: string
    items: AboutBelief[]
  }
  values: {
    preTitle: string
    title: string
    description: string
    items: AboutValue[]
  }
  whatToExpect: {
    preTitle: string
    title: string
    description: string
    ctaText: string
    items: AboutIconItem[]
  }
  leadership: {
    preTitle: string
    title: string
    intro: string
    ctaText: string
  }
  stats: {
    preTitle: string
    title: string
    description: string
    items: AboutStat[]
  }
  finalCta: {
    title: string
    text: string
    primaryText: string
    secondaryText: string
  }
}

export const ABOUT_FALLBACK: AboutContent = {
  heroTitle: 'Про нас',

  whoWeAre: {
    preTitle: 'Хто ми',
    heading: 'Спільнота, що знаходить щастя в Бозі й дарує його іншим',
    denomination:
      'Церква «Нове Життя» — частина Української Церкви Християн Віри Євангельської (УЦХВЄ), євангельського п’ятидесятницького братства.',
    missionLabel: 'Наша місія',
    mission:
      'Допомагати кожній людині пізнати Бога як джерело істинного щастя, відновлювати сім’ї та служити громаді через практичну любов.',
  },

  history: {
    preTitle: 'Наш шлях',
    title: 'Наша історія',
    paragraphs: [
      'Коріння нашої церкви сягає повоєнних років, коли в Бориславі кілька родин п’ятидесятників та баптистів збиралися по домівках, тісно тримаючись разом. На початку 80-х громада налічувала близько 40 членів і об’єднувала вірян із Борислава, Дрогобича, Трускавця, Стрия, Стебника та навколишніх сіл.',
      'У часи перебудови церква активно звершувала євангелізації — зокрема в Стебнику та в трускавецькому кінотеатрі «Мир». У 1990–91 роках у Бориславі зареєстрували першу церкву; зібрання проходили по домівках віруючих.',
      'З 1996 року церква збиралася в домі на вулиці Весняній, подарованому родиною Соляників. У 1998-му власними силами постав перший Дім молитви, а в 2002-му народилася дочірня церква «Воскресіння».',
      'У 2011 році церкві передали приміщення, де розпочалося служіння реабілітаційного центру, — і саме воно стало початком активного зростання. Попри пожежу 2016 року, церква не лише відновилася, а й розширилася. З 2018-го діють жіноча реабілітація, служіння для ромського народу та філія в Підгородцях, що нині приймає переселенців.',
      'У 2019 році церква придбала приміщення колишнього лікарняного відділення й за два роки переобладнала його під новий, просторий Дім молитви, у якому ми зустрічаємося сьогодні.',
    ],
  },

  beliefs: {
    preTitle: 'Наша віра',
    title: 'У що ми віримо',
    items: [
      {
        title: 'Святе Письмо',
        text: 'Біблія — єдине й достатнє джерело пізнання Бога та спасіння. Ми досліджуємо Слово й нічого не додаємо до нього й не відіймаємо.',
      },
      {
        title: 'Триєдиний Бог',
        text: 'Сповідуємо єдиного Бога у трьох Особах — Отця, Сина і Святого Духа: святого, всемогутнього й люблячого Творця всього.',
      },
      {
        title: 'Ісус Христос',
        text: 'Однороджений Син Божий, народжений від Діви Марії, розп’ятий і воскреслий третього дня — єдиний Спаситель і Господь.',
      },
      {
        title: 'Святий Дух',
        text: 'Третя Особа Трійці, що відроджує, освячує й наділяє дарами. Хрещення Святим Духом супроводжується ознакою інших мов.',
      },
      {
        title: 'Спасіння',
        text: 'Людина спасається не ділами, а вірою в Ісуса Христа — через покаяння й новонародження, отримуючи прощення гріхів як Божий дар.',
      },
      {
        title: 'Водне хрещення',
        text: 'Звершується над тими, хто покаявся й увірував, через повне занурення — як обітниця Богові доброго сумління та нове життя.',
      },
      {
        title: 'Церква',
        text: 'Спільнота викуплених кров’ю Христа з усіх народів; її Голова — Сам Ісус, а основа — Голгофа й зішестя Духа в П’ятидесятницю.',
      },
      {
        title: 'Господня вечеря',
        text: 'Хліб і вино на спомин страждань і смерті Господа, у яких беруть участь члени Тіла Христового.',
      },
      {
        title: 'Сім’я',
        text: 'Шлюб установлений Богом; здорова християнська родина, де діти зростають у Божому Слові, — основа здорової церкви.',
      },
      {
        title: 'Друге пришестя',
        text: 'Очікуємо повернення Ісуса Христа, воскресіння померлих у Христі та вічного життя з Богом на новому небі й новій землі.',
      },
    ],
  },

  values: {
    preTitle: 'Що для нас важливо',
    title: 'Цінності, що нас формують',
    description:
      'Принципи, на яких будується наше служіння, спільнота та щоденне життя віри.',
    items: [
      {
        iconKey: 'heart',
        title: 'Любов до Бога і людей',
        text: 'Усе, що ми робимо, народжується з любові до Бога й щирої турботи про кожну людину.',
      },
      {
        iconKey: 'book',
        title: 'Вірність Писанню',
        text: 'Біблія — наш дороговказ у вірі та щоденному житті.',
      },
      {
        iconKey: 'spirit',
        title: 'Молитва й сила Духа',
        text: 'Віримо, що Бог діє і сьогодні, тож живемо в молитві та залежності від Святого Духа.',
      },
      {
        iconKey: 'community',
        title: 'Жива спільнота',
        text: 'Церква — це родина, де кожен потрібен і ніхто не залишається самотнім.',
      },
      {
        iconKey: 'mercy',
        title: 'Відновлення й милосердя',
        text: 'Бог змінює життя, тож ми служимо залежним і потребуючим через реабілітацію та діла милосердя.',
        featured: true,
      },
      {
        iconKey: 'mission',
        title: 'Звершення місії',
        text: 'Ділимося доброю звісткою про Христа в нашому місті й поза його межами.',
      },
    ],
  },

  whatToExpect: {
    preTitle: 'Вперше у нас?',
    title: 'Чого очікувати',
    description:
      'Ми розуміємо, що перший візит може хвилювати. Ось що на вас чекає.',
    ctaText: 'Розклад і як нас знайти',
    items: [
      {
        icon: 'fas fa-handshake',
        title: 'Тепла зустріч',
        text: 'Вас радо зустрінуть — приходьте такими, якими ви є.',
      },
      {
        icon: 'fas fa-music',
        title: 'Богослужіння',
        text: 'Спільне поклоніння, проповідь Божого Слова та молитва. Триває близько 1,5–2 годин.',
      },
      {
        icon: 'fas fa-child',
        title: 'Для дітей',
        text: 'Під час служіння діти мають власні заняття в безпечній і теплій атмосфері.',
      },
      {
        icon: 'fas fa-shirt',
        title: 'Як одягатися',
        text: 'Дрес-коду немає — приходьте в зручному для вас одязі.',
      },
      {
        icon: 'fas fa-location-dot',
        title: 'Як нас знайти',
        text: 'Адресу, розклад богослужінь і мапу дивіться на сторінці контактів.',
      },
    ],
  },

  leadership: {
    preTitle: 'Служителі',
    title: 'Наше керівництво',
    intro:
      'Церкву ведуть рукопокладені служителі — пастори, диякони та відповідальні за різні напрями служіння, які з любов’ю піклуються про спільноту.',
    ctaText: 'Познайомитися з командою',
  },

  stats: {
    preTitle: 'Церква в цифрах',
    title: 'Кілька штрихів про нас',
    description:
      'За роки служіння Бог зробив чимало — і ми вдячні бути частиною цієї історії.',
    items: [
      { value: '19+', label: 'Років служіння' },
      { value: '350+', label: 'Членів церкви' },
      { value: '6', label: 'Служінь' },
      { value: '50+', label: 'Волонтерів' },
    ],
  },

  finalCta: {
    title: 'Готові зробити наступний крок?',
    text: 'Будемо раді познайомитися з вами особисто. Заплануйте свій перший візит або напишіть нам.',
    primaryText: 'Запланувати візит',
    secondaryText: 'Наші служіння',
  },
}
