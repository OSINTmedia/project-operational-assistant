import { DatabaseZap, RefreshCcw, ShieldCheck, Users } from 'lucide-react'
import { DemoRoleSwitcher } from './DemoRoleSwitcher'
import { useDemoAppState } from '../../app/state/useDemoAppState'
import { cn } from '../../shared/utils/cn'

function formatTimestamp(timestamp: string | null): string | null {
  if (!timestamp) {
    return null
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

export function DemoPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const selectedRole = useDemoAppState((state) => state.selectedRole)
  const demoControlsStatus = useDemoAppState((state) => state.demoControlsStatus)
  const isSeedDataInitialized = useDemoAppState((state) => state.isSeedDataInitialized)
  const resetErrorMessage = useDemoAppState((state) => state.resetErrorMessage)
  const lastResetAt = useDemoAppState((state) => state.lastResetAt)
  const setSelectedRole = useDemoAppState((state) => state.setSelectedRole)
  const resetDemoData = useDemoAppState((state) => state.resetDemoData)

  const formattedLastResetAt = formatTimestamp(lastResetAt)
  const isResetting = demoControlsStatus === 'resetting'

  const handleReset = async () => {
    const shouldReset = window.confirm(
      'Reset local demo data for this browser? Unsaved local changes will be replaced with the seeded demo dataset.',
    )

    if (!shouldReset) {
      return
    }

    await resetDemoData()
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Demo controls
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Local-first demo workspace</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Use these controls to switch between seeded demo roles and restore the original browser
          dataset without introducing real authentication or backend behavior.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)]">
        <div className="grid gap-6">
          <DemoRoleSwitcher
            demoUsers={demoUsers}
            currentUserId={currentUserId}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            title="Demo role access"
            description="Predefined accounts let portfolio visitors compare Manager, Project Manager, and User perspectives without real sign-in."
          />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-950">
                  <DatabaseZap className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium">Demo data reset</p>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Reset replaces local browser changes with the seeded Portfolio MVP dataset. It
                  does not affect any server or shared environment because this demo is fully
                  local-first.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleReset()
                }}
                disabled={isResetting}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  isResetting
                    ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                    : 'bg-slate-950 text-white hover:bg-slate-800',
                )}
              >
                <RefreshCcw className={cn('h-4 w-4', isResetting && 'animate-spin')} />
                {isResetting ? 'Resetting demo data' : 'Reset Demo Data'}
              </button>
            </div>

            <div className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-slate-900">Seed status</span>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    isSeedDataInitialized
                      ? 'bg-accentSoft text-accent'
                      : 'bg-amber-100 text-amber-700',
                  )}
                >
                  {isSeedDataInitialized ? 'Initialized' : 'Pending'}
                </span>
              </div>

              {formattedLastResetAt ? (
                <p>Last local reset completed at {formattedLastResetAt}.</p>
              ) : (
                <p>No manual reset has been triggered in this browser session yet.</p>
              )}

              {resetErrorMessage ? (
                <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
                  {resetErrorMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <Users className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">What visitors can test</p>
            </div>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <li>Switch between predefined Manager, Project Manager, and User demo contexts.</li>
              <li>Inspect how the app keeps demo identity local to browser state only.</li>
              <li>Restore the original seeded dataset after trying later issue and project flows.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Scope guardrails</p>
            </div>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <li>No real authentication or session backend is introduced in this slice.</li>
              <li>Demo controls operate through app state and local persistence helpers only.</li>
              <li>Later project, personal, team, and dashboard screens remain separate phases.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
