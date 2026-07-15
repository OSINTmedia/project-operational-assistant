import {
  ArrowRight,
  BriefcaseBusiness,
  ChartColumn,
  FolderKanban,
  PlaySquare,
  Users,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
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
                Local-first workspace for project issue clarity.
              </p>
            </div>
            <div className="max-w-full lg:mt-6">
              <DemoRoleSwitcher
                demoUsers={demoUsers}
                currentUserId={currentUserId}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                variant="sidebar"
                description="Switch the local demo perspective for this workspace."
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
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Current demo perspective
                </p>
                <div className="mt-2 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-sm font-semibold text-accent">
                    {currentUser?.avatarInitials ?? 'PO'}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold leading-6 text-slate-950">
                      {currentUser?.name ?? 'No demo user selected'}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {currentRoleLabel
                        ? `${currentRoleLabel} view for local operational work`
                        : 'Select a demo role to load an operational perspective'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:items-center">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    <ChartColumn className="h-4 w-4" />
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/personal"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    <BriefcaseBusiness className="h-4 w-4 text-accent" />
                    Personal
                  </Link>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500 sm:max-w-[18rem]">
                  <span className="font-medium text-slate-700">
                    {isSeedDataInitialized ? 'Demo data ready' : 'Demo data loading'}
                  </span>
                  <span className="mx-1 text-slate-300">/</span>
                  Local identity only, no real sign-in.
                </div>
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
