import {
  AlertCircle,
  ArrowLeft,
  CheckCheck,
  Clock3,
  FilePenLine,
  FolderKanban,
  History,
  Link2,
  Tag,
  Users,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { cn } from '../../shared/utils/cn'
import { useIssueDetailView } from './useIssueDetailView'

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function MetadataCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-950">{value}</p>
    </div>
  )
}

function ActivityCard({
  actorName,
  actionLabel,
  oldValueLabel,
  newValueLabel,
  createdAt,
}: {
  actorName: string
  actionLabel: string
  oldValueLabel: string | null
  newValueLabel: string | null
  createdAt: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-950">{actionLabel}</p>
          <p className="mt-1 text-sm text-slate-600">{actorName}</p>
        </div>
        <p className="text-xs text-slate-500">{formatDateTime(createdAt)}</p>
      </div>

      {oldValueLabel || newValueLabel ? (
        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              From
            </span>
            <p className="mt-1 text-slate-950">{oldValueLabel ?? '—'}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              To
            </span>
            <p className="mt-1 text-slate-950">{newValueLabel ?? '—'}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function IssueDetailPage() {
  const { issueId } = useParams()
  const issueView = useIssueDetailView(issueId ?? null)

  if (issueView.status === 'loading') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Issue detail
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Loading issue</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading structured issue fields, dependency context, and activity history.
          </p>
        </div>
      </section>
    )
  }

  if (issueView.status === 'error') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Issue detail unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{issueView.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (issueView.status === 'missing') {
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
            Issue detail
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Issue not found</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {issueView.message}
          </p>
        </div>
      </section>
    )
  }

  const { data } = issueView

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link
              to={`/projects/${data.projectId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </Link>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Issue detail
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span>{data.projectName}</span>
              <span className="text-slate-300">•</span>
              <span>{data.typeLabel}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{data.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {data.description || 'No description was added for this issue.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <Link
              to={`/issues/${data.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              <FilePenLine className="h-4 w-4" />
              Edit issue
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetadataCard label="Status" value={data.statusLabel} />
        <MetadataCard label="Priority" value={data.priorityLabel} />
        <MetadataCard label="Owner" value={data.ownerName} />
        <MetadataCard label="Curator" value={data.curatorName ?? 'None'} />
        <MetadataCard label="Project" value={data.projectName} />
        <MetadataCard label="Team" value={data.teamName} />
        <MetadataCard label="Created by" value={data.createdByName} />
        <MetadataCard label="Updated by" value={data.updatedByName} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <p className="text-sm font-medium text-slate-950">Curator</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The curator keeps operational context coherent, especially on group issues. This role
            does not automatically mean the curator is the owner or the person doing the work.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <p className="text-sm font-medium text-slate-950">Needs Update</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Needs Update is a system label used when the latest issue context is no longer reliable
            enough. It is an attention signal, not a workflow status.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
        <div className="grid gap-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <FolderKanban className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Structured issue context</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <MetadataCard label="Dependency" value={data.dependencyLabel} />
              <MetadataCard
                label="Dependency target"
                value={data.dependencyTargetLabel ?? 'None'}
              />
              <MetadataCard label="Created at" value={formatDateTime(data.createdAt)} />
              <MetadataCard label="Updated at" value={formatDateTime(data.updatedAt)} />
              <MetadataCard
                label="Completed at"
                value={data.completedAt ? formatDateTime(data.completedAt) : 'Not completed'}
              />
              <MetadataCard
                label="Confirmed at"
                value={data.confirmedAt ? formatDateTime(data.confirmedAt) : 'Not confirmed'}
              />
            </div>

            {data.confirmationRequired || data.confirmedByName ? (
              <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCheck className="h-4 w-4" />
                  <span>Confirmation context</span>
                </div>
                <p className="mt-2 leading-6">
                  {data.confirmationRequired
                    ? 'This issue currently requires confirmation before it is fully closed.'
                    : 'Confirmation is not currently required for this issue.'}
                </p>
                {data.confirmedByName ? (
                  <p className="mt-2 leading-6">
                    Confirmed by {data.confirmedByName}
                    {data.confirmedAt ? ` on ${formatDateTime(data.confirmedAt)}` : ''}.
                  </p>
                ) : null}
              </div>
            ) : null}

            {data.participantNames.length > 0 ? (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-950">
                  <Users className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium">Participants</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.participantNames.map((participantName) => (
                    <span
                      key={`${data.id}-participant-${participantName}`}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {participantName}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <History className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Activity history</p>
            </div>

            <div className="mt-5 grid gap-4">
              {data.activity.length > 0 ? (
                data.activity.map((entry) => (
                  <ActivityCard
                    key={entry.id}
                    actorName={entry.actorName}
                    actionLabel={entry.actionLabel}
                    oldValueLabel={entry.oldValueLabel}
                    newValueLabel={entry.newValueLabel}
                    createdAt={entry.createdAt}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-500">
                  No activity history has been recorded for this issue yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="grid gap-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <Tag className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Tags</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.tagNames.length > 0 ? (
                data.tagNames.map((tagName) => (
                  <span
                    key={`${data.id}-tag-${tagName}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    #{tagName}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No tags assigned.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <Link2 className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Labels</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.labelNames.length > 0 ? (
                data.labelNames.map((labelName) => (
                  <span
                    key={`${data.id}-label-${labelName}`}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      labelName === 'Needs Update'
                        ? 'bg-orange-50 text-orange-700'
                        : labelName === 'Ready for Confirmation'
                          ? 'bg-violet-50 text-violet-700'
                          : 'bg-sky-50 text-sky-700',
                    )}
                  >
                    {labelName}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No labels assigned.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-2 text-slate-950">
              <Clock3 className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Timeline summary</p>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-950">Created:</span>{' '}
                {formatDateTime(data.createdAt)}
              </p>
              <p>
                <span className="font-medium text-slate-950">Updated:</span>{' '}
                {formatDateTime(data.updatedAt)}
              </p>
              <p>
                <span className="font-medium text-slate-950">Latest activity entries:</span>{' '}
                {data.activity.length}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  )
}
