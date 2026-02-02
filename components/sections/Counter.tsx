'use client'

import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'

// =====================
// Counter Item Interface
// =====================
export interface CounterItem {
  value: number
  suffix?: string
  prefix?: string
  title: string
  icon?: string
}

// =====================
// Counter Props
// =====================
export interface CounterProps {
  items: CounterItem[]
  duration?: number
  className?: string
}

// =====================
// Single Counter Component
// =====================
const CounterNumber = ({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2000 
}: { 
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          
          const startTime = Date.now()
          const endTime = startTime + duration
          
          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            
            setCount(Math.floor(easeProgress * value))
            
            if (now < endTime) {
              requestAnimationFrame(animate)
            } else {
              setCount(value)
            }
          }
          
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className="font-bold">
      {prefix}{count}{suffix}
    </span>
  )
}

// =====================
// Counter Section Component
// =====================
export const Counter = ({
  items,
  duration = 2000,
  className,
}: CounterProps) => {
  return (
    <div className={clsx(
      'grid grid-cols-2 md:grid-cols-4 gap-6',
      className
    )}>
      {items.map((item, idx) => (
        <div key={idx} className="text-center">
          {item.icon && (
            <div className="text-4xl text-primary mb-3">
              <i className={item.icon} />
            </div>
          )}
          <div className="text-4xl lg:text-5xl text-gray-800 mb-2">
            <CounterNumber 
              value={item.value} 
              suffix={item.suffix}
              prefix={item.prefix}
              duration={duration}
            />
          </div>
          <p className="text-gray-600 m-0">{item.title}</p>
        </div>
      ))}
    </div>
  )
}

// =====================
// Results Section (Counter with gradient bg)
// =====================
export interface ResultsProps extends CounterProps {
  isDark?: boolean
  isGradient?: boolean
}

export const Results = ({
  items,
  duration = 2000,
  isDark = false,
  isGradient = false,
  className,
}: ResultsProps) => {
  return (
    <section className={clsx(
      'py-12',
      isGradient && 'bg-grad all-text-white',
      isDark && !isGradient && 'bg-gray-800 all-text-white',
      className
    )}>
      <div className="container-larexa">
        <Counter items={items} duration={duration} />
      </div>
    </section>
  )
}

export default Counter
