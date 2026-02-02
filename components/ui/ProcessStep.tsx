import { ReactNode } from 'react'
import { clsx } from 'clsx'

// =====================
// Process Step Variants
// =====================
export type ProcessStepVariant = 'default' | 'advance'

// =====================
// Props Interface
// =====================
export interface ProcessStepProps {
  number: string | number
  title: string
  description?: string
  variant?: ProcessStepVariant
  showBorderEnd?: boolean
  showBorderStart?: boolean
  className?: string
}

// =====================
// Process Step Component
// =====================
export const ProcessStep = ({
  number,
  title,
  description,
  variant = 'default',
  showBorderEnd = false,
  showBorderStart = false,
  className,
}: ProcessStepProps) => {
  const isAdvance = variant === 'advance'

  // Default variant
  if (!isAdvance) {
    return (
      <div className={clsx('process', className)}>
        <span className="process-number">{number}</span>
        <h5 className="process-title">{title}</h5>
        {description && <p>{description}</p>}
      </div>
    )
  }

  // Advance variant with circular number
  return (
    <div className={clsx('process-advance text-center', className)}>
      <div className={clsx(
        'process-border',
        showBorderEnd && 'border-end',
        showBorderStart && 'border-start'
      )}>
        <span className="process-number bg-grad">
          {number}
        </span>
      </div>
      <h5 className="process-title mt-3">{title}</h5>
      {description && <p>{description}</p>}
    </div>
  )
}

// =====================
// Process Steps Container
// =====================
export interface ProcessStepsProps {
  children: ReactNode
  variant?: ProcessStepVariant
  className?: string
}

export const ProcessSteps = ({
  children,
  variant = 'default',
  className,
}: ProcessStepsProps) => {
  return (
    <div className={clsx(
      'grid gap-8',
      variant === 'advance' ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {children}
    </div>
  )
}

export default ProcessStep
