import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'

export type ContextBreadcrumbItem = {
  label: ReactNode
  to?: string
  state?: unknown
}

type ContextBreadcrumbsProps = {
  items: ContextBreadcrumbItem[]
  className?: string
}

export function ContextBreadcrumbs({ items, className }: ContextBreadcrumbsProps) {
  return (
    <nav aria-label="Page context" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1

          return (
            <li key={index} className="flex min-w-0 items-center gap-1">
              {index > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" /> : null}
              {item.to && !isLastItem ? (
                <Link
                  to={item.to}
                  state={item.state}
                  className="max-w-[10rem] truncate transition-colors hover:text-slate-800 sm:max-w-[16rem]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLastItem ? 'page' : undefined}
                  className="max-w-[12rem] truncate text-slate-600 sm:max-w-[18rem]"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
