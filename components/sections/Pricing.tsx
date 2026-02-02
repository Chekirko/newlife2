'use client'

import { useState, ReactNode } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'

// =========================================
// PRICING PLAN INTERFACE
// =========================================
export interface PricingPlan {
  id: string
  name: string
  price: number | string
  currency?: string
  period?: string
  description?: string
  features?: string[]
  buttonText?: string
  buttonHref?: string
  isPopular?: boolean
  ribbonText?: string
  discount?: string
}

// =========================================
// PRICING VARIANT 1: Center Grid
// (landing-trendy demo style)
// =========================================
export interface PricingSectionProps {
  title?: string
  description?: string
  plans: PricingPlan[]
  bottomText?: string
  columns?: 2 | 3 | 4
  className?: string
}

export const PricingSection = ({
  title,
  description,
  plans,
  bottomText,
  columns = 3,
  className,
}: PricingSectionProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={clsx('pricing pricing-center', className)}>
      <div className="container-larexa">
        {(title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}

        <div className="flex flex-wrap -mx-4">
          {plans.map((plan) => (
            <div key={plan.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className={clsx(
                'pricing-box h-full relative',
                plan.isPopular && 'shadow-lg border-0'
              )}>
                {plan.isPopular && plan.ribbonText && (
                  <div className="ribbon">
                    <span>{plan.ribbonText}</span>
                  </div>
                )}
                
                <h5>{plan.name}</h5>
                <div className="plan-price">
                  <span className="price text-grad">
                    <sup className="text-grad">{plan.currency || '$'}</sup>
                    {plan.price}
                  </span>
                  {plan.period && <span> /{plan.period}</span>}
                </div>
                
                {plan.description && <p>{plan.description}</p>}
                
                {plan.features && plan.features.length > 0 && (
                  <ul className="list-none space-y-2 my-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <i className="fa fa-check text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                <Link 
                  href={plan.buttonHref || '#'} 
                  className={clsx(
                    'btn mt-4',
                    plan.isPopular ? 'btn-grad' : 'btn-outline-light'
                  )}
                >
                  {plan.buttonText || 'Order now!'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {bottomText && (
          <div className="max-w-3xl mx-auto text-center mt-4">
            <h6>{bottomText}</h6>
          </div>
        )}
      </div>
    </section>
  )
}

// =========================================
// PRICING VARIANT 2: With Tabs
// (home ServicePackages demo style)
// =========================================
export interface PricingTabsProps {
  preTitle?: string
  title?: string
  description?: string
  description2?: string
  tabs: {
    id: string
    label: string
    plan: PricingPlan
  }[]
  className?: string
}

export const PricingTabs = ({
  preTitle,
  title,
  description,
  description2,
  tabs,
  className,
}: PricingTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)
  const activePlan = tabs.find(t => t.id === activeTab)?.plan

  return (
    <section className={clsx('package pt-10', className)}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {/* Left content */}
          <div className="w-full md:w-7/12 px-4">
            <div className="title text-left">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
              {description && <p>{description}</p>}
              {description2 && <p>{description2}</p>}
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'px-6 py-2 rounded-t border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'bg-grad text-white border-transparent'
                      : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right pricing card */}
          <div className="w-full md:w-5/12 px-4 mt-6 md:mt-0">
            {activePlan && (
              <div className="bg-white border rounded shadow overflow-hidden">
                <div className="bg-grad text-white p-6">
                  <h2 className="text-white font-bold text-4xl mb-0">
                    <span>{activePlan.currency || '$'}</span>
                    {activePlan.price}
                  </h2>
                  <div>{activePlan.name}</div>
                </div>
                <div className="bg-gray-100 p-6">
                  {activePlan.features && (
                    <ul className="list-group list-group-borderless my-4">
                      {activePlan.features.map((feature, idx) => (
                        <li key={idx} className="list-group-item flex items-center gap-2">
                          <i className="fa fa-check text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={activePlan.buttonHref || '#'} className="btn btn-grad">
                    {activePlan.buttonText || 'Get it now!'}
                  </Link>
                  {activePlan.discount && (
                    <div className="offer">{activePlan.discount}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// PRICING VARIANT 3: Toggle Monthly/Yearly
// =========================================
export interface PricingToggleProps {
  title?: string
  monthlyPlans: PricingPlan[]
  yearlyPlans: PricingPlan[]
  monthlyLabel?: string
  yearlyLabel?: string
  columns?: 2 | 3 | 4
  className?: string
}

export const PricingToggle = ({
  title,
  monthlyPlans,
  yearlyPlans,
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  columns = 3,
  className,
}: PricingToggleProps) => {
  const [isYearly, setIsYearly] = useState(false)
  const plans = isYearly ? yearlyPlans : monthlyPlans

  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={clsx('pricing', className)}>
      <div className="container-larexa">
        {title && (
          <div className="text-center mb-6">
            <h2>{title}</h2>
          </div>
        )}

        {/* Toggle */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <span className={!isYearly ? 'font-bold' : ''}>{monthlyLabel}</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={clsx(
              'w-16 h-8 rounded-full relative transition-colors',
              isYearly ? 'bg-primary' : 'bg-gray-300'
            )}
          >
            <span className={clsx(
              'absolute w-6 h-6 bg-white rounded-full top-1 transition-all',
              isYearly ? 'right-1' : 'left-1'
            )} />
          </button>
          <span className={isYearly ? 'font-bold' : ''}>{yearlyLabel}</span>
        </div>

        <div className="flex flex-wrap -mx-4">
          {plans.map((plan) => (
            <div key={plan.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className={clsx(
                'pricing-box h-full text-center',
                plan.isPopular && 'shadow-lg border-primary'
              )}>
                {plan.isPopular && (
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm absolute -top-3 left-1/2 -translate-x-1/2">
                    Popular
                  </span>
                )}
                
                <h5 className="mt-4">{plan.name}</h5>
                <div className="plan-price my-4">
                  <span className="price text-4xl font-bold text-grad">
                    {plan.currency || '$'}{plan.price}
                  </span>
                  {plan.period && <span className="text-gray-500">/{plan.period}</span>}
                </div>
                
                {plan.features && (
                  <ul className="list-none space-y-2 my-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
                
                <Link 
                  href={plan.buttonHref || '#'} 
                  className={clsx('btn', plan.isPopular ? 'btn-grad' : 'btn-outline-dark')}
                >
                  {plan.buttonText || 'Get Started'}
                </Link>
              </div>
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
export { PricingSection as Pricing }
export default PricingSection
