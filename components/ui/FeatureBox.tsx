import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'

// =====================
// Feature Box Styles
// =====================
export type FeatureBoxStyle = 
  | 'default' 
  | 'style-1' 
  | 'style-2' 
  | 'style-3' 
  | 'style-4' 
  | 'style-5'

export type IconStyle = 'grad' | 'primary' | 'none'

// =====================
// Props Interface
// =====================
export interface FeatureBoxProps {
  icon: ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
  style?: FeatureBoxStyle
  iconStyle?: IconStyle
  isActive?: boolean
  className?: string
}

// =====================
// Style Class Map
// =====================
const styleClasses: Record<FeatureBoxStyle, string> = {
  default: '',
  'style-1': 'f-style-1',
  'style-2': 'f-style-2',
  'style-3': 'f-style-3',
  'style-4': 'f-style-4',
  'style-5': 'f-style-5',
}

const iconStyleClasses: Record<IconStyle, string> = {
  grad: 'icon-grad',
  primary: 'icon-primary',
  none: '',
}

// =====================
// Feature Box Component
// =====================
export const FeatureBox = ({
  icon,
  title,
  description,
  link,
  linkText = 'Know more!',
  style = 'default',
  iconStyle = 'grad',
  isActive = false,
  className,
}: FeatureBoxProps) => {
  return (
    <div
      className={clsx(
        'feature-box h-full',
        styleClasses[style],
        iconStyleClasses[iconStyle],
        isActive && 'active',
        className
      )}
    >
      <div className="feature-box-icon">
        {icon}
      </div>
      <h3 className="feature-box-title">{title}</h3>
      <p className="feature-box-desc">{description}</p>
      {link && (
        <Link href={link} className="mt-3 inline-block">
          {linkText}
        </Link>
      )}
    </div>
  )
}

// =====================
// Feature Box with Icon Component (for Themify/FontAwesome icons)
// =====================
export interface FeatureBoxIconProps extends Omit<FeatureBoxProps, 'icon'> {
  iconClassName: string
}

export const FeatureBoxIcon = ({
  iconClassName,
  ...props
}: FeatureBoxIconProps) => {
  return (
    <FeatureBox
      icon={<i className={iconClassName} />}
      {...props}
    />
  )
}

export default FeatureBox
