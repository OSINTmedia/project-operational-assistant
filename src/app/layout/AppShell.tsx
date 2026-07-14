import {
  BriefcaseBusiness,
  ChartColumn,
  FolderKanban,
  PlaySquare,
  Users,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { DemoRoleSwitcher } from '../../features/demo/DemoRoleSwitcher'
import { appNavigation } from '../../shared/constants/navigation'
import { cn } from '../../shared/utils/cn'
import { useDemoAppState } from '../state/useDemoAppState'

const iconMap = {
  dashboard: ChartColumn,
  personal: BriefcaseBusiness,
  projects: FolderKanban,
  teams: Users,
  demo: PlaySquare,
} as const

export function AppShell() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const selectedRole = useDemoAppState((state) => state.selectedRole)
  const isSeedDataInitialized = useDemoAppState((state) => state.isSeedDataInitialized)
  const setSelectedRole = useDemoAppState((state) => state.setSelectedRole)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-slate-100 sm:px-5 lg:border-b-0 lg:border-r lg:border-slate-800 lg:py-6">
          <div className="grid gap-4 lg:block">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Portfolio MVP
              </p>
              <h1 className="mt-2 text-lg font-semibold leading-7 text-white sm:text-xl">
                Project Operational Assistant
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 lg:max-w-none">
                Foundation shell for a local-first operational dashboard demo.
              </p>
            </div>
            <div className="max-w-full lg:mt-6">
              <DemoRoleSwitcher
                demoUsers={demoUsers}
                currentUserId={currentUserId}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                variant="sidebar"
                description="Switching roles changes only local demo identity. No real authentication is used."
              />
            </div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-6 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
            {appNavigation.map((item) => {
              const Icon = iconMap[item.icon]

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors lg:shrink',
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
          <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Demo Lifecycle
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {isSeedDataInitialized
                    ? 'Local demo data is initialized and ready in browser storage.'
                    : 'Local demo bootstrap has not completed yet.'}
                </p>
              </div>
              <div className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:w-auto">
                Real authentication intentionally excluded
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
