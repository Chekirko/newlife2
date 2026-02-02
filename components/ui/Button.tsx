import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import { clsx } from 'clsx'

// =====================
// Button Variants & Sizes
// =====================
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'
  | 'white'
  | 'grad'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-dark'
  | 'outline-light'
  | 'outline-white'
  | 'outline-grad'
  | 'link'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

// =====================
// Props Interface
// =====================
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  round?: boolean
  icon?: ReactNode
  children?: ReactNode
  className?: string
  href?: string
  as?: 'button' | 'a'
}

// =====================
// Variant Class Map
// =====================
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  danger: 'btn-danger',
  warning: 'btn-warning',
  info: 'btn-info',
  dark: 'btn-dark',
  light: 'btn-light',
  white: 'btn-white',
  grad: 'btn-grad',
  'outline-primary': 'btn-outline-primary',
  'outline-secondary': 'btn-outline-secondary',
  'outline-dark': 'btn-outline-dark',
  'outline-light': 'btn-outline-light',
  'outline-white': 'btn-outline-white',
  'outline-grad': 'btn-outline-grad',
  link: 'btn-link',
}

// =====================
// Size Class Map
// =====================
const sizeClasses: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

// =====================
// Button Component
// =====================
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      round = false,
      icon,
      children,
      className,
      href,
      as = 'button',
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'btn',
      variantClasses[variant],
      sizeClasses[size],
      round && 'btn-round',
      className
    )

    // If href is provided or as='a', render as anchor
    if (href || as === 'a') {
      return (
        <a href={href} className={classes}>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
