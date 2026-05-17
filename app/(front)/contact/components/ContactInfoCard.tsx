// =========================================
// ContactInfoCard — Reusable contact info block
// Used on: Contact page (address, email, phone, schedule)
// =========================================

interface ContactInfoCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

export function ContactInfoCard({ icon, title, children }: ContactInfoCardProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{
          background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
        }}
      >
        {icon}
      </div>
      <h5 className="text-white font-heading font-semibold text-lg mb-2">{title}</h5>
      <div className="text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default ContactInfoCard
