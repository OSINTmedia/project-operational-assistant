import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type BadgeVariant =
  | 'neutral'
  | 'accent'
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'violet'

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  accent: 'border-teal-200 bg-teal-50 text-teal-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  warning: 'border-orange-200 bg-orange-50 text-orange-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
}

type BadgeProps = {
  children: ReactNode
  className?: string
  variant?: BadgeVariant
}

export function Badge({ children, className, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 max-w-full items-center rounded-full border px-3 py-1 text-left text-xs font-medium leading-tight break-words whitespace-normal',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
