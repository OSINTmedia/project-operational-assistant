import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Filter,
  FolderKanban,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cn } from '../../shared/utils/cn'
import { useProjectDetailView, type ProjectIssueSummary } from './useProjectDetailView'

const ATTENTION_FILTER_OPTIONS = [
  { value: 'all', label: 'All attention' },
  { value: 'needs-update', label: 'Needs Update' },
  { value: 'ready-for-confirmation', label: 'Ready for Confirmation' },
] as const

type AttentionFilter = (typeof ATTENTION_FILTER_OPTIONS)[number]['value']

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function countOptions<TItem>(
  items: TItem[],
  getValue: (item: TItem) => string,
): Map<string, number> {
  const counts = new Map<string, number>()

  items.forEach((item) => {
    const value = getValue(item)
    counts.set(value, (counts.get(value) ?? 0) + 1)
  })

  return counts
}

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function ProjectIssueCard({ issue }: { issue: ProjectIssueSummary }) {
  return (
    <Link
      to={`/issues/${issue.id}`}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-panel transition-colors hover:border-slate-300"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>{issue.typeLabel}</span>
            <span className="text-slate-300">•</span>
            <span>{issue.ownerName}</span>
            {issue.curatorName ? (
              <>
                <span className="text-slate-300">•</span>
                <span>Curated by {issue.curatorName}</span>
              </>
            ) : null}
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-950">{issue.title}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {issue.statusLabel}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {issue.priorityLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Updated {formatUpdatedAt(issue.updatedAt)}</span>
      </div>

      {issue.labelNames.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {issue.labelNames.map((label) => (
            <span
              key={`${issue.id}-label-${label}`}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                label === 'Needs Update'
                  ? 'bg-orange-50 text-orange-700'
                  : label === 'Ready for Confirmation'
                    ? 'bg-violet-50 text-violet-700'
                    : 'bg-sky-50 text-sky-700',
              )}
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}

      {issue.tagNames.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {issue.tagNames.map((tag) => (
            <span
              key={`${issue.id}-tag-${tag}`}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2 text-sm font-medium text-slate-600">
        <span className="text-right">Open issue</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const projectView = useProjectDetailView(projectId ?? null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const issues = useMemo(
    () => (projectView.status === 'ready' ? projectView.data.issues : []),
    [projectView],
  )
  const normalizedSearchQuery = useMemo(() => normalizeSearchText(searchQuery), [searchQuery])
  const statusOptions = useMemo(
    () => ['all', ...new Set(issues.map((issue) => issue.statusLabel))],
    [issues],
  )
  const priorityOptions = useMemo(
    () => ['all', ...new Set(issues.map((issue) => issue.priorityLabel))],
    [issues],
  )
  const typeOptions = useMemo(
    () => ['all', ...new Set(issues.map((issue) => issue.typeLabel))],
    [issues],
  )
  const statusCounts = useMemo(() => countOptions(issues, (issue) => issue.statusLabel), [issues])
  const priorityCounts = useMemo(
    () => countOptions(issues, (issue) => issue.priorityLabel),
    [issues],
  )
  const typeCounts = useMemo(() => countOptions(issues, (issue) => issue.typeLabel), [issues])
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (statusFilter !== 'all' && issue.statusLabel !== statusFilter) {
        return false
      }

      if (priorityFilter !== 'all' && issue.priorityLabel !== priorityFilter) {
        return false
      }

      if (typeFilter !== 'all' && issue.typeLabel !== typeFilter) {
        return false
      }

      if (attentionFilter === 'needs-update' && !issue.labelNames.includes('Needs Update')) {
        return false
      }

      if (
        attentionFilter === 'ready-for-confirmation' &&
        !issue.labelNames.includes('Ready for Confirmation')
      ) {
        return false
      }

      if (normalizedSearchQuery) {
        const searchableText = [
          issue.title,
          issue.typeLabel,
          issue.statusLabel,
          issue.priorityLabel,
          issue.ownerName,
          issue.curatorName ?? '',
          ...issue.labelNames,
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
  }, [attentionFilter, issues, normalizedSearchQuery, priorityFilter, statusFilter, typeFilter])
  const hasActiveFilters =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    typeFilter !== 'all' ||
    attentionFilter !== 'all' ||
    normalizedSearchQuery !== ''

  if (projectView.status === 'loading') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project detail
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Loading project</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading selected project context and summary counts.
          </p>
        </div>
      </section>
    )
  }

  if (projectView.status === 'error') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Project detail unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{projectView.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (projectView.status === 'missing') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project detail
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Project not found</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {projectView.message}
          </p>
        </div>
      </section>
    )
  }

  const { data } = projectView

  function resetFilters() {
    setStatusFilter('all')
    setPriorityFilter('all')
    setTypeFilter('all')
    setAttentionFilter('all')
    setSearchQuery('')
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Project detail
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span>{data.teamName}</span>
              <span className="text-slate-300">•</span>
              <span>{data.statusLabel}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{data.name}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{data.description}</p>
          </div>

          <div className="grid w-full gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:w-auto">
            <Link
              to={`/projects/${data.id}/issues/new`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:col-span-2"
            >
              <Plus className="h-4 w-4" />
              Create issue
            </Link>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Owner
              </p>
              <p className="mt-1 font-medium text-slate-950">{data.ownerName}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Team
              </p>
              <p className="mt-1 font-medium text-slate-950">{data.teamName}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Project updated
              </p>
              <p className="mt-1 font-medium text-slate-950">{formatUpdatedAt(data.updatedAt)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Latest issue activity
              </p>
              <p className="mt-1 font-medium text-slate-950">
                {data.latestIssueActivityAt
                  ? formatUpdatedAt(data.latestIssueActivityAt)
                  : 'No issue activity yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <FolderKanban className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Issues</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{data.totalIssueCount}</p>
          <p className="mt-1 text-sm text-slate-500">Total issues in this project</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <RefreshCcw className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Active</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{data.activeIssueCount}</p>
          <p className="mt-1 text-sm text-slate-500">Open work still in motion</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <ShieldAlert className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Blocked or delayed</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{data.blockedIssueCount}</p>
          <p className="mt-1 text-sm text-slate-500">Issues that need intervention</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <Users className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Needs update</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{data.needsUpdateCount}</p>
          <p className="mt-1 text-sm text-slate-500">Attention labels in this project</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <FolderKanban className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Done</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{data.doneIssueCount}</p>
          <p className="mt-1 text-sm text-slate-500">Completed issue records</p>
        </div>
      </div>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-950">Project issues</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Read-only project issues for the selected project. Search and structured filters help
              scan the list without introducing saved filters, inline actions, or broader query
              behavior.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {filteredIssues.length} of {data.issues.length} visible
            </span>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        </div>

        {data.issues.length > 0 ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-950">
              <Filter className="h-4 w-4 text-accent" />
              <span>Issue filters</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm text-slate-600 md:col-span-2 xl:col-span-4">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Search
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search issue title, owner, curator, label, tag, status, or priority"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>
                <span className="text-xs leading-5 text-slate-500">
                  Search stays local to this project list and combines with the structured filters.
                </span>
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Status
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all'
                        ? 'All statuses'
                        : `${option} (${statusCounts.get(option) ?? 0})`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Priority
                </span>
                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
                >
                  {priorityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all'
                        ? 'All priorities'
                        : `${option} (${priorityCounts.get(option) ?? 0})`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Type
                </span>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all'
                        ? 'All types'
                        : `${option} (${typeCounts.get(option) ?? 0})`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Attention
                </span>
                <select
                  value={attentionFilter}
                  onChange={(event) => setAttentionFilter(event.target.value as AttentionFilter)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
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
        ) : null}

        <div className="mt-5 grid gap-3">
          {data.issues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              This demo project does not currently have any issue records to show.
            </div>
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => <ProjectIssueCard key={issue.id} issue={issue} />)
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              No project issues match the current filters. Reset the filters to return to the full
              read-only list.
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
