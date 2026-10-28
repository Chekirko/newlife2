import Link from 'next/link'

interface ActionBoxProps {
  title: string
  text?: string
  cta: { label: string; href: string }
}

/** Larexa ActionBox3: a rounded gradient band with a call to action inside the container. */
export function ActionBox({ title, text, cta }: ActionBoxProps) {
  return (
    <section>
      <div className="container-larexa">
        <div className="bg-grad-readable pattern-overlay-2 all-text-white overflow-hidden rounded p-6 text-center sm:p-12 md:flex md:items-center md:gap-8 md:text-left">
          <div>
            <h2 className="text-h3">{title}</h2>
            {text && <p className="mb-0">{text}</p>}
          </div>
          <Link href={cta.href} className="btn btn-white mt-4 shrink-0 md:mt-0 md:ml-auto">{cta.label}</Link>
        </div>
      </div>
    </section>
  )
}
