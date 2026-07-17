import {
  AlertCircle,
  ArrowRight,
  FolderKanban,
  Plus,
  RefreshCcw,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { canManageProjects } from '../../domain/projectRules'
import { Badge } from '../../shared/components/Badge'
import { useProjectsListView } from './useProjectsListView'

function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ProjectsPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const projectsView = useProjectsListView({
    currentUserId,
    currentUserName: currentUser?.name ?? null,
    currentUserRole: currentUser?.role ?? null,
  })
  const canManageProjectRecords = canManageProjects(currentUser?.role ?? null)

  if (projectsView.status === 'loading') {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project navigation
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Projects</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading project list visibility for the current demo user.
          </p>
        </div>
      </section>
    )
  }

  if (projectsView.status === 'error') {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-rose-200 bg-white p-3 shadow-panel sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Projects view unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{projectsView.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { data } = projectsView
  const portfolioChips = [
    {
      label: 'Projects',
      value: data.projectCount,
      detail: `${data.totalIssueCount} issues`,
      icon: FolderKanban,
    },
    {
      label: 'Active',
      value: data.activeIssueCount,
      detail: 'open work',
      icon: RefreshCcw,
    },
    {
      label: 'Blocked/delayed',
      value: data.blockedIssueCount,
      detail: 'needs attention',
      icon: ShieldAlert,
    },
    {
      label: 'Needs Update',
      value: data.needsUpdateCount,
      detail: 'stale context',
      icon: Users,
    },
  ] as const

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Project navigation
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Projects</h2>
            <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-600 sm:block">
              Choose the active project frame, with risk and action counts visible inline before
              opening detail.
            </p>
          </div>
          <div className="grid w-full gap-3 text-sm text-slate-600 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
            {canManageProjectRecords ? (
              <Link
                to="/projects/new"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 sm:col-span-2 lg:order-last"
              >
                <Plus className="h-4 w-4" />
                Create project
              </Link>
            ) : null}
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="font-medium text-slate-950">{data.currentUserName}</span>
              <span className="mx-2 text-slate-400">·</span>
              <span>{data.currentUserRoleLabel}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              {data.projectCount} demo project{data.projectCount === 1 ? '' : 's'} visible
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {portfolioChips.map((chip) => {
            const Icon = chip.icon
            return (
              <div
                key={chip.label}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accentSoft text-accent">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">
                    {chip.value} {chip.label}
                  </p>
                  <p className="text-xs text-slate-500">{chip.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {data.projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-500 shadow-panel">
          No projects are visible in the current demo dataset. This screen is meant to summarize
          project status, issue load, and attention signals once project records exist.
        </div>
      ) : null}

      <div className="grid gap-3 xl:hidden">
        {data.projects.map((project) => (
          <article
            key={project.id}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>{project.teamName}</span>
                  <span className="text-slate-300">•</span>
                  <Badge>{project.statusLabel}</Badge>
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-950 sm:text-lg">
                  {project.name}
                </h3>
                <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
                  {project.description}
                </p>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 sm:w-auto"
              >
                View project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                Owner: {project.ownerName}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                {project.activeIssueCount} active
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                {project.blockedIssueCount} blocked/delayed
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                {project.needsUpdateCount} Needs Update
              </span>
            </div>
          </article>
        ))}
      </div>

      <section className="hidden rounded-xl border border-slate-200 bg-white shadow-panel xl:block">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-sm font-medium text-slate-950">Project chooser</p>
          <p className="mt-1 text-sm text-slate-600">
            Open a project with risk and action counts visible in the row.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Issues</th>
                <th className="px-5 py-3">Attention</th>
                <th className="px-5 py-3">Latest activity</th>
                <th className="px-5 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {data.projects.map((project) => (
                <tr key={project.id} className="align-top">
                  <td className="px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-950">{project.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{project.teamName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge>{project.statusLabel}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">{project.ownerName}</td>
                  <td className="px-5 py-3 text-sm text-slate-700">
                    <div>{project.totalIssueCount} total</div>
                    <div className="mt-1 text-slate-500">{project.activeIssueCount} active</div>
                    <div className="mt-1 text-slate-500">{project.doneIssueCount} done</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">
                    <div>{project.blockedIssueCount} blocked/delayed</div>
                    <div className="mt-1 text-slate-500">
                      {project.needsUpdateCount} needs update
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">
                    {formatUpdatedAt(project.lastActivityAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
