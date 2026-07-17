import {
  AlertCircle,
  ArrowLeft,
  CheckCheck,
  CheckCircle2,
  CirclePlay,
  Clock3,
  FilePenLine,
  FolderKanban,
  History,
  Link2,
  OctagonAlert,
  PauseCircle,
  Tag,
  Users,
} from 'lucide-react'
import { useState, type ComponentType } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDemoAppState } from '../../app/state/useDemoAppState'
import {
  confirmIssue,
  markIssueReadyForConfirmation,
  reopenIssueFromConfirmation,
  updateIssueStatus,
} from '../../domain/issueRules'
import { Badge, type BadgeVariant } from '../../shared/components/Badge'
import { ContextBreadcrumbs } from '../../shared/components/ContextBreadcrumbs'
import { STATUS_LABELS, type StatusId } from '../../shared/types'
import { cn } from '../../shared/utils/cn'
import { createIssueNavigationState, getIssueReturnContext } from './issueNavigationState'
import { useIssueDetailView } from './useIssueDetailView'

function formatDateTime(value: string): string {
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

function MetadataCard({
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
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-panel">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-950">{actionLabel}</p>
          <p className="mt-1 text-sm text-slate-600">{actorName}</p>
        </div>
        <p className="text-xs text-slate-500">{formatDateTime(createdAt)}</p>
      </div>

      {oldValueLabel || newValueLabel ? (
        <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
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

type QuickActionId =
  | `status:${StatusId}`
  | 'confirmation:request'
  | 'confirmation:confirm'

interface QuickActionButtonProps {
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  disabledReason: string | null
  isPending: boolean
  onClick: () => void
}

function QuickActionButton({
  label,
  description,
  icon: Icon,
  disabledReason,
  isPending,
  onClick,
}: QuickActionButtonProps) {
  const isDisabled = Boolean(disabledReason) || isPending

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'grid min-h-[76px] min-w-0 gap-1.5 rounded-lg border p-3 text-left transition-colors',
        isDisabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950',
      )}
    >
      <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
        <Icon className={cn('h-4 w-4 shrink-0', isDisabled ? 'text-slate-400' : 'text-accent')} />
        <span className="min-w-0 break-words">{label}</span>
      </span>
      <span className="text-xs leading-5 text-slate-500">
        {isPending ? 'Updating issue...' : disabledReason ?? description}
      </span>
    </button>
  )
}

export function IssueDetailPage() {
  const { issueId } = useParams()
  const location = useLocation()
  const issueView = useIssueDetailView(issueId ?? null)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const [pendingActionId, setPendingActionId] = useState<QuickActionId | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const sourceReturnContext = getIssueReturnContext(location.state)

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
  const projectReturnContext = {
    source: 'project' as const,
    label: data.projectName,
    path: `/projects/${data.projectId}`,
    backLabel: `Back to ${data.projectName}`,
  }
  const returnContext = sourceReturnContext ?? projectReturnContext
  const returnNavigationState = createIssueNavigationState(returnContext)
  const openedFromDescription = sourceReturnContext
    ? returnContext.source === 'project'
      ? `Opened from ${returnContext.label}.`
      : `Opened from ${returnContext.label}; this issue still belongs to ${data.projectName}.`
    : `Opened directly or without saved source context; ${data.projectName} is the return destination.`
  const editBehaviorDescription =
    returnContext.source === 'project'
      ? `Edit save returns to ${data.projectName}; cancel returns to this issue detail.`
      : `Edit save returns to this issue detail with ${returnContext.label} preserved as the back path.`
  const breadcrumbItems =
    returnContext.source === 'project'
      ? [
          { label: 'Projects', to: '/projects' },
          { label: data.projectName, to: `/projects/${data.projectId}` },
          { label: data.title },
        ]
      : [
          { label: returnContext.label, to: returnContext.path },
          { label: data.projectName, to: `/projects/${data.projectId}` },
          { label: data.title },
        ]
  const actorDisabledReason = currentUserId ? null : 'Select a demo user before taking action.'
  const statusActions: Array<{
    statusId: StatusId
    label: string
    description: string
    icon: ComponentType<{ className?: string }>
  }> = [
    {
      statusId: 'in-progress',
      label: 'Set in progress',
      description: 'Move the issue back into active work.',
      icon: CirclePlay,
    },
    {
      statusId: 'waiting',
      label: 'Set waiting',
      description: 'Show that progress is paused on an external dependency.',
      icon: PauseCircle,
    },
    {
      statusId: 'blocked',
      label: 'Set blocked',
      description: 'Flag that intervention is needed before work can continue.',
      icon: OctagonAlert,
    },
    {
      statusId: 'done',
      label: 'Mark done',
      description: 'Close the issue as completed.',
      icon: CheckCircle2,
    },
  ]

  function getActionDisabledReason(
    actionId: QuickActionId,
    disabledReason: string | null,
  ): string | null {
    if (pendingActionId && pendingActionId !== actionId) {
      return 'Another issue action is running.'
    }

    return disabledReason
  }

  async function runAction(
    actionId: QuickActionId,
    action: (actorId: string) => Promise<unknown>,
  ) {
    const actorId = currentUserId

    if (!actorId || pendingActionId) {
      return
    }

    setPendingActionId(actionId)
    setActionError(null)
    setActionMessage(null)

    try {
      await action(actorId)
      issueView.reload()
      setActionMessage('Issue action applied. Structured fields and activity history were refreshed.')
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Issue action failed.')
    } finally {
      setPendingActionId(null)
    }
  }

  function runStatusAction(statusId: StatusId) {
    const actionId: QuickActionId = `status:${statusId}`

    void runAction(actionId, (actorId) => {
      if (statusId !== 'done' && (data.confirmationRequired || data.confirmedAt)) {
        return reopenIssueFromConfirmation({
          issueId: data.id,
          actorId,
          statusId,
        })
      }

      return updateIssueStatus({
        issueId: data.id,
        actorId,
        statusId,
      })
    })
  }

  function runRequestConfirmationAction() {
    void runAction('confirmation:request', (actorId) =>
      markIssueReadyForConfirmation({
        issueId: data.id,
        actorId,
      }),
    )
  }

  function runConfirmAction() {
    void runAction('confirmation:confirm', (actorId) =>
      confirmIssue({
        issueId: data.id,
        actorId,
      }),
    )
  }

  const primaryFacts = [
    { label: 'Status', value: data.statusLabel },
    { label: 'Priority', value: data.priorityLabel },
    { label: 'Owner', value: data.ownerName },
    { label: 'Curator', value: data.curatorName ?? 'None' },
  ]
  const secondaryFacts = [
    { label: 'Project', value: data.projectName },
    { label: 'Team', value: data.teamName },
    { label: 'Created by', value: data.createdByName },
    { label: 'Updated by', value: data.updatedByName },
    { label: 'Dependency', value: data.dependencyLabel },
    { label: 'Dependency target', value: data.dependencyTargetLabel ?? 'None' },
    { label: 'Created at', value: formatDateTime(data.createdAt) },
    { label: 'Updated at', value: formatDateTime(data.updatedAt) },
    {
      label: 'Completed at',
      value: data.completedAt ? formatDateTime(data.completedAt) : 'Not completed',
    },
    {
      label: 'Confirmed at',
      value: data.confirmedAt ? formatDateTime(data.confirmedAt) : 'Not confirmed',
    },
  ]

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-5">
        <ContextBreadcrumbs items={breadcrumbItems} />

        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <Link
              to={returnContext.path}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              {returnContext.backLabel}
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge>{data.statusLabel}</Badge>
              <Badge variant="info">{data.priorityLabel}</Badge>
              <Badge>{data.typeLabel}</Badge>
              {data.labelNames.map((labelName) => (
                <Badge
                  key={`${data.id}-header-label-${labelName}`}
                  variant={getLabelBadgeVariant(labelName)}
                >
                  {labelName}
                </Badge>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Issue detail
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{data.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {data.description || 'No description was added for this issue.'}
            </p>

            <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-600">
              <p>{openedFromDescription}</p>
              <p>{editBehaviorDescription}</p>
            </div>
          </div>

          <div className="grid w-full gap-3 text-sm text-slate-600 xl:max-w-sm">
            <Link
              to={`/issues/${data.id}/edit`}
              state={returnNavigationState}
              aria-label={`Edit issue ${data.title}. Return context: ${returnContext.backLabel}.`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              <FilePenLine className="h-4 w-4" />
              Edit issue
            </Link>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {primaryFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {fact.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-950">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-950">Quick actions</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              Apply status or confirmation updates without leaving this issue. Responsibility
              changes remain in the structured edit flow.
            </p>
          </div>
          <Link
            to={`/issues/${data.id}/edit`}
            state={returnNavigationState}
            aria-label={`Change owner or curator for ${data.title}. Return context: ${returnContext.backLabel}.`}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:w-auto"
          >
            <FilePenLine className="h-4 w-4" />
            Change owner or curator
          </Link>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {statusActions.map((action) => {
            const disabledReason =
              actorDisabledReason ??
              (data.statusId === action.statusId
                ? `Already ${STATUS_LABELS[action.statusId].toLocaleLowerCase()}.`
                : null)
            const actionId: QuickActionId = `status:${action.statusId}`

            return (
              <QuickActionButton
                key={action.statusId}
                label={action.label}
                description={action.description}
                icon={action.icon}
                disabledReason={getActionDisabledReason(actionId, disabledReason)}
                isPending={pendingActionId === actionId}
                onClick={() => runStatusAction(action.statusId)}
              />
            )
          })}
        </div>

        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <QuickActionButton
            label="Request confirmation"
            description="Mark this issue done and ready for confirmation."
            icon={CheckCheck}
            disabledReason={getActionDisabledReason(
              'confirmation:request',
              actorDisabledReason ??
                (data.confirmationRequired
                  ? 'Already waiting for confirmation.'
                  : data.confirmedAt
                    ? 'Already confirmed.'
                    : null),
            )}
            isPending={pendingActionId === 'confirmation:request'}
            onClick={runRequestConfirmationAction}
          />
          <QuickActionButton
            label="Confirm issue"
            description="Clear the confirmation request and keep the issue done."
            icon={CheckCircle2}
            disabledReason={getActionDisabledReason(
              'confirmation:confirm',
              actorDisabledReason ??
                (!data.confirmationRequired ? 'No confirmation pending.' : null),
            )}
            isPending={pendingActionId === 'confirmation:confirm'}
            onClick={runConfirmAction}
          />
        </div>

        {actionMessage ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {actionMessage}
          </p>
        ) : null}
        {actionError ? (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {actionError}
          </p>
        ) : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
          <div className="flex items-center gap-2 text-slate-950">
            <FolderKanban className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Issue context</p>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {secondaryFacts.map((fact) => (
              <MetadataCard key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </div>

          {data.confirmationRequired || data.confirmedByName ? (
            <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-800">
              <div className="flex items-center gap-2 font-medium">
                <CheckCheck className="h-4 w-4" />
                <span>Confirmation context</span>
              </div>
              <p className="mt-1 leading-6">
                {data.confirmationRequired
                  ? 'This issue currently requires confirmation before it is fully closed.'
                  : 'Confirmation is not currently required for this issue.'}
              </p>
              {data.confirmedByName ? (
                <p className="mt-1 leading-6">
                  Confirmed by {data.confirmedByName}
                  {data.confirmedAt ? ` on ${formatDateTime(data.confirmedAt)}` : ''}.
                </p>
              ) : null}
            </div>
          ) : null}

          {data.participantNames.length > 0 ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2 text-slate-950">
                <Users className="h-4 w-4 text-accent" />
                <p className="text-sm font-medium">Participants</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.participantNames.map((participantName) => (
                  <Badge key={`${data.id}-participant-${participantName}`}>
                    {participantName}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <aside className="grid gap-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
            <div className="flex items-center gap-2 text-slate-950">
              <Link2 className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Labels and tags</p>
            </div>

            <div className="mt-4 grid gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-950">
                  <Link2 className="h-4 w-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Labels
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.labelNames.length > 0 ? (
                    data.labelNames.map((labelName) => (
                      <Badge
                        key={`${data.id}-label-${labelName}`}
                        variant={getLabelBadgeVariant(labelName)}
                      >
                        {labelName}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No labels assigned.</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-950">
                  <Tag className="h-4 w-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Tags
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.tagNames.length > 0 ? (
                    data.tagNames.map((tagName) => (
                      <Badge key={`${data.id}-tag-${tagName}`}>
                        #{tagName}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No tags assigned.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
            <div className="flex items-center gap-2 text-slate-950">
              <Clock3 className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium">Timeline summary</p>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-950">Created:</span>{' '}
                {formatDateTime(data.createdAt)}
              </p>
              <p>
                <span className="font-medium text-slate-950">Updated:</span>{' '}
                {formatDateTime(data.updatedAt)}
              </p>
              <p>
                <span className="font-medium text-slate-950">Activity entries:</span>{' '}
                {data.activity.length}
              </p>
            </div>
          </section>
        </aside>
      </div>

      <details className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-5">
        <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium text-slate-950">
          <span className="inline-flex items-center gap-2">
            <History className="h-4 w-4 text-accent" />
            Activity history
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {data.activity.length} entries
          </span>
        </summary>

        <div className="mt-4 grid gap-3">
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
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm leading-6 text-slate-500">
              No activity history has been recorded for this issue yet.
            </div>
          )}
        </div>
      </details>
    </section>
  )
}
