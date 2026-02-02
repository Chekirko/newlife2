import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Button from './Button'

// =====================
// Props Interface
// =====================
export interface PricingCardProps {
  title: string
  price: string
  currency?: string
  period?: string
  features: string[]
  buttonText?: string
  buttonHref?: string
  onButtonClick?: () => void
  ribbonText?: string
  isDark?: boolean
  isCentered?: boolean
  offer?: string
  className?: string
  children?: ReactNode
}

// =====================
// Pricing Card Component
// =====================
export const PricingCard = ({
  title,
  price,
  currency = '$',
  period = '/mo',
  features,
  buttonText = 'Get Started',
  buttonHref,
  onButtonClick,
  ribbonText,
  isDark = false,
  isCentered = true,
  offer,
  className,
  children,
}: PricingCardProps) => {
  return (
    <div className={clsx(
      'pricing',
      isCentered && 'pricing-center',
      isDark && 'pricing-dark',
      className
    )}>
      <div className="pricing-box">
        {/* Ribbon */}
        {ribbonText && (
          <div className="ribbon">
            <span>{ribbonText}</span>
          </div>
        )}

        {/* Title */}
        <h5>{title}</h5>

        {/* Price */}
        <span className="price">
          <sup>{currency}</sup>
          {price}
        </span>
        {period && <span className="text-gray-600 text-sm">{period}</span>}

        {/* Description / Features */}
        <div className="my-5">
          <ul className="list-none space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <Button
          variant="grad"
          href={buttonHref}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>

        {/* Offer badge */}
        {offer && (
          <div className="offer">{offer}</div>
        )}

        {/* Custom content */}
        {children}
      </div>
    </div>
  )
}

// =====================
// Pricing Card Header Variant (like ServicePackages)
// =====================
export interface PricingCardWithHeaderProps {
  headerTitle: string
  price: string
  currency?: string
  planName: string
  features: string[]
  buttonText?: string
  buttonHref?: string
  offer?: string
  className?: string
}

export const PricingCardWithHeader = ({
  headerTitle,
  price,
  currency = '$',
  planName,
  features,
  buttonText = 'Get it now!',
  buttonHref,
  offer,
  className,
}: PricingCardWithHeaderProps) => {
  return (
    <div className={clsx('rounded overflow-hidden shadow', className)}>
      {/* Header with gradient */}
      <div className="bg-grad text-white p-6">
        <div className="float-left">
          <h2 className="text-white font-bold text-4xl mb-0">
            <span>{currency}</span>{price}
          </h2>
          <div>{planName}</div>
        </div>
        <div className="clearfix" />
      </div>

      {/* Body */}
      <div className="bg-gray-100 p-6 relative">
        <ul className="list-group list-group-borderless my-4">
          {features.map((feature, idx) => (
            <li key={idx} className="list-group-item flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button variant="grad" href={buttonHref}>
          {buttonText}
        </Button>

        {offer && (
          <div className="absolute bottom-10 right-3 text-7xl font-bold text-gray-500/10 select-none">
            {offer}
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingCard
