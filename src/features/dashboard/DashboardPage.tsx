import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDotDashed,
  Clock3,
  FolderKanban,
  OctagonAlert,
  Search,
  SlidersHorizontal,
  TimerReset,
  UserCircle2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { Badge } from '../../shared/components/Badge'
import { DashboardCharts } from './DashboardCharts'
import { useDashboardMetrics } from './useDashboardMetrics'

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface AssistantSummaryCardProps {
  title: string
  value: number
  description: string
  icon: React.ComponentType<{ className?: string }>
  tone?: 'default' | 'warning' | 'danger' | 'success'
}

function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 border-t-accent bg-white p-4 shadow-panel">
      <div className="flex items-center gap-2 text-slate-950">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accentSoft text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <p className="min-w-0 text-sm font-medium">{title}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold leading-none text-slate-950">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  )
}

function AssistantSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'default',
}: AssistantSummaryCardProps) {
  const toneStyles = {
    default: 'border-slate-200 bg-white text-accent',
    warning: 'border-orange-200 bg-orange-50/40 text-orange-600',
    danger: 'border-rose-200 bg-rose-50/40 text-rose-600',
    success: 'border-emerald-200 bg-emerald-50/40 text-emerald-600',
  }[tone]

  return (
    <article className={`min-w-0 rounded-xl border p-4 ${toneStyles}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold leading-none text-slate-950">{value}</p>
    </article>
  )
}

const ATTENTION_FILTER_OPTIONS = [
  { value: 'all', label: 'All attention' },
  { value: 'needs-update', label: 'Needs Update' },
] as const

type AttentionFilter = (typeof ATTENTION_FILTER_OPTIONS)[number]['value']

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function DashboardPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const dashboardMetrics = useDashboardMetrics({
    currentUserId,
    currentUserName: currentUser?.name ?? null,
    currentUserRole: currentUser?.role ?? null,
  })
  const data = dashboardMetrics.status === 'ready' ? dashboardMetrics.data : null
  const normalizedSearchQuery = useMemo(() => normalizeSearchText(searchQuery), [searchQuery])
  const filteredIssues = useMemo(() => {
    if (!data) {
      return []
    }

    return data.issues.filter((issue) => {
      if (statusFilter !== 'all' && issue.statusId !== statusFilter) {
        return false
      }

      if (priorityFilter !== 'all' && issue.priorityId !== priorityFilter) {
        return false
      }

      if (projectFilter !== 'all' && issue.projectId !== projectFilter) {
        return false
      }

      if (attentionFilter === 'needs-update' && !issue.hasNeedsUpdateLabel) {
        return false
      }

      if (normalizedSearchQuery) {
        const searchableText = [
          issue.title,
          issue.projectName,
          issue.statusLabel,
          issue.priorityLabel,
          issue.ownerName,
          issue.hasNeedsUpdateLabel ? 'Needs Update' : '',
        ]
          .join(' ')
          .toLocaleLowerCase()

        if (!searchableText.includes(normalizedSearchQuery)) {
          return false
        }
      }

      return true
    })
  }, [attentionFilter, data, normalizedSearchQuery, priorityFilter, projectFilter, statusFilter])

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

  if (!data) {
    return null
  }

  const hasActiveFilters =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    projectFilter !== 'all' ||
    attentionFilter !== 'all' ||
    normalizedSearchQuery !== ''
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
  const selectedUserActionCards = [
    {
      title: 'Assigned to me',
      value: data.selectedUserActions.assignedIssues,
      description: 'Open issues where this selected user owns the next operational action.',
      icon: UserCircle2,
      tone: 'default',
    },
    {
      title: 'Curated by me',
      value: data.selectedUserActions.curatedIssues,
      description: 'Open group work where this user keeps context and continuity visible.',
      icon: FolderKanban,
      tone: 'default',
    },
    {
      title: 'Needs my update',
      value: data.selectedUserActions.needsUpdateIssues,
      description: 'Related issues carrying the Needs Update system attention label.',
      icon: AlertCircle,
      tone: 'warning',
    },
    {
      title: 'Needs my confirmation',
      value: data.selectedUserActions.confirmationNeededIssues,
      description: 'Ready for Confirmation items currently waiting on this selected user.',
      icon: CheckCircle2,
      tone: 'success',
    },
  ] as const
  const workspaceRiskCards = [
    {
      title: 'Blocked',
      value: data.workspaceRisks.blockedIssues,
      description: 'Workspace issues that cannot move without intervention or resolution.',
      icon: OctagonAlert,
      tone: 'danger',
    },
    {
      title: 'Delayed',
      value: data.workspaceRisks.delayedIssues,
      description: 'Workspace issues behind expectation and worth checking early.',
      icon: TimerReset,
      tone: 'warning',
    },
    {
      title: 'Needs Update',
      value: data.workspaceRisks.needsUpdateIssues,
      description: 'Workspace issues with stale operational context, not a performance score.',
      icon: AlertCircle,
      tone: 'warning',
    },
  ] as const

  function resetFilters() {
    setStatusFilter('all')
    setPriorityFilter('all')
    setProjectFilter('all')
    setAttentionFilter('all')
    setSearchQuery('')
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Operational entry point
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Top-level operational counts, compact charts, and a filtered work queue for the
              local-first portfolio demo: enough to start the day with clarity, without slipping
              into employee scoring.
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

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-950">Assistant home</h3>
              <Badge variant="accent">Selected user</Badge>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Start with what matters for {data.currentUserName}, then separate personal action
              cues from workspace-level operational risks. These counts are local demo signals,
              not permissions, notifications, or performance scoring.
            </p>
          </div>
          <Link
            to="/personal"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:w-auto"
          >
            Open Personal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
          <div className="grid gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">My next actions</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Role-aware cues for work related to the selected demo user.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedUserActionCards.map((card) => (
                <AssistantSummaryCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  description={card.description}
                  icon={card.icon}
                  tone={card.tone}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Workspace risks</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Shared operational signals to inspect without reading them as employee scores.
              </p>
            </div>
            <div className="grid gap-3">
              {workspaceRiskCards.map((card) => (
                <AssistantSummaryCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  description={card.description}
                  icon={card.icon}
                  tone={card.tone}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

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

      <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 shadow-panel">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-950">How to read this dashboard</p>
          <Badge variant="accent">System label</Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          <span className="font-medium text-slate-950">Needs Update</span> is a system attention
          label, not a status. It marks issues whose latest information is no longer reliable
          enough for confident operational decisions.
        </p>
      </div>

      <DashboardCharts distributions={data.distributions} />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-950">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Operational queue</p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Narrow dashboard filters and direct links into issue and project work, without
              widening into saved reports or notification behavior.
            </p>
          </div>
          <div className="grid w-full gap-3 text-sm text-slate-600 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-wrap">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center sm:text-left">
              {filteredIssues.length} matching issue{filteredIssues.length === 1 ? '' : 's'}
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-2 text-sm text-slate-600 lg:col-span-4">
            <span className="font-medium text-slate-950">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search issue title, project, owner, status, or priority"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>
            <span className="text-xs leading-5 text-slate-500">
              Search is local to this queue and works with the structured filters below.
            </span>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
            >
              <option value="all">All statuses</option>
              {data.filterOptions.statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Priority</span>
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
            >
              <option value="all">All priorities</option>
              {data.filterOptions.priorities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Project</span>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
            >
              <option value="all">All projects</option>
              {data.filterOptions.projects.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Attention</span>
            <select
              value={attentionFilter}
              onChange={(event) => setAttentionFilter(event.target.value as AttentionFilter)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
            >
              {ATTENTION_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {hasActiveFilters ? (
          <div className="mt-4 flex justify-stretch sm:justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:w-auto"
            >
              Clear filters
            </button>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <article
                key={issue.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      <span>{issue.statusLabel}</span>
                      <span className="text-slate-300">•</span>
                      <span>{issue.priorityLabel}</span>
                      <span className="text-slate-300">•</span>
                      <span>{issue.ownerName}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-950">{issue.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <Link
                        to={`/projects/${issue.projectId}`}
                        className="font-medium text-accent transition-colors hover:text-slate-950"
                      >
                        {issue.projectName}
                      </Link>
                      <span className="text-slate-300">•</span>
                      <span>Updated {formatUpdatedAt(issue.updatedAt)}</span>
                      {issue.hasNeedsUpdateLabel ? (
                        <>
                          <span className="text-slate-300">•</span>
                          <Badge variant="warning">Needs Update</Badge>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-wrap">
                    <Link
                      to={`/projects/${issue.projectId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                    >
                      Open project
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/issues/${issue.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                    >
                      Open issue
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              No issues match the current dashboard filters. Clear filters or switch the selected
              dashboard slice to continue. This queue is intentionally narrow: it shows current
              issue visibility, not a saved report.
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
