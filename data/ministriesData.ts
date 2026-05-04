/**
 * @deprecated This mock data is replaced by Sanity CMS.
 * Please use client.fetch(MINISTRIES_QUERY) instead.
 */
// Shared gallery images for all ministries (using existing images)
const sharedGallery = [
  '/images/ministries/m1.jpg',
  '/images/ministries/m2.jpg',
  '/images/ministries/m3.jpg',
  '/images/ministries/m4.jpg',
  '/images/ministries/m5.jpg',
  '/images/ministries/m6.jpg',
  '/images/ministries/m7.jpg',
]

export const ministriesData = [
  {
    id: '1',
    slug: 'children',
    title: 'Дитяче служіння',
    shortDescription: 'Програми для дітей від 3 до 12 років з біблійними уроками та творчістю.',
    fullDescription: 'Наше дитяче служіння створює безпечне та радісне середовище, де діти вивчають Біблію через інтерактивні заняття, творчість, музику та ігри. Ми віримо, що кожна дитина — це дар Божий, і прагнемо допомогти їм зростати у вірі з раннього віку.',
    image: '/images/ministries/m1.jpg',
    leaderName: 'Олена Коваленко',
    leaderPhoto: '/images/ministries/leaders/olena.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Пустіть дітей і не перешкоджайте їм приходити до Мене, бо таких є Царство Небесне.',
      reference: 'Матвія 19:14'
    }
  },
  {
    id: '2',
    slug: 'youth',
    title: 'Молодіжне служіння',
    shortDescription: 'Щотижневі зустрічі з worship, навчанням та спілкуванням для молоді.',
    fullDescription: 'Молодіжне служіння — це місце, де підлітки та молоді люди віком від 14 до 30 років зустрічаються щоп\'ятниці о 19:00 для прославлення, вивчення Слова Божого та спілкування. Ми організовуємо конференції, виїзди на природу, волонтерські проєкти та спортивні турніри.',
    image: '/images/ministries/m2.jpg',
    leaderName: 'Андрій Савченко',
    leaderPhoto: '/images/ministries/leaders/andriy.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Нехай ніхто не зневажає тебе за молодість твою, але будь взірцем для вірних.',
      reference: '1 Тимофія 4:12'
    }
  },
  {
    id: '3',
    slug: 'women',
    title: 'Жіноче служіння',
    shortDescription: 'Спільнота жінок, які підтримують одна одну у вірі та повсякденному житті.',
    fullDescription: 'Жіноче служіння об\'єднує жінок різного віку для духовного зростання, молитви та взаємопідтримки. Ми проводимо щомісячні зустрічі, біблійні студії, творчі майстер-класи та благодійні заходи.',
    image: '/images/ministries/m3.jpg',
    leaderName: 'Наталія Петренко',
    leaderPhoto: '/images/ministries/leaders/natalia.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Сила та пишність — її одяг, і сміється вона до прийдешнього дня.',
      reference: 'Притчі 31:25'
    }
  },
  {
    id: '4',
    slug: 'men',
    title: 'Чоловіче служіння',
    shortDescription: 'Братерство чоловіків, які зростають як лідери у сім\'ї та суспільстві.',
    fullDescription: 'Чоловіче служіння — це спільнота чоловіків, які прагнуть бути відповідальними батьками, чоловіками та лідерами. Ми зустрічаємося для вивчення Біблії, обговорення практичних питань та спільних активностей.',
    image: '/images/ministries/m4.jpg',
    leaderName: 'Василь Мельник',
    leaderPhoto: '/images/ministries/leaders/vasyl.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Пильнуйте, стійте у вірі, будьте мужні, будьте міцні!',
      reference: '1 Коринтян 16:13'
    }
  },
  {
    id: '5',
    slug: 'worship',
    title: 'Музичне служіння',
    shortDescription: 'Команда прославлення, яка веде церкву у поклонінні Богу.',
    fullDescription: 'Наша команда прославлення складається з музикантів та вокалістів, які служать під час богослужінь та спеціальних подій. Ми репетируємо щотижня та постійно працюємо над зростанням у майстерності та духовному служінні.',
    image: '/images/ministries/m5.jpg',
    leaderName: 'Дмитро Бондаренко',
    leaderPhoto: '/images/ministries/leaders/dmytro.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Співайте Господу нову пісню, співайте Господу, вся земле!',
      reference: 'Псалом 96:1'
    }
  },
  {
    id: '6',
    slug: 'evangelism',
    title: 'Євангелізація',
    shortDescription: 'Місійна діяльність у місті та за його межами.',
    fullDescription: 'Служіння євангелізації організовує вуличні акції, місіонерські поїздки, роздачу літератури та проведення євангелізаційних заходів. Наша мета — донести Благу Вістку до кожної людини в нашому місті та регіоні.',
    image: '/images/ministries/m6.jpg',
    leaderName: 'Ігор Ткаченко',
    leaderPhoto: '/images/ministries/leaders/igor.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Ідіть по цілому світові, та всьому створінню Євангелію проповідуйте!',
      reference: 'Марка 16:15'
    }
  },
  {
    id: '7',
    slug: 'charity',
    title: 'Благодійність',
    shortDescription: 'Допомога нужденним, переселенцям та людям похилого віку.',
    fullDescription: 'Благодійне служіння нашої церкви забезпечує продуктовими наборами малозабезпечені родини, допомагає переселенцям з облаштуванням, відвідує літніх людей та організовує збори речей першої необхідності.',
    image: '/images/ministries/m7.jpg',
    leaderName: 'Марія Шевченко',
    leaderPhoto: '/images/ministries/leaders/maria.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Блаженніший давати, ніж приймати.',
      reference: 'Дії 20:35'
    }
  },
  {
    id: '8',
    slug: 'family',
    title: 'Сімейне служіння',
    shortDescription: 'Підтримка та зміцнення сімейних стосунків через біблійні принципи.',
    fullDescription: 'Сімейне служіння допомагає парам та родинам будувати міцні стосунки на основі Божого Слова. Ми проводимо семінари для пар, сімейні виїзди, консультації та групи підтримки.',
    image: '/images/ministries/m8.jpg',
    leaderName: 'Олександр та Ірина Кравчук',
    leaderPhoto: '/images/ministries/leaders/kravchuk.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'А я та дім мій будемо служити Господеві.',
      reference: 'Ісуса Навина 24:15'
    }
  },
  {
    id: '9',
    slug: 'prayer',
    title: 'Молитовне служіння',
    shortDescription: 'Спільна молитва за церкву, місто, країну та особисті потреби.',
    fullDescription: 'Молитовне служіння — це серце нашої церкви. Ми зустрічаємося щосереди о 18:00 для спільної молитви, а також маємо молитовний ланцюг та групу молитовної підтримки для тих, хто потребує допомоги.',
    image: '/images/ministries/m9.jpg',
    leaderName: 'Тетяна Литвин',
    leaderPhoto: '/images/ministries/leaders/tetyana.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Невпинно моліться!',
      reference: '1 Солунян 5:17'
    }
  },
  {
    id: '10',
    slug: 'media',
    title: 'Медіа служіння',
    shortDescription: 'Трансляції, відео, фото та онлайн-присутність церкви.',
    fullDescription: 'Медіа служіння відповідає за онлайн-трансляції богослужінь, зйомку відео та фото, ведення соціальних мереж та підтримку вебсайту церкви. Ми використовуємо сучасні технології для поширення Євангелія.',
    image: '/images/ministries/m10.jpg',
    leaderName: 'Роман Гнатюк',
    leaderPhoto: '/images/ministries/leaders/roman.jpg',
    gallery: sharedGallery,
    bibleQuote: {
      text: 'Небеса звіщають про Божу славу, а про чин Його рук розповідає небозвід.',
      reference: 'Псалом 19:1'
    }
  },
]
