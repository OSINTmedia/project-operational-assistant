import { AlertCircle, ArrowRightLeft, FolderKanban, RefreshCcw, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { Badge, type BadgeVariant } from '../../shared/components/Badge'
import { createIssueNavigationState } from '../issues/issueNavigationState'
import { usePersonalView, type PersonalIssueSummary, type PersonalSection } from './usePersonalView'

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

function PersonalIssueCard({ issue }: { issue: PersonalIssueSummary }) {
  return (
    <Link
      to={`/issues/${issue.id}`}
      state={createIssueNavigationState({
        source: 'personal',
        label: 'Personal',
        path: '/personal',
        backLabel: 'Back to Personal',
      })}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-panel transition-colors hover:border-slate-300"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>{issue.projectName}</span>
            <span className="text-slate-300">•</span>
            <span>{issue.typeLabel}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-950">{issue.title}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{issue.statusLabel}</Badge>
          <Badge variant="warning">{issue.priorityLabel}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Updated {formatUpdatedAt(issue.updatedAt)}</span>
        {issue.confirmationRequired ? (
          <Badge variant="violet">
            Confirmation required
          </Badge>
        ) : null}
        {issue.attentionLabels.map((label) => (
          <Badge key={`${issue.id}-${label}`} variant={getAttentionBadgeVariant(label)}>
            {label}
          </Badge>
        ))}
      </div>
    </Link>
  )
}

function PersonalSectionCard({ section }: { section: PersonalSection }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-950">{section.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{section.description}</p>
        </div>
        <Badge>
          {section.issues.length}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3">
        {section.issues.length > 0 ? (
          section.issues.map((issue) => <PersonalIssueCard key={issue.id} issue={issue} />)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            {section.emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}

export function PersonalPage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const personalView = usePersonalView({
    currentUserId,
    currentUserName: currentUser?.name ?? null,
    currentUserRole: currentUser?.role ?? null,
  })

  if (personalView.status === 'loading') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            My work surface
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Personal</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading issue relationships for the current demo user.
          </p>
        </div>
      </section>
    )
  }

  if (personalView.status === 'error') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Personal view unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{personalView.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { data } = personalView
  const primarySections = data.sections.filter((section) => section.id !== 'confirmation')
  const confirmationSection = data.sections.find((section) => section.id === 'confirmation') ?? null
  const sectionCounts = new Map(primarySections.map((section) => [section.id, section.issues.length]))

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-4 shadow-panel sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          My work surface
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Personal</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Relationship-based issue groupings for the current demo user, focused on ownership,
              creation, curation, and attention signals without broadening into dashboard metrics.
            </p>
          </div>
          <div className="grid w-full gap-3 text-sm text-slate-600 sm:w-auto">
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <UserCircle2 className="h-4 w-4 text-accent" />
              <span className="min-w-0 font-medium text-slate-950">{data.currentUserName}</span>
              <span className="text-slate-400">·</span>
              <span>{data.currentUserRoleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <FolderKanban className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Assigned to me</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">
            {sectionCounts.get('assigned') ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <ArrowRightLeft className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Created by me</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">
            {sectionCounts.get('created') ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <UserCircle2 className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Curated by me</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">
            {sectionCounts.get('curated') ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center gap-2 text-slate-950">
            <RefreshCcw className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium">Needs update</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">
            {sectionCounts.get('needs-update') ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {primarySections.map((section) => (
          <PersonalSectionCard key={section.id} section={section} />
        ))}

        {confirmationSection ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-950">{confirmationSection.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {confirmationSection.description}
                </p>
              </div>
              <Badge variant="violet">
                {confirmationSection.issues.length}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3">
              {confirmationSection.issues.length > 0 ? (
                confirmationSection.issues.map((issue) => (
                  <PersonalIssueCard key={issue.id} issue={issue} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                  {confirmationSection.emptyMessage}
                </div>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )
}
