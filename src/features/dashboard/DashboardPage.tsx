import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  CircleDotDashed,
  Clock3,
  Eye,
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
import { cn } from '../../shared/utils/cn'
import { createIssueNavigationState } from '../issues/issueNavigationState'
import { DashboardCharts } from './DashboardCharts'
import { useDashboardMetrics, type DashboardIssueSummary } from './useDashboardMetrics'

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
  isActive: boolean
  onSelect: () => void
}

function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-slate-950">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accentSoft text-accent">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="min-w-0 text-sm font-medium">{title}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold leading-none text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  )
}

function AssistantSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'default',
  isActive,
  onSelect,
}: AssistantSummaryCardProps) {
  const toneStyles = {
    default: 'border-slate-200 bg-white text-accent hover:border-slate-300',
    warning: 'border-orange-200 bg-orange-50/40 text-orange-600 hover:border-orange-300',
    danger: 'border-rose-200 bg-rose-50/40 text-rose-600 hover:border-rose-300',
    success: 'border-emerald-200 bg-emerald-50/40 text-emerald-600 hover:border-emerald-300',
  }[tone]

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        'min-w-0 rounded-lg border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
        toneStyles,
        isActive ? 'ring-2 ring-slate-900 ring-offset-2' : '',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-950">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
        </div>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold leading-none text-slate-950">{value}</p>
    </button>
  )
}

const ATTENTION_FILTER_OPTIONS = [
  { value: 'all', label: 'All attention' },
  { value: 'needs-update', label: 'Needs Update' },
] as const

type AttentionFilter = (typeof ATTENTION_FILTER_OPTIONS)[number]['value']
type QueuePreset =
  | 'all'
  | 'assigned-to-me'
  | 'curated-by-me'
  | 'needs-my-update'
  | 'needs-my-confirmation'
  | 'blocked'
  | 'delayed'
  | 'workspace-needs-update'

const QUEUE_PRESET_LABELS: Record<QueuePreset, string> = {
  all: 'All current work',
  'assigned-to-me': 'Assigned to me',
  'curated-by-me': 'Curated by me',
  'needs-my-update': 'Needs my update',
  'needs-my-confirmation': 'Needs my confirmation',
  blocked: 'Blocked',
  delayed: 'Delayed',
  'workspace-needs-update': 'Needs Update',
}

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function isOpenDashboardIssue(issue: DashboardIssueSummary): boolean {
  return issue.statusId !== 'done' && issue.statusId !== 'canceled'
}

function isIssueRelatedToSelectedUser(
  issue: DashboardIssueSummary,
  currentUserId: string,
): boolean {
  return (
    issue.ownerId === currentUserId ||
    issue.createdBy === currentUserId ||
    issue.curatorId === currentUserId ||
    issue.participantIds.includes(currentUserId) ||
    issue.dependencyTargetId === currentUserId
  )
}

function matchesQueuePreset(
  issue: DashboardIssueSummary,
  preset: QueuePreset,
  currentUserId: string | null,
): boolean {
  if (preset === 'all') {
    return true
  }

  if (!currentUserId) {
    return false
  }

  if (preset === 'assigned-to-me') {
    return isOpenDashboardIssue(issue) && issue.ownerId === currentUserId
  }

  if (preset === 'curated-by-me') {
    return isOpenDashboardIssue(issue) && issue.curatorId === currentUserId
  }

  if (preset === 'needs-my-update') {
    return issue.hasNeedsUpdateLabel && isIssueRelatedToSelectedUser(issue, currentUserId)
  }

  if (preset === 'needs-my-confirmation') {
    return (
      issue.confirmationRequired &&
      issue.confirmedAt === null &&
      issue.dependencyType === 'user' &&
      issue.dependencyTargetId === currentUserId &&
      issue.hasReadyForConfirmationLabel
    )
  }

  if (preset === 'blocked') {
    return issue.statusId === 'blocked'
  }

  if (preset === 'delayed') {
    return issue.statusId === 'delayed'
  }

  return issue.hasNeedsUpdateLabel
}

function QueuePreviewFact({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-950">{value}</p>
    </div>
  )
}

function DashboardQueueIssueCard({
  issue,
  isPreviewOpen,
  onTogglePreview,
}: {
  issue: DashboardIssueSummary
  isPreviewOpen: boolean
  onTogglePreview: () => void
}) {
  const previewId = `dashboard-issue-preview-${issue.id}`

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>{issue.statusLabel}</span>
            <span className="text-slate-300">•</span>
            <span>{issue.priorityLabel}</span>
            <span className="text-slate-300">•</span>
            <span>{issue.ownerName}</span>
          </div>
          <h3 className="mt-2 break-words text-base font-semibold text-slate-950">
            {issue.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Link
              to={`/projects/${issue.projectId}`}
              className="min-w-0 break-words font-medium text-accent transition-colors hover:text-slate-950"
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
            {issue.hasReadyForConfirmationLabel ? (
              <>
                <span className="text-slate-300">•</span>
                <Badge variant="violet">Ready for Confirmation</Badge>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-auto lg:flex lg:flex-wrap">
          <button
            type="button"
            onClick={onTogglePreview}
            aria-expanded={isPreviewOpen}
            aria-controls={previewId}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <Eye className="h-4 w-4" />
            {isPreviewOpen ? 'Hide preview' : 'Preview'}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isPreviewOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <Link
            to={`/projects/${issue.projectId}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            Open project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={`/issues/${issue.id}`}
            state={createIssueNavigationState({
              source: 'dashboard',
              label: 'Dashboard operational queue',
              path: '/dashboard',
              backLabel: 'Back to Dashboard queue',
            })}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            Open issue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {isPreviewOpen ? (
        <div id={previewId} className="mt-4 grid gap-4 border-t border-slate-200 pt-4">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Quick context
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {issue.description || 'No description has been added for this issue.'}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <QueuePreviewFact label="Owner" value={issue.ownerName} />
            <QueuePreviewFact label="Curator" value={issue.curatorName ?? 'No curator assigned'} />
            <QueuePreviewFact
              label="Dependency"
              value={
                issue.dependencyTargetLabel
                  ? `${issue.dependencyLabel}: ${issue.dependencyTargetLabel}`
                  : issue.dependencyLabel
              }
            />
            <QueuePreviewFact
              label="Confirmation"
              value={issue.confirmationRequired ? 'Confirmation requested' : 'Not requested'}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <QueuePreviewFact label="Updated by" value={issue.updatedByName} />
            <QueuePreviewFact
              label="Tags"
              value={
                issue.tagNames.length > 0
                  ? issue.tagNames.map((tag) => `#${tag}`).join(', ')
                  : 'No tags'
              }
            />
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function DashboardPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>('all')
  const [queuePreset, setQueuePreset] = useState<QueuePreset>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewIssueId, setPreviewIssueId] = useState<string | null>(null)
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
      if (!matchesQueuePreset(issue, queuePreset, currentUserId)) {
        return false
      }

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
          issue.curatorName ?? '',
          issue.dependencyLabel,
          issue.dependencyTargetLabel ?? '',
          issue.hasNeedsUpdateLabel ? 'Needs Update' : '',
          issue.hasReadyForConfirmationLabel ? 'Ready for Confirmation confirmation needed' : '',
          ...issue.tagNames,
        ]
          .join(' ')
          .toLocaleLowerCase()

        if (!searchableText.includes(normalizedSearchQuery)) {
          return false
        }
      }

      return true
    })
  }, [
    attentionFilter,
    currentUserId,
    data,
    normalizedSearchQuery,
    priorityFilter,
    projectFilter,
    queuePreset,
    statusFilter,
  ])

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
    queuePreset !== 'all' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    projectFilter !== 'all' ||
    attentionFilter !== 'all' ||
    normalizedSearchQuery !== ''
  const cards = [
    {
      title: 'Total issues',
      value: data.metrics.totalIssues,
      description: 'All current demo issues.',
      icon: FolderKanban,
    },
    {
      title: 'Open issues',
      value: data.metrics.openIssues,
      description: 'Not done or canceled.',
      icon: CircleDotDashed,
    },
    {
      title: 'Done issues',
      value: data.metrics.doneIssues,
      description: 'Completed without scoring.',
      icon: CheckCircle2,
    },
    {
      title: 'Waiting issues',
      value: data.metrics.waitingIssues,
      description: 'Paused on dependency.',
      icon: Clock3,
    },
    {
      title: 'Blocked issues',
      value: data.metrics.blockedIssues,
      description: 'Needs intervention.',
      icon: OctagonAlert,
    },
    {
      title: 'Delayed issues',
      value: data.metrics.delayedIssues,
      description: 'Behind expectation.',
      icon: TimerReset,
    },
    {
      title: 'Needs update',
      value: data.metrics.needsUpdateIssues,
      description: 'Stale context label.',
      icon: AlertCircle,
    },
  ] as const
  const selectedUserActionCards = [
    {
      title: 'Assigned to me',
      value: data.selectedUserActions.assignedIssues,
      description: 'Filter owned open work.',
      icon: UserCircle2,
      tone: 'default',
      preset: 'assigned-to-me',
    },
    {
      title: 'Curated by me',
      value: data.selectedUserActions.curatedIssues,
      description: 'Filter curated group work.',
      icon: FolderKanban,
      tone: 'default',
      preset: 'curated-by-me',
    },
    {
      title: 'Needs my update',
      value: data.selectedUserActions.needsUpdateIssues,
      description: 'Filter related stale context.',
      icon: AlertCircle,
      tone: 'warning',
      preset: 'needs-my-update',
    },
    {
      title: 'Needs my confirmation',
      value: data.selectedUserActions.confirmationNeededIssues,
      description: 'Filter confirmation requests.',
      icon: CheckCircle2,
      tone: 'success',
      preset: 'needs-my-confirmation',
    },
  ] satisfies Array<
    Omit<AssistantSummaryCardProps, 'isActive' | 'onSelect'> & {
      preset: QueuePreset
    }
  >
  const workspaceRiskCards = [
    {
      title: 'Blocked',
      value: data.workspaceRisks.blockedIssues,
      description: 'Filter blocked issues.',
      icon: OctagonAlert,
      tone: 'danger',
      preset: 'blocked',
    },
    {
      title: 'Delayed',
      value: data.workspaceRisks.delayedIssues,
      description: 'Filter delayed issues.',
      icon: TimerReset,
      tone: 'warning',
      preset: 'delayed',
    },
    {
      title: 'Needs Update',
      value: data.workspaceRisks.needsUpdateIssues,
      description: 'Filter stale context.',
      icon: AlertCircle,
      tone: 'warning',
      preset: 'workspace-needs-update',
    },
  ] satisfies Array<
    Omit<AssistantSummaryCardProps, 'isActive' | 'onSelect'> & {
      preset: QueuePreset
    }
  >

  function applyQueuePreset(nextPreset: QueuePreset) {
    setQueuePreset(nextPreset)
    setStatusFilter('all')
    setPriorityFilter('all')
    setProjectFilter('all')
    setAttentionFilter('all')
    setSearchQuery('')
    setPreviewIssueId(null)
  }

  function resetFilters() {
    setQueuePreset('all')
    setStatusFilter('all')
    setPriorityFilter('all')
    setProjectFilter('all')
    setAttentionFilter('all')
    setSearchQuery('')
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Operational entry point
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Dashboard</h2>
            <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-600 sm:block">
              Start from the operational queue, use focused cards to narrow work, then read charts
              and metrics as secondary context.
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

      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-950">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Operational queue</p>
            </div>
            <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-600 sm:block">
              Use focused action cards and filters to narrow work before opening full issue or
              project routes. Preview is for lightweight inspection; Open issue is for deeper work.
            </p>
          </div>
          <div className="grid w-full gap-3 text-sm text-slate-600 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-wrap">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center sm:text-left">
              {filteredIssues.length} matching issue{filteredIssues.length === 1 ? '' : 's'}
            </div>
            {queuePreset !== 'all' ? (
              <div className="rounded-lg border border-accent/30 bg-accentSoft px-3 py-2 text-center font-medium text-accent sm:text-left">
                {QUEUE_PRESET_LABELS[queuePreset]}
              </div>
            ) : null}
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-950">My action focus</p>
              <Badge variant="accent">Selected user</Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedUserActionCards.map((card) => (
                <AssistantSummaryCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  description={card.description}
                  icon={card.icon}
                  tone={card.tone}
                  isActive={queuePreset === card.preset}
                  onSelect={() => applyQueuePreset(card.preset)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-semibold text-slate-950">Workspace risk focus</p>
            <div className="grid gap-2">
              {workspaceRiskCards.map((card) => (
                <AssistantSummaryCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  description={card.description}
                  icon={card.icon}
                  tone={card.tone}
                  isActive={queuePreset === card.preset}
                  onSelect={() => applyQueuePreset(card.preset)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="grid gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-950">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search issue title, project, owner, curator, tag, status, or priority"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>
            <span className="hidden text-xs leading-5 text-slate-500 sm:block">
              Search is local to this queue and works with the structured filters below.
            </span>
          </label>

          <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:hidden">
            <summary className="cursor-pointer text-sm font-medium text-slate-950">
              Structured filters
            </summary>
            <div className="mt-3 grid gap-3">
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
          </details>

          <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-4 grid gap-3">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <DashboardQueueIssueCard
                key={issue.id}
                issue={issue}
                isPreviewOpen={previewIssueId === issue.id}
                onTogglePreview={() =>
                  setPreviewIssueId((currentIssueId) =>
                    currentIssueId === issue.id ? null : issue.id,
                  )
                }
              />
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

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Workspace snapshot</h3>
            <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
              Secondary counts stay available after the queue, without taking over the work start.
            </p>
          </div>
          <Badge variant="accent">Secondary context</Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 shadow-panel sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-950">Needs Update meaning</p>
          <Badge variant="accent">System label</Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          <span className="font-medium text-slate-950">Needs Update</span> is a system attention
          label, not a status. It marks issues whose latest information is no longer reliable
          enough for confident operational decisions.
        </p>
      </div>

      <section className="grid gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Insights after action</h3>
          <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
            Charts remain available for context after the queue has already exposed actionable work.
          </p>
        </div>
        <DashboardCharts distributions={data.distributions} />
      </section>
    </section>
  )
}
