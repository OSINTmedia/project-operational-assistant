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
import { USER_ROLE_LABELS } from '../../shared/types'
import { cn } from '../../shared/utils/cn'
import { getCurrentDemoUser, useDemoAppState } from '../state/useDemoAppState'

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
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const currentRoleLabel = currentUser
    ? USER_ROLE_LABELS[currentUser.role]
    : selectedRole
      ? USER_ROLE_LABELS[selectedRole]
      : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-950 px-3 py-3 text-slate-100 sm:px-4 lg:border-b-0 lg:border-r lg:border-slate-800 lg:py-5">
          <div className="grid gap-2.5 lg:block">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Portfolio MVP
              </p>
              <h1 className="mt-1 text-base font-semibold leading-6 text-white sm:text-lg sm:leading-7">
                Project Operational Assistant
              </h1>
              <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-slate-400 sm:block lg:max-w-none">
                Local-first workspace for project issue clarity.
              </p>
            </div>
            <div className="max-w-full lg:mt-4">
              <DemoRoleSwitcher
                demoUsers={demoUsers}
                currentUserId={currentUserId}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                variant="sidebar"
                title="Perspective"
              />
            </div>
          </div>

          <nav
            aria-label="Primary"
            className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:mt-5 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0"
          >
            {appNavigation.map((item) => {
              const Icon = iconMap[item.icon]

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors lg:shrink lg:py-2.5',
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
          <header className="border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur sm:px-6 sm:py-2.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accentSoft text-xs font-semibold text-accent">
                  {currentUser?.avatarInitials ?? 'PO'}
                </span>
                <div className="min-w-0">
                  <p className="sr-only">Current demo perspective</p>
                  <p className="truncate text-sm font-semibold leading-5 text-slate-950">
                    {currentUser?.name ?? 'No demo user selected'}
                  </p>
                  <p className="truncate text-xs leading-5 text-slate-600">
                    {currentRoleLabel
                      ? `${currentRoleLabel} view`
                      : 'Select a role for this local demo'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs leading-5 text-slate-600">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                  {isSeedDataInitialized ? 'Demo data ready' : 'Demo data loading'}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1">
                  Local identity only
                </span>
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1 px-2.5 py-2.5 sm:px-6 sm:py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
