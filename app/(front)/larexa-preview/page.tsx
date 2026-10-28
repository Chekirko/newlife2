// Larexa component showcase for Phases 4–5 review; delete before launch (master-plan §F).
import { Accordion } from '@/components/larexa/Accordion'
import { ActionBox } from '@/components/larexa/ActionBox'
import { CounterStrip } from '@/components/larexa/CounterStrip'
import { FeatureBox } from '@/components/larexa/FeatureBox'
import { PageTitle } from '@/components/larexa/PageTitle'
import { Pagination } from '@/components/larexa/Pagination'
import { PostCard } from '@/components/larexa/PostCard'
import { SectionTitle } from '@/components/larexa/SectionTitle'
import { SidebarWidget } from '@/components/larexa/SidebarWidget'
import { SnapRow } from '@/components/larexa/SnapRow'
import { TeamItem } from '@/components/larexa/TeamItem'
import { Timeline } from '@/components/larexa/Timeline'
import Image from '@/components/ui/SiteImage'

export const metadata = { title: 'Larexa preview', robots: { index: false } }

const posts = [
  { title: 'Молодіжна конференція «Світло»', tag: 'Молодь', image: '/images/action2.jpg' },
  { title: 'Різдвяне богослужіння та спільний обід', tag: 'Свята', image: '/images/action3.jpg' },
  { title: 'Хрещення у водах річки Тисмениця', tag: 'Події', image: null },
  { title: 'Зустріч домашніх груп після літньої перерви', tag: 'Групи', image: '/images/action4.jpg' },
]

export default function LarexaPreviewPage() {
  return <>
    <PageTitle title="Прев'ю Larexa" subtitle="Тимчасова сторінка для перевірки компонентів Фази 4"
      image="/images/ministries-hero.jpg"
      breadcrumbs={[{ label: 'Головна', href: '/' }, { label: 'Про нас', href: '/about' }, { label: 'Прев\'ю' }]} />

    <section>
      <div className="container-larexa">
        <SectionTitle className="text-center" preTitle="Що ви знайдете" title="Служіння для кожного"
          text="Ми віримо, що кожна людина має місце в церковній родині — від найменших до найстарших." />
        <div className="grid gap-[30px] md:grid-cols-3">
          <FeatureBox icon="fas fa-music" title="Прославлення" text="Живе поклоніння щонеділі разом із командою прославлення." />
          <FeatureBox icon="fas fa-child" title="Дитяче служіння" text="Безпечне місце, де діти пізнають Бога через гру й історії." />
          <FeatureBox icon="fas fa-users" title="Домашні групи" text="Невеликі зустрічі посеред тижня для молитви й спілкування." style={5} />
        </div>
      </div>
    </section>

    <section className="bg-gray-100">
      <div className="container-larexa">
        <SectionTitle className="text-center" preTitle="Новини" title="Що нового в церкві" />
        <SnapRow label="Новини">
          {posts.map((post, index) => <PostCard key={index} href="/news" date="2026-10-12T10:00:00Z"
            excerpt="Коротко про подію: хто, коли й чому варто прийти. Текст обрізається природно." {...post} />)}
        </SnapRow>
      </div>
    </section>

    <section>
      <div className="container-larexa grid gap-[30px] lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostCard as="h2" href="/news" image="/images/action5.jpg" tag="Проповідь" date="2026-09-28T08:00:00Z"
            meta="10:00" title="Велика картка в списку новин" excerpt="Варіант для сторінки /news з правою колонкою."
            sizes="(max-width: 991px) 100vw, 760px" />
          <PostCard as="h2" image="/images/action6.jpg" tag="Відео" date="2026-09-21T08:00:00Z"
            title="Відео-картка без детальної сторінки" video={{ youtubeId: 'dQw4w9WgXcQ' }} sizes="(max-width: 991px) 100vw, 760px" />
          <Pagination basePath="/news" page={3} total={8} label="Сторінки новин" />
        </div>
        <aside>
          <SidebarWidget title="Категорії">
            <p>Молодь · Свята · Події</p>
          </SidebarWidget>
          <SidebarWidget title="Маєте питання?" className="rounded border-0 bg-gray-100 p-4">
            <p>Напишіть нам — відповімо протягом дня.</p>
          </SidebarWidget>
        </aside>
      </div>
    </section>

    <section>
      <div className="container-larexa grid gap-[30px] lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle title="Часті питання" />
          <Accordion name="preview-faq" items={[
            { q: 'Коли відбуваються богослужіння?', a: 'Щонеділі о 10:00 та в середу о 18:30.' },
            { q: 'Чи можна прийти з дітьми?', a: 'Так, під час служіння працює дитяча кімната.' },
            { q: 'Як долучитися до служіння?', a: 'Поговоріть із пастором після зібрання або напишіть нам.' },
          ]} />
        </div>
        <aside>
          <SidebarWidget as="h3" title="Маєте питання?" className="rounded border-0 bg-gray-100 p-4">
            <p className="mb-0">Телефонуйте або пишіть у Telegram.</p>
          </SidebarWidget>
        </aside>
      </div>
    </section>

    <CounterStrip items={[
      { value: '30+', label: 'років служіння' }, { value: '250', label: 'членів церкви' },
      { value: '12', label: 'служінь' }, { value: '8', label: 'домашніх груп' },
    ]} />

    <section>
      <div className="container-larexa">
        <SectionTitle className="text-center" title="Історія церкви" />
        <Timeline items={[
          { date: '1993', title: 'Перші зібрання', text: 'Невелика група вірян почала збиратися в домівках.' },
          { date: '2001', title: 'Власна будівля', text: 'Громада освятила дім молитви.',
            media: <div className="relative aspect-video"><Image src="/images/vision1.jpg" alt="Освячення дому молитви" fill sizes="(max-width: 767px) 100vw, 540px" className="object-cover" /></div> },
          { date: '2015', title: 'Молодіжне служіння', text: 'Стартувала щотижнева молодіжна зустріч.' },
        ]} />
      </div>
    </section>

    <section>
      <div className="container-larexa">
        <SectionTitle className="text-center" title="Команда" />
        <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
          <TeamItem href="/team" photo="/images/pastor-welcome.jpg" name="Іван Петренко" position="Старший пастор" />
          <TeamItem href="/team" photo={null} name="Марія Коваль" position="Дитяче служіння" />
        </div>
      </div>
    </section>

    <ActionBox title="Приходьте в неділю о 10:00" text="Ми будемо раді познайомитися з вами особисто." cta={{ label: 'Як нас знайти', href: '/contact' }} />

    <section className="bg-grad-readable pattern-overlay-2">
      <div className="container-larexa">
        <SectionTitle light className="text-center mb-0 pb-0" preTitle="Розклад" title="Світла секція з візерунком" text="Перевірка title-light та pattern-overlay-2." />
      </div>
    </section>
  </>
}
