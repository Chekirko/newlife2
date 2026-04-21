import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Історія | Церква «Нове Життя»',
  description: 'Дізнайтеся більше про історію та пройдений шлях нашої церкви.',
}

const timelineEvents = [
  {
    date: '1992',
    title: 'Зародження церкви',
    description: 'Церква розпочала своє існування, маючи велике бачення: досягати людей Божою любов’ю та служити місту.',
    type: 'list',
    listItems: [
      'Перше недільне богослужіння',
      'Заснування основних служінь',
      'Духовне пробудження в регіоні',
    ],
  },
  {
    date: '1998',
    title: 'Зростання та перша будівля',
    description: 'Після років посилених молитов та пожертвувань, церква придбала свою першу власну будівлю, що дозволило розпочати нові служіння та приймати більше людей.',
    type: 'image',
    image: '/images/ministries-hero.jpg',
  },
  {
    date: '2005',
    title: 'Розширення місії',
    description: 'Відкриття нових інноваційних підходів для служіння людям. Впровадження нових соціальних ініціатив та допомога сім\'ям у кризі.',
    type: 'video',
    videoId: '167434033',
  },
  {
    date: 'Поточний час',
    title: 'Нове бачення на майбутнє',
    description: 'Сьогодні ми є міцною християнською спільнотою, що дивиться в майбутнє з надією та продовжує проповідувати Євангеліє.',
    type: 'accordion',
    accordions: [
      { 
        q: 'Які цілі на наступні роки?', 
        a: 'Створення нових молодіжних просторів, розширення освітніх програм та започаткування нових церков в інших районах.' 
      },
      { 
        q: 'Як можна долучитись?', 
        a: 'Ми завжди раді новим людям! Ви можете відвідати наше найближче богослужіння, долучитися до домашньої групи або одного зі служінь.' 
      }
    ]
  }
]

export default function HistoryPage() {
  return (
    <>
      {/* Hero — fixed shared image, frosted-glass text box */}
      <section
        className="relative h-[350px] lg:h-[450px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/ministries-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Frosted glass card — compact, centered in visible space */}
        <div
          className="relative z-10 text-center mx-6 sm:mx-0 w-full sm:w-auto sm:min-w-[360px] lg:min-w-[480px] px-6 py-4 lg:px-10 lg:py-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(151,199,78,0.15) 0%, rgba(42,185,165,0.15) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-4xl mb-2 leading-tight">
            Історія
          </h1>
          {/* Breadcrumbs */}
          <nav>
            <ol className="flex items-center justify-center gap-1.5 text-white/75 text-xs sm:text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Головна</Link></li>
              <li className="text-white/40">/</li>
              <li className="text-white/75 cursor-default">Про нас</li>
              <li className="text-white/40">/</li>
              <li className="text-white/55">Історія</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-larexa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наш шлях: Історія та Досягнення</h2>
            <p className="text-gray-600 text-lg">
              Подивіться, як Бог діяв через роки, від моменту нашого заснування до сьогодення. Ми раді поділитися з вами ключовими етапами нашого розвитку.
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative px-4 sm:px-0">
            {/* Center Vertical Line (Hidden on mobile) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300 -translate-x-1/2 hidden md:block" />

            {timelineEvents.map((item, idx) => {
              const isEven = idx % 2 === 0
              
              return (
                <div key={idx} className="flex flex-col md:flex-row items-center mb-12 md:mb-16 relative">
                  {/* Left Column */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-10' : 'md:text-right md:order-1'}`}>
                    {(!isEven && (
                      <div className="hidden md:block" /> // Spacer for odd items
                    ))}
                    {(isEven && (
                      <TimelineCard item={item} />
                    ))}
                  </div>

                  {/* Center Dot */}
                  <div className={`hidden md:flex w-2/12 justify-center relative z-10 ${isEven ? '' : 'md:order-2'}`}>
                    <div className="w-6 h-6 rounded-full border-4 border-primary bg-white shadow" />
                  </div>

                  {/* Right Column */}
                  <div className={`w-full md:w-5/12 mt-6 md:mt-0 ${!isEven ? 'md:pl-10 text-left md:order-3' : ''}`}>
                    {(isEven && (
                      <div className="hidden md:block" /> // Spacer for even items
                    ))}
                    {(!isEven && (
                      <TimelineCard item={item} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12 bg-white">
        <div className="container-larexa text-center max-w-3xl mx-auto">
          <h4 className="text-2xl font-bold mb-6">Додайте свою історію до нашого шляху!</h4>
          <Link href="/contact" className="btn btn-grad px-8 py-3 rounded hover:shadow-lg transition-shadow">
            Давайте познайомимось
          </Link>
        </div>
      </section>
    </>
  )
}

function TimelineCard({ item }: { item: any }) {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden text-left hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6 md:p-8">
        <div className="text-sm font-bold text-primary mb-3 float-right bg-primary/10 px-3 py-1 rounded-full">
          {item.date}
        </div>
        <h4 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 clear-none">{item.title}</h4>
        <p className={`text-gray-600 ${item.type !== 'text' ? 'mb-6' : 'mb-0'}`}>
          {item.description}
        </p>

        {/* Dynamic content rendering based on type */}
        {item.type === 'list' && (
          <ul className="space-y-2 mt-2">
            {item.listItems.map((listItem: string, i: number) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-semibold text-xs text-center">
                  0{i + 1}
                </span>
                {listItem}
              </li>
            ))}
          </ul>
        )}

        {item.type === 'accordion' && (
          <div className="space-y-3 mt-4">
            {item.accordions.map((acc: any, i: number) => (
              <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <summary className="cursor-pointer font-semibold px-4 py-3 text-gray-800 flex justify-between items-center outline-none">
                  {acc.q}
                  <span className="transition-transform group-open:rotate-180 text-primary">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-3 pt-1 text-sm text-gray-600 border-t border-gray-200">
                  {acc.a}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {item.type === 'image' && (
          <div className="relative w-full h-[200px] sm:h-[250px]">
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              className="object-cover" 
            />
          </div>
        )}

      {item.type === 'video' && item.videoId && (
        <div className="w-full relative pt-[56.25%]">
          <iframe 
            src={`https://player.vimeo.com/video/${item.videoId}?title=0&byline=0&portrait=0`}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}
