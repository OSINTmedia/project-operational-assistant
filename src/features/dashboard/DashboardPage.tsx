import {
  AlertCircle,
  CheckCircle2,
  CircleDotDashed,
  Clock3,
  FolderKanban,
  OctagonAlert,
  TimerReset,
  UserCircle2,
} from 'lucide-react'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { DashboardCharts } from './DashboardCharts'
import { useDashboardMetrics } from './useDashboardMetrics'

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
      <div className="flex items-center gap-2 text-slate-950">
        <Icon className="h-4 w-4 text-accent" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  )
}

export function DashboardPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const dashboardMetrics = useDashboardMetrics({
    currentUserName: currentUser?.name ?? null,
    currentUserRole: currentUser?.role ?? null,
  })

  if (dashboardMetrics.status === 'loading') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Operational entry point
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Dashboard</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading top-level operational metrics for the current demo workspace.
          </p>
        </div>
      </section>
    )
  }

  if (dashboardMetrics.status === 'error') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Dashboard unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{dashboardMetrics.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { data } = dashboardMetrics
  const cards = [
    {
      title: 'Total issues',
      value: data.metrics.totalIssues,
      description: 'All seeded and locally created issues currently in the demo workspace.',
      icon: FolderKanban,
    },
    {
      title: 'Open issues',
      value: data.metrics.openIssues,
      description: 'Work that is not done and not canceled, across all project surfaces.',
      icon: CircleDotDashed,
    },
    {
      title: 'Done issues',
      value: data.metrics.doneIssues,
      description: 'Issues already marked done without turning the dashboard into a scorecard.',
      icon: CheckCircle2,
    },
    {
      title: 'Waiting issues',
      value: data.metrics.waitingIssues,
      description: 'Operational items currently paused while another dependency is awaited.',
      icon: Clock3,
    },
    {
      title: 'Blocked issues',
      value: data.metrics.blockedIssues,
      description: 'Items that currently cannot move without explicit intervention or resolution.',
      icon: OctagonAlert,
    },
    {
      title: 'Delayed issues',
      value: data.metrics.delayedIssues,
      description: 'Work that is behind expectation and should stay visible early in the day.',
      icon: TimerReset,
    },
    {
      title: 'Needs update',
      value: data.metrics.needsUpdateIssues,
      description: 'Issues carrying the persisted Needs Update attention label right now.',
      icon: AlertCircle,
    },
  ] as const

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Operational entry point
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Top-level operational counts and compact charts for the local-first portfolio demo:
              enough to start the day with clarity, without slipping into filters or employee
              scoring.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <UserCircle2 className="h-4 w-4 text-accent" />
              <span className="font-medium text-slate-950">{data.currentUserName}</span>
              <span className="text-slate-400">·</span>
              <span>{data.currentUserRoleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>

      <DashboardCharts distributions={data.distributions} />
    </section>
  )
}
