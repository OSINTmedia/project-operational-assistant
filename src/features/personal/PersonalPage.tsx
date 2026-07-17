import { AlertCircle, UserCircle2 } from 'lucide-react'
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
        label: 'Personal work',
        path: '/personal',
        backLabel: 'Back to Personal work',
      })}
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-panel transition-colors hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>{issue.projectName}</span>
            <span className="text-slate-300">•</span>
            <span>{issue.typeLabel}</span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-950">{issue.title}</h3>
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
  const sectionTone =
    section.id === 'needs-update'
      ? 'border-orange-200 bg-orange-50/30'
      : section.id === 'confirmation'
        ? 'border-violet-200 bg-violet-50/30'
        : 'border-slate-200 bg-panel'

  return (
    <section className={`rounded-xl border p-3 shadow-panel sm:p-4 ${sectionTone}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-950">{section.title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{section.description}</p>
        </div>
        <Badge variant={section.id === 'confirmation' ? 'violet' : undefined}>
          {section.issues.length}
        </Badge>
      </div>

      <div className="mt-3 grid gap-2">
        {section.issues.length > 0 ? (
          section.issues.map((issue) => <PersonalIssueCard key={issue.id} issue={issue} />)
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm leading-6 text-slate-500">
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
      <section className="grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
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
      <section className="grid gap-4">
        <div className="rounded-xl border border-rose-200 bg-white p-3 shadow-panel sm:p-5">
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
  const sectionsById = new Map(data.sections.map((section) => [section.id, section]))
  const prioritySectionIds: PersonalSection['id'][] = [
    'needs-update',
    'confirmation',
    'assigned',
    'curated',
  ]
  const secondarySectionIds: PersonalSection['id'][] = ['created']
  const prioritySections = prioritySectionIds
    .map((sectionId) => sectionsById.get(sectionId))
    .filter((section): section is PersonalSection => Boolean(section))
  const secondarySections = secondarySectionIds
    .map((sectionId) => sectionsById.get(sectionId))
    .filter((section): section is PersonalSection => Boolean(section))
  const sectionCounts = new Map(data.sections.map((section) => [section.id, section.issues.length]))
  const summaryChips = [
    { label: 'Needs Update', value: sectionCounts.get('needs-update') ?? 0 },
    { label: 'Ready for Confirmation', value: sectionCounts.get('confirmation') ?? 0 },
    { label: 'Assigned', value: sectionCounts.get('assigned') ?? 0 },
    { label: 'Curated', value: sectionCounts.get('curated') ?? 0 },
  ]

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          My work surface
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Personal</h2>
            <p className="mt-2 hidden max-w-3xl text-sm leading-6 text-slate-600 sm:block">
              Focused work for the selected user: update stale context, confirm completed work, or
              continue assigned and curated issues.
            </p>
          </div>
          <div className="grid w-full gap-2 text-sm text-slate-600 sm:w-auto">
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <UserCircle2 className="h-4 w-4 text-accent" />
              <span className="min-w-0 font-medium text-slate-950">{data.currentUserName}</span>
              <span className="text-slate-400">·</span>
              <span>{data.currentUserRoleLabel}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {summaryChips.map((chip) => (
            <div
              key={chip.label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
            >
              <span className="text-slate-950">{chip.value}</span>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {prioritySections.map((section) => (
          <PersonalSectionCard key={section.id} section={section} />
        ))}
      </div>

      {secondarySections.length > 0 ? (
        <section className="grid gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Monitoring</p>
            <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
              Created work remains available after the immediate action queues.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {secondarySections.map((section) => (
              <PersonalSectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
