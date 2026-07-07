import { AlertCircle, ArrowLeft, FilePenLine } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import type { DependencyTypeId, IssueTypeId, PriorityId } from '../../shared/types'
import { IssueFormFields } from './IssueFormFields'
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

  const currentProject = useMemo(
    () => data.projectOptions.find((project) => project.id === selectedProjectId) ?? null,
    [data.projectOptions, selectedProjectId],
  )

  function toggleArrayValue(value: string, selectedValues: string[], setter: (values: string[]) => void) {
    setter(
      selectedValues.includes(value)
        ? selectedValues.filter((entry) => entry !== value)
        : [...selectedValues, value],
    )
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
              Structured edit prefill for the local demo. This slice loads persisted issue values
              without enabling save behavior yet.
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
            <p className="text-sm font-medium text-slate-950">Edit form prefill only</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Save wiring lands in `Phase 3.5D`. In this slice, the edit surface exists to confirm
              route handling, field prefill, and controlled invalid-id behavior only.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
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
                <span className="font-medium text-slate-950">Save behavior:</span> Deferred to
                `Phase 3.5D`
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
              This slice preloads edit values only. No save, mutation submit, or activity history
              rendering happens here.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={getIssueDetailLink(issueId)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                Cancel
              </Link>
              <button
                type="button"
                disabled
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white opacity-60"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
