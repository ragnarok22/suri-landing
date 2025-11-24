import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-emerald-600 dark:hover:bg-emerald-500',
        destructive:
          'bg-red-600 text-red-50 hover:bg-red-700/90 dark:bg-red-700 dark:hover:bg-red-600',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-white',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-slate-700 dark:hover:bg-slate-600',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800 dark:text-slate-200',
        link: 'underline-offset-4 hover:underline text-primary dark:text-emerald-400',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // const Comp = asChild ? 'div' : 'button'
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
