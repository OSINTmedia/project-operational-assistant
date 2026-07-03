import { useEffect, type PropsWithChildren } from 'react'
import { useDemoAppState } from '../state/useDemoAppState'

function AppInitializationState() {
  const lifecycleStatus = useDemoAppState((state) => state.lifecycleStatus)
  const errorMessage = useDemoAppState((state) => state.errorMessage)

  if (lifecycleStatus === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-lg rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-600">
            Demo initialization failed
          </p>
          <h1 className="mt-2 text-xl font-semibold text-slate-950">Local demo data is unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {errorMessage ?? 'The browser demo could not initialize its local data layer.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Local-first demo
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-950">Initializing demo workspace</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Loading seeded demo users, projects, issues, and local browser state.
        </p>
      </div>
    </div>
  )
}

export function AppProviders({ children }: PropsWithChildren) {
  const lifecycleStatus = useDemoAppState((state) => state.lifecycleStatus)
  const initialize = useDemoAppState((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (lifecycleStatus !== 'ready') {
    return <AppInitializationState />
  }

  return children
}
