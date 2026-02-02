import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'

// =========================================
// PROCESS STEP INTERFACE
// =========================================
export interface ProcessStepData {
  id: string
  number?: string
  icon?: string
  image?: string | StaticImageData
  title: string
  description: string
}

// =========================================
// PROCESS VARIANT 1: Floating Cards
// (home-elegant Steps demo style)
// =========================================
export interface ProcessFloatingProps {
  steps: ProcessStepData[]
  floatUp?: boolean
  withShadow?: boolean
  className?: string
}

export const ProcessFloating = ({
  steps,
  floatUp = true,
  withShadow = true,
  className,
}: ProcessFloatingProps) => {
  return (
    <section className={clsx(
      'pb-0 z-10 relative',
      floatUp && 'mt-[-80px] lg:mt-[-120px]',
      className
    )}>
      <div className="container-larexa">
        <div className={clsx(
          'grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded p-4 lg:p-10',
          withShadow && 'shadow-lg'
        )}>
          {steps.map((step) => (
            <div key={step.id} className="feature-box h-full text-center">
              {step.image && (
                <div className="feature-box-icon">
                  <Image src={step.image} alt="" width={80} height={80} className="w-1/4 mx-auto" />
                </div>
              )}
              {step.icon && (
                <div className="feature-box-icon text-4xl text-primary">
                  <i className={step.icon} />
                </div>
              )}
              <h3 className="feature-box-title">{step.title}</h3>
              <p className="feature-box-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// PROCESS VARIANT 2: Numbered Steps
// =========================================
export interface ProcessNumberedProps {
  preTitle?: string
  title?: string
  description?: string
  steps: ProcessStepData[]
  columns?: 2 | 3 | 4
  className?: string
}

export const ProcessNumbered = ({
  preTitle,
  title,
  description,
  steps,
  columns = 3,
  className,
}: ProcessNumberedProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        {(preTitle || title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="title">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
              {description && <p className="mb-0">{description}</p>}
            </div>
          </div>
        )}

        <div className="flex flex-wrap -mx-4">
          {steps.map((step, idx) => (
            <div key={step.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="process-step-advance h-full text-center relative">
                <span className="step-no text-6xl font-bold text-gray-100">
                  {step.number || `0${idx + 1}`}
                </span>
                <h3 className="mt-2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// PROCESS VARIANT 3: Timeline Vertical
// =========================================
export interface ProcessTimelineProps {
  preTitle?: string
  title?: string
  steps: ProcessStepData[]
  className?: string
}

export const ProcessTimeline = ({
  preTitle,
  title,
  steps,
  className,
}: ProcessTimelineProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        {(preTitle || title) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="title">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />
          
          {steps.map((step, idx) => (
            <div key={step.id} className={clsx(
              'flex items-center mb-8 relative',
              idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            )}>
              {/* Content */}
              <div className={clsx(
                'w-full md:w-5/12',
                idx % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
              )}>
                <h4>{step.title}</h4>
                <p className="m-0">{step.description}</p>
              </div>
              
              {/* Center dot */}
              <div className="hidden md:flex w-2/12 justify-center">
                <div className="w-12 h-12 bg-grad rounded-full flex items-center justify-center text-white font-bold z-10">
                  {step.number || idx + 1}
                </div>
              </div>
              
              {/* Spacer */}
              <div className="hidden md:block w-5/12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// PROCESS VARIANT 4: Horizontal with Arrows
// =========================================
export interface ProcessHorizontalProps {
  steps: ProcessStepData[]
  className?: string
}

export const ProcessHorizontal = ({
  steps,
  className,
}: ProcessHorizontalProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap items-start justify-center gap-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className="process-step text-center w-48">
                <div className="w-16 h-16 mx-auto bg-grad rounded-full flex items-center justify-center text-white text-2xl mb-4">
                  {step.icon ? (
                    <i className={step.icon} />
                  ) : (
                    step.number || idx + 1
                  )}
                </div>
                <h5>{step.title}</h5>
                <p className="text-sm">{step.description}</p>
              </div>
              
              {/* Arrow between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block text-gray-300 text-2xl mx-2">
                  <i className="fas fa-arrow-right" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { ProcessNumbered as Process }
export { ProcessFloating as Steps }
export default ProcessNumbered
