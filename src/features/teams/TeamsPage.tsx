import {
  AlertCircle,
  ArrowRight,
  FolderKanban,
  Layers3,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { Badge, type BadgeVariant } from '../../shared/components/Badge'
import { ContextBreadcrumbs } from '../../shared/components/ContextBreadcrumbs'
import { createIssueNavigationState } from '../issues/issueNavigationState'
import { useTeamWorkspaceView } from './useTeamWorkspaceView'

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getAttentionBadgeVariant(label: string): BadgeVariant {
  if (label === 'Needs Update') {
    return 'warning'
  }

  if (label === 'Ready for Confirmation') {
    return 'violet'
  }

  return 'info'
}

export function TeamsPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const workspaceView = useTeamWorkspaceView({
    currentUserId,
    currentUserName: currentUser?.name ?? null,
    currentUserRole: currentUser?.role ?? null,
  })

  if (workspaceView.status === 'loading') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Team workspace
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Loading team visibility</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading team members, assigned issues, group issue context, and status summaries.
          </p>
        </div>
      </section>
    )
  }

  if (workspaceView.status === 'error') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Team workspace unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{workspaceView.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { data } = workspaceView
  const totalTeams = data.teams.length
  const totalMembers = data.teams.reduce((sum, team) => sum + team.memberNames.length, 0)
  const totalActiveIssues = data.teams.reduce((sum, team) => sum + team.activeIssueCount, 0)
  const totalGroupIssues = data.teams.reduce((sum, team) => sum + team.groupIssueCount, 0)

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-6">
        <ContextBreadcrumbs
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Team Workspace' },
          ]}
        />

        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Team workspace
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Teams</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Lightweight team-level visibility for members, active issue ownership, group issue
              coordination, and structured status balance without drifting into org-management
              behavior.
            </p>
          </div>
          <div className="grid w-full gap-3 text-sm text-slate-600 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-wrap">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="font-medium text-slate-950">{data.currentUserName}</span>
              <span className="mx-2 text-slate-400">·</span>
              <span>{data.currentUserRoleLabel}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              {data.currentTeamName ? `Current team: ${data.currentTeamName}` : 'No current team'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <Users className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Teams</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{totalTeams}</p>
          <p className="mt-1 text-sm text-slate-500">{totalMembers} visible members</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <FolderKanban className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Active issues</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{totalActiveIssues}</p>
          <p className="mt-1 text-sm text-slate-500">Open work across visible teams</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <Layers3 className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Group issues</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{totalGroupIssues}</p>
          <p className="mt-1 text-sm text-slate-500">Cross-member coordination currently visible</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <ShieldAlert className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Attention load</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">
            {data.teams.reduce((sum, team) => sum + team.blockedIssueCount + team.delayedIssueCount, 0)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Blocked/delayed items across team workspaces
          </p>
        </div>
      </div>

      {data.teams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-500 shadow-panel">
          No teams are currently available in the local demo dataset.
        </div>
      ) : null}

      <div className="grid gap-6">
        {data.teams.map((team) => (
          <article
            key={team.id}
            className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-6"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>{team.isCurrentUserTeam ? 'Current team' : 'Team workspace'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{team.memberNames.length} members</span>
                  <span className="text-slate-300">•</span>
                  <span>{team.totalIssueCount} issues</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{team.name}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {team.description}
                </p>
              </div>

              <div className="grid w-full gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:w-auto xl:grid-cols-1">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  {team.activeIssueCount} active · {team.groupIssueCount} group
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  {team.blockedIssueCount} blocked · {team.delayedIssueCount} delayed ·{' '}
                  {team.needsUpdateCount} needs update
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="grid gap-6">
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
                  <p className="text-sm font-medium text-slate-950">Team issue visibility</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Recent team-scoped issues, including the next responsible owner and attention context.
                  </p>

                  <div className="mt-4 grid gap-3">
                    {team.teamIssues.length > 0 ? (
                      team.teamIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                <span>{issue.projectName}</span>
                                <span className="text-slate-300">•</span>
                                <span>{issue.typeLabel}</span>
                                <span className="text-slate-300">•</span>
                                <span>{issue.statusLabel}</span>
                              </div>
                              <h4 className="mt-2 text-sm font-medium text-slate-950">
                                {issue.title}
                              </h4>
                              <p className="mt-2 text-sm text-slate-600">
                                {issue.ownerName} · {issue.priorityLabel} priority
                              </p>
                              {issue.attentionLabels.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {issue.attentionLabels.map((label) => (
                                    <Badge
                                      key={`${issue.id}-${label}`}
                                      variant={getAttentionBadgeVariant(label)}
                                    >
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                              ) : null}
                            </div>

                            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-col lg:items-end">
                              <p className="text-xs text-slate-500">{formatUpdatedAt(issue.updatedAt)}</p>
                              <Link
                                to={`/issues/${issue.id}`}
                                state={createIssueNavigationState({
                                  source: 'teams',
                                  label: 'Team Workspace',
                                  path: '/teams',
                                  backLabel: 'Back to Team Workspace',
                                })}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                              >
                                View issue
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-500">
                        No issues currently point to this team.
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
                  <p className="text-sm font-medium text-slate-950">Group issues</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Team work that depends on coordinated ownership rather than one isolated assignee.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    On group issues, the <span className="font-medium text-slate-700">Curator</span>{' '}
                    is the person holding operational context together. The curator is not
                    automatically the owner or executor.
                  </p>

                  <div className="mt-4 grid gap-3">
                    {team.groupIssues.length > 0 ? (
                      team.groupIssues.map((issue) => (
                        <div
                          key={`${team.id}-group-${issue.id}`}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-950">{issue.title}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                {issue.projectName} · {issue.statusLabel} · {issue.ownerName}
                              </p>
                            </div>
                            <Link
                              to={`/issues/${issue.id}`}
                              state={createIssueNavigationState({
                                source: 'teams',
                                label: 'Team Workspace',
                                path: '/teams',
                                backLabel: 'Back to Team Workspace',
                              })}
                              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                            >
                              Open
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-500">
                        No group issues are currently assigned to this team.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <aside className="grid gap-6">
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
                  <p className="text-sm font-medium text-slate-950">Team members</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {team.memberNames.map((memberName) => (
                      <Badge key={`${team.id}-${memberName}`}>
                        {memberName}
                      </Badge>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
                  <p className="text-sm font-medium text-slate-950">Status summary</p>
                  <div className="mt-4 grid gap-2">
                    {team.statusSummary.length > 0 ? (
                      team.statusSummary.map((status) => (
                        <div
                          key={`${team.id}-${status.statusId}`}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                        >
                          <span className="text-slate-700">{status.statusLabel}</span>
                          <span className="font-medium text-slate-950">{status.count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-500">
                        No status-bearing issues are currently visible for this team.
                      </div>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
