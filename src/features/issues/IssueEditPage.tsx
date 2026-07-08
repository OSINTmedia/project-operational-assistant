import { AlertCircle, ArrowLeft, FilePenLine } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { saveIssueEdits } from '../../domain/issueRules'
import type { DependencyTypeId, IssueTypeId, PriorityId, StatusId } from '../../shared/types'
import { IssueFormFields } from './IssueFormFields'
import { getIssueFormBlockingMessage } from './issueFormValidation'
import {
  useIssueEditFormPrefill,
  type IssueEditFormPrefillData,
} from './useIssueEditFormPrefill'

function getIssueDetailLink(issueId: string | null): string {
  return issueId ? `/issues/${issueId}` : '/projects'
}

export function IssueEditPage() {
  const { issueId } = useParams()
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const editPrefill = useIssueEditFormPrefill({
    issueId: issueId ?? null,
    currentUserId,
    currentUserName: currentUser?.name ?? null,
  })

  if (editPrefill.status === 'loading') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Issue edit
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Edit Issue</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading persisted issue data and structured field options.
          </p>
        </div>
      </section>
    )
  }

  if (editPrefill.status === 'error') {
    return (
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-700">Issue edit form unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{editPrefill.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (editPrefill.status === 'missing') {
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
            Issue edit
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Issue not found</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {editPrefill.message}
          </p>
        </div>
      </section>
    )
  }

  return <IssueEditPageReady issueId={issueId ?? null} data={editPrefill.data} />
}

function IssueEditPageReady({
  issueId,
  data,
}: {
  issueId: string | null
  data: IssueEditFormPrefillData
}) {
  const navigate = useNavigate()
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const [title, setTitle] = useState(data.title)
  const [description, setDescription] = useState(data.description)
  const [type, setType] = useState<IssueTypeId>(data.type)
  const [priority, setPriority] = useState<PriorityId>(data.priority)
  const [dependencyType, setDependencyType] = useState<DependencyTypeId>(data.dependencyType)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(data.tagIds)
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(data.labelIds)
  const [selectedProjectId, setSelectedProjectId] = useState(data.projectId)
  const [selectedStatusId, setSelectedStatusId] = useState<string>(data.statusId)
  const [selectedOwnerId, setSelectedOwnerId] = useState(data.ownerId)
  const [selectedCuratorId, setSelectedCuratorId] = useState(data.curatorId ?? '')
  const [selectedDependencyTargetId, setSelectedDependencyTargetId] = useState(
    data.dependencyTargetId ?? '',
  )
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentProject = useMemo(
    () => data.projectOptions.find((project) => project.id === selectedProjectId) ?? null,
    [data.projectOptions, selectedProjectId],
  )
  const dependencyTargetOptions = selectedProjectId
    ? (data.dependencyTargetOptionsByProjectId[selectedProjectId] ?? [])
    : []

  const blockingMessage = getIssueFormBlockingMessage({
    mode: 'edit',
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

    if (!issueId) {
      setSubmitError('A valid issue id is required to save changes.')
      return
    }

    if (!currentUserId) {
      setSubmitError('A current demo user is required to save issue changes.')
      return
    }

    if (!title.trim()) {
      setSubmitError('Issue title is required.')
      return
    }

    if (!selectedProjectId) {
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
      const savedIssue = await saveIssueEdits({
        issueId,
        actorId: currentUserId,
        title,
        description,
        projectId: selectedProjectId,
        statusId: selectedStatusId as StatusId,
        type,
        priority,
        ownerId: selectedOwnerId,
        curatorId: type === 'group' ? selectedCuratorId : null,
        tagIds: selectedTagIds,
        labelIds: selectedLabelIds,
        preservedSystemLabelIds: data.readonlySystemLabelIds,
        dependencyType,
        dependencyTargetId: dependencyType === 'none' ? null : selectedDependencyTargetId,
      })

      navigate(`/projects/${savedIssue.projectId}`)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to save issue changes in local demo data.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
        <Link
          to={getIssueDetailLink(issueId)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Issue edit
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Edit Issue</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Structured issue editing for the local demo with controlled validation, preserved
              system-label semantics, and repository-backed save behavior.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-950">{data.currentUserName}</p>
            <p className="mt-1">
              Existing issue values are prefilled through repository-backed reads.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex items-start gap-3">
          <FilePenLine className="mt-1 h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-slate-950">Save structured issue changes</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Save updates stay inside domain and repository boundaries and return the user to
              Project Detail after success.
            </p>
          </div>
        </div>

        <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
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

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              <p>
                <span className="font-medium text-slate-950">Current project:</span>{' '}
                {currentProject ? `${currentProject.name} · ${currentProject.teamName}` : 'None'}
              </p>
              <p>
                <span className="font-medium text-slate-950">Save behavior:</span> Persists
                structured changes and returns to Project Detail
              </p>
            </div>
            {data.readonlySystemLabelNames.length > 0 ? (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Current system labels stay outside editable label controls in this slice:{' '}
                {data.readonlySystemLabelNames.join(', ')}.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <p className="text-sm leading-6 text-slate-500">
              Edit save stays inside domain and repository boundaries. System labels remain
              read-only context rather than editable form inputs.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={getIssueDetailLink(issueId)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || Boolean(blockingMessage)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isSubmitting ? 'Saving changes...' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </section>
  )
}
