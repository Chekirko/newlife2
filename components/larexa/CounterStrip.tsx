interface CounterStripProps {
  items: { value: string; label: string }[]
}

/** Larexa counter band with static figures (no count-up animation). */
export function CounterStrip({ items }: CounterStripProps) {
  return (
    <section className="bg-grad-readable py-6 all-text-white">
      <div className="container-larexa">
        <ul className="grid grid-cols-2 gap-6 text-center md:grid-flow-col md:grid-cols-none md:auto-cols-fr">
          {items.map(item => (
            <li key={item.label}>
              <span className="block font-heading text-h2 font-semibold">{item.value}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
