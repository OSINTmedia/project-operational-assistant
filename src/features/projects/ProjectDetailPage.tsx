import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FolderKanban,
  RefreshCcw,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { cn } from '../../shared/utils/cn'
import { useProjectDetailView, type ProjectIssueSummary } from './useProjectDetailView'

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
        <span>Open issue</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const projectView = useProjectDetailView(projectId ?? null)

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

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
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

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-950">Project issues</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Read-only project issues for the selected project. This slice keeps the list
              navigable and descriptive without introducing issue actions, inline edits, or Issue
              Detail implementation.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {data.issues.length} visible
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {data.issues.length > 0 ? (
            data.issues.map((issue) => <ProjectIssueCard key={issue.id} issue={issue} />)
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              This demo project does not currently have any issue records to show.
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
