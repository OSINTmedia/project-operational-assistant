import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  Filter,
  Plus,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, type BadgeVariant } from '../../shared/components/Badge'
import { ContextBreadcrumbs } from '../../shared/components/ContextBreadcrumbs'
import { createIssueNavigationState } from '../issues/issueNavigationState'
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

function getLabelBadgeVariant(label: string): BadgeVariant {
  if (label === 'Needs Update') {
    return 'warning'
  }

  if (label === 'Ready for Confirmation') {
    return 'violet'
  }

  return 'info'
}

function PreviewFact({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-950">{value}</p>
    </div>
  )
}

function ProjectIssueCard({
  issue,
  projectId,
  projectName,
  isPreviewOpen,
  onTogglePreview,
}: {
  issue: ProjectIssueSummary
  projectId: string
  projectName: string
  isPreviewOpen: boolean
  onTogglePreview: () => void
}) {
  const issueDetailState = createIssueNavigationState({
    source: 'project',
    label: `${projectName} issue list`,
    path: `/projects/${projectId}`,
    backLabel: `Back to ${projectName} issues`,
  })
  const previewId = `project-issue-preview-${issue.id}`
  const hasNeedsUpdate = issue.labelNames.includes('Needs Update')
  const hasReadyForConfirmation = issue.labelNames.includes('Ready for Confirmation')

  return (
    <article className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-panel">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
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
          <h3 className="mt-1 break-words text-sm font-semibold text-slate-950">
            {issue.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{issue.statusLabel}</Badge>
          <Badge variant="warning">{issue.priorityLabel}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Updated {formatUpdatedAt(issue.updatedAt)}</span>
        <span className="text-slate-300">•</span>
        <span>Updated by {issue.updatedByName}</span>
      </div>

      {issue.labelNames.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {issue.labelNames.map((label) => (
            <Badge key={`${issue.id}-label-${label}`} variant={getLabelBadgeVariant(label)}>
              {label}
            </Badge>
          ))}
        </div>
      ) : null}

      {issue.tagNames.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {issue.tagNames.map((tag) => (
            <Badge key={`${issue.id}-tag-${tag}`}>
              #{tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onTogglePreview}
          aria-expanded={isPreviewOpen}
          aria-controls={previewId}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:w-auto"
        >
          <Eye className="h-4 w-4" />
          {isPreviewOpen ? 'Hide preview' : 'Preview'}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isPreviewOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <Link
          to={`/issues/${issue.id}`}
          state={issueDetailState}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-950 sm:w-auto"
        >
          Open full issue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isPreviewOpen ? (
        <div id={previewId} className="grid gap-3 border-t border-slate-200 pt-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Quick context
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {issue.description || 'No description has been added for this issue.'}
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <PreviewFact label="Next action" value={issue.ownerName} />
            <PreviewFact label="Curator" value={issue.curatorName ?? 'No curator assigned'} />
            <PreviewFact
              label="Dependency"
              value={
                issue.dependencyTargetLabel
                  ? `${issue.dependencyLabel}: ${issue.dependencyTargetLabel}`
                  : issue.dependencyLabel
              }
            />
            <PreviewFact
              label="Confirmation"
              value={issue.confirmationRequired ? 'Confirmation requested' : 'Not requested'}
            />
          </div>

          {issue.participantNames.length > 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Participants
              </p>
              <p className="mt-1 break-words text-sm font-medium text-slate-950">
                {issue.participantNames.join(', ')}
              </p>
            </div>
          ) : null}

          {hasNeedsUpdate || hasReadyForConfirmation ? (
            <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              {hasNeedsUpdate ? <Badge variant="warning">Needs Update</Badge> : null}
              {hasReadyForConfirmation ? (
                <Badge variant="violet">Ready for Confirmation</Badge>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
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
  const [previewIssueId, setPreviewIssueId] = useState<string | null>(null)
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
  const projectContextChips = [
    { label: 'Owner', value: data.ownerName },
    { label: 'Active', value: `${data.activeIssueCount} open` },
    { label: 'Blocked/delayed', value: `${data.blockedIssueCount}` },
    { label: 'Needs Update', value: `${data.needsUpdateCount}` },
    {
      label: 'Latest issue',
      value: data.latestIssueActivityAt ? formatUpdatedAt(data.latestIssueActivityAt) : 'No activity',
    },
  ] as const

  function resetFilters() {
    setStatusFilter('all')
    setPriorityFilter('all')
    setTypeFilter('all')
    setAttentionFilter('all')
    setSearchQuery('')
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-6">
        <ContextBreadcrumbs
          items={[
            { label: 'Projects', to: '/projects' },
            { label: data.name },
          ]}
        />

        <Link
          to="/projects"
          className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
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
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{data.description}</p>
          </div>

          <div className="grid w-full gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:w-auto">
            <Link
              to={`/projects/${data.id}/issues/new`}
              aria-label={`Create issue in ${data.name}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:col-span-2"
            >
              <Plus className="h-4 w-4" />
              Create issue
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {projectContextChips.map((chip) => (
            <div
              key={chip.label}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {chip.label}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-slate-950">{chip.value}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-950">
              <Filter className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Project issues</p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Filter this project queue, preview for quick context, or open the full issue for deep
              work.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Badge>
              {filteredIssues.length} of {data.issues.length} visible
            </Badge>
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <label className="grid gap-2 text-sm text-slate-600 sm:col-span-2 xl:col-span-2">
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
                    {option === 'all' ? 'All types' : `${option} (${typeCounts.get(option) ?? 0})`}
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
        ) : null}

        <div className="mt-4 grid gap-3">
          {data.issues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              This demo project does not currently have any issue records to show.
            </div>
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <ProjectIssueCard
                key={issue.id}
                issue={issue}
                projectId={data.id}
                projectName={data.name}
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
              No project issues match the current filters. Reset the filters to return to the full
              read-only list.
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
