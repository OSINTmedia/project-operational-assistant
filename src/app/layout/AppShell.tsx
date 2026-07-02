import {
  BriefcaseBusiness,
  ChartColumn,
  FolderKanban,
  PlaySquare,
  Users,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { appNavigation } from '../../shared/constants/navigation'
import { cn } from '../../shared/utils/cn'

const iconMap = {
  dashboard: ChartColumn,
  personal: BriefcaseBusiness,
  projects: FolderKanban,
  teams: Users,
  demo: PlaySquare,
} as const

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-950 px-5 py-6 text-slate-100 lg:border-b-0 lg:border-r lg:border-slate-800">
          <div className="flex items-start justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Portfolio MVP
              </p>
              <h1 className="mt-2 text-xl font-semibold text-white">
                Project Operational Assistant
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Foundation shell for a local-first operational dashboard demo.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300 lg:mt-6">
              <p className="font-medium text-slate-100">Role switch</p>
              <p className="mt-1 text-slate-400">Placeholder only</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Manager', 'Project Manager', 'User'].map((role, index) => (
                  <button
                    key={role}
                    type="button"
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-xs transition-colors',
                      index === 0
                        ? 'border-accent bg-accent text-white'
                        : 'border-slate-700 bg-slate-950 text-slate-300',
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <nav className="mt-6 grid gap-1">
            {appNavigation.map((item) => {
              const Icon = iconMap[item.icon]

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors',
                      isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Environment Foundation
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  React + TypeScript + Vite + Tailwind + HashRouter scaffold.
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                Business logic intentionally deferred
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
