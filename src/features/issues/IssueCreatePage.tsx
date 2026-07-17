import { AlertCircle, ArrowLeft, CirclePlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { createIssue } from '../../domain/issueRules'
import { ContextBreadcrumbs } from '../../shared/components/ContextBreadcrumbs'
import type { DependencyTypeId, IssueTypeId, PriorityId, StatusId } from '../../shared/types'
import { IssueFormFields } from './IssueFormFields'
import { getIssueFormBlockingMessage } from './issueFormValidation'
import {
  useIssueCreateFormShell,
  type IssueCreateFormShellData,
} from './useIssueCreateFormShell'

function getBackLink(projectId: string | null): string {
  return projectId ? `/projects/${projectId}` : '/projects'
}

export function IssueCreatePage() {
  const { projectId } = useParams()
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const formShell = useIssueCreateFormShell({
    preferredProjectId: projectId ?? null,
    currentUserId,
    currentUserName: currentUser?.name ?? null,
  })

  if (formShell.status === 'loading') {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Issue create
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Create Issue</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading structured form options for the selected project context.
          </p>
        </div>
      </section>
    )
  }

  if (formShell.status === 'error') {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-rose-200 bg-white p-3 shadow-panel sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Issue create form unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{formShell.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return <IssueCreatePageReady data={formShell.data} projectId={projectId ?? null} />
}

function IssueCreatePageReady({
  data,
  projectId,
}: {
  data: IssueCreateFormShellData
  projectId: string | null
}) {
  const navigate = useNavigate()
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<IssueTypeId>('individual')
  const [priority, setPriority] = useState<PriorityId>('medium')
  const [dependencyType, setDependencyType] = useState<DependencyTypeId>('none')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState(data.defaultProjectId ?? '')
  const [selectedStatusId, setSelectedStatusId] = useState<string>(
    data.statusOptions.find((status) => status.id === 'new')?.id ?? data.statusOptions[0]?.id ?? '',
  )
  const [selectedOwnerId, setSelectedOwnerId] = useState(data.defaultOwnerId ?? '')
  const [selectedCuratorId, setSelectedCuratorId] = useState(
    type === 'group' ? (data.defaultCuratorId ?? '') : '',
  )
  const [selectedDependencyTargetId, setSelectedDependencyTargetId] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentProject = useMemo(
    () => data.projectOptions.find((project) => project.id === selectedProjectId) ?? null,
    [data.projectOptions, selectedProjectId],
  )
  const backLinkTarget = currentProject
    ? `/projects/${currentProject.id}`
    : getBackLink(projectId ?? null)
  const returnDestinationLabel = currentProject ? currentProject.name : 'Projects'
  const dependencyTargetOptions = selectedProjectId
    ? (data.dependencyTargetOptionsByProjectId[selectedProjectId] ?? [])
    : []

  const blockingMessage = getIssueFormBlockingMessage({
    mode: 'create',
    title,
    selectedProjectId,
    selectedStatusId,
    selectedOwnerId,
    type,
    selectedCuratorId,
    dependencyType,
    selectedDependencyTargetId,
    projectOptionCount: data.projectOptions.length,
    statusOptionCount: data.statusOptions.length,
    ownerOptionCount: data.ownerOptions.length,
    curatorOptionCount: data.curatorOptions.length,
    dependencyTargetOptionCount: dependencyTargetOptions.length,
    currentProjectAvailable: currentProject !== null,
  })
  const formId = 'issue-create-form'

  function toggleArrayValue(value: string, selectedValues: string[], setter: (values: string[]) => void) {
    setter(
      selectedValues.includes(value)
        ? selectedValues.filter((entry) => entry !== value)
        : [...selectedValues, value],
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (blockingMessage) {
      setSubmitError(blockingMessage)
      return
    }

    if (!currentUserId) {
      setSubmitError('A current demo user is required to create an issue.')
      return
    }

    if (!title.trim()) {
      setSubmitError('Issue title is required.')
      return
    }

    if (!selectedProjectId || !currentProject) {
      setSubmitError('A valid project is required.')
      return
    }

    if (!selectedStatusId) {
      setSubmitError('Status is required.')
      return
    }

    if (!selectedOwnerId) {
      setSubmitError('Owner is required.')
      return
    }

    if (type === 'group' && !selectedCuratorId) {
      setSubmitError('Group issues require a curator.')
      return
    }

    if (dependencyType !== 'none' && !selectedDependencyTargetId) {
      setSubmitError('A dependency target is required when a dependency is selected.')
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await createIssue({
        title,
        description,
        projectId: selectedProjectId,
        teamId: currentProject.teamId,
        actorId: currentUserId,
        ownerId: selectedOwnerId,
        curatorId: type === 'group' ? selectedCuratorId : null,
        type,
        statusId: selectedStatusId as StatusId,
        priority,
        tagIds: selectedTagIds,
        labelIds: selectedLabelIds,
        dependencyType,
        dependencyTargetId: dependencyType === 'none' ? null : selectedDependencyTargetId,
      })

      navigate(`/projects/${selectedProjectId}`)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create issue in local demo data.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
        <ContextBreadcrumbs
          items={[
            { label: 'Projects', to: '/projects' },
            currentProject
              ? { label: currentProject.name, to: `/projects/${currentProject.id}` }
              : { label: 'Project context' },
            { label: 'Create issue' },
          ]}
        />

        <Link
          to={backLinkTarget}
          className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentProject ? `Back to ${currentProject.name}` : 'Back to Projects'}
        </Link>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Issue create
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-2xl">Create Issue</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Create a project-scoped issue with required fields first. Create and cancel return to{' '}
              {returnDestinationLabel}.
            </p>
          </div>

          <div className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 lg:max-w-sm">
            <p className="font-medium text-slate-950">{data.currentUserName}</p>
            <p className="mt-1 hidden sm:block">Default owner and curator choices follow the demo context.</p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4">
        <div className="flex items-start gap-3">
          <CirclePlus className="mt-1 h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-slate-950">Create issue</p>
            <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
              Uses the existing local domain service with controlled validation and structured
              defaults.
            </p>
          </div>
        </div>

        <form id={formId} className="mt-4 grid gap-4" onSubmit={handleSubmit}>
          {submitError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          {!submitError && blockingMessage ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {blockingMessage}
            </div>
          ) : null}

          <div className="sticky top-2 z-10 rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-panel backdrop-blur sm:top-3 sm:p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid gap-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-950">Project:</span>{' '}
                  {currentProject ? `${currentProject.name} · ${currentProject.teamName}` : 'None'}
                </p>
                <p>
                  <span className="font-medium text-slate-950">After create:</span> return to{' '}
                  {returnDestinationLabel}
                </p>
              </div>
              <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-auto">
                <Link
                  to={backLinkTarget}
                  aria-label={`Cancel issue creation and return to ${returnDestinationLabel}.`}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                >
                  Cancel to {returnDestinationLabel}
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(blockingMessage)}
                  className="min-h-10 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating issue...' : 'Create issue'}
                </button>
              </div>
            </div>
          </div>

          <IssueFormFields
            data={data}
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            selectedProjectId={selectedProjectId}
            onSelectedProjectIdChange={(value) => {
              setSelectedProjectId(value)
              setSelectedDependencyTargetId('')
            }}
            selectedStatusId={selectedStatusId}
            onSelectedStatusIdChange={setSelectedStatusId}
            type={type}
            onTypeChange={(value) => {
              setType(value)
              if (value !== 'group') {
                setSelectedCuratorId('')
              } else if (!selectedCuratorId) {
                setSelectedCuratorId(data.defaultCuratorId ?? '')
              }
            }}
            priority={priority}
            onPriorityChange={setPriority}
            selectedOwnerId={selectedOwnerId}
            onSelectedOwnerIdChange={setSelectedOwnerId}
            selectedCuratorId={selectedCuratorId}
            onSelectedCuratorIdChange={setSelectedCuratorId}
            dependencyType={dependencyType}
            onDependencyTypeChange={(value) => {
              setDependencyType(value)
              setSelectedDependencyTargetId('')
            }}
            selectedDependencyTargetId={selectedDependencyTargetId}
            onSelectedDependencyTargetIdChange={setSelectedDependencyTargetId}
            selectedTagIds={selectedTagIds}
            onToggleTagId={(value) => toggleArrayValue(value, selectedTagIds, setSelectedTagIds)}
            selectedLabelIds={selectedLabelIds}
            onToggleLabelId={(value) =>
              toggleArrayValue(value, selectedLabelIds, setSelectedLabelIds)
            }
          />

          <p className="text-xs leading-5 text-slate-500">
            The create flow stays inside repository and domain-service boundaries. Only title and
            description remain open text.
          </p>
        </form>
      </section>
    </section>
  )
}
