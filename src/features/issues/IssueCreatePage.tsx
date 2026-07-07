import { AlertCircle, ArrowLeft, CirclePlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import type { DependencyTypeId, IssueTypeId, PriorityId } from '../../shared/types'
import {
  useIssueCreateFormShell,
  issueCreateFormShellLabels,
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
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
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
      <section className="grid gap-6">
        <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
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

  const dependencyTargetOptions = useMemo(
    () =>
      selectedProjectId
        ? (data.dependencyTargetOptionsByProjectId[selectedProjectId] ?? [])
        : [],
    [data.dependencyTargetOptionsByProjectId, selectedProjectId],
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
          to={getBackLink(projectId ?? null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Issue create
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Create Issue</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Structured creation shell for the local demo. This slice exposes the full form
              surface without wiring persistence submit behavior yet.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-950">{data.currentUserName}</p>
            <p className="mt-1">
              Default owner and curator choices follow the current demo context where sensible.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex items-start gap-3">
          <CirclePlus className="mt-1 h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-slate-950">Create form shell only</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Submit wiring lands in `Phase 3.5B`. In this slice, the form exists to confirm
              field structure, defaults, and navigation only.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Summarize the issue briefly"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="Add optional context for the issue"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Project
              </span>
              <select
                value={selectedProjectId}
                onChange={(event) => {
                  setSelectedProjectId(event.target.value)
                  setSelectedDependencyTargetId('')
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              >
                {data.projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} · {project.teamName}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Status
              </span>
              <select
                value={selectedStatusId}
                onChange={(event) => setSelectedStatusId(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              >
                {data.statusOptions.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Type
              </span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as IssueTypeId)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              >
                {Object.entries(issueCreateFormShellLabels.type).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Priority
              </span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as PriorityId)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              >
                {Object.entries(issueCreateFormShellLabels.priority).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Owner
              </span>
              <select
                value={selectedOwnerId}
                onChange={(event) => setSelectedOwnerId(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              >
                {data.ownerOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · {user.roleLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Curator
              </span>
              <select
                value={type === 'group' ? selectedCuratorId : ''}
                onChange={(event) => setSelectedCuratorId(event.target.value)}
                disabled={type !== 'group'}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
              >
                {type !== 'group' ? (
                  <option value="">Only relevant for group issues</option>
                ) : null}
                {data.curatorOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · {user.roleLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Dependency
              </span>
              <select
                value={dependencyType}
                onChange={(event) => {
                  setDependencyType(event.target.value as DependencyTypeId)
                  setSelectedDependencyTargetId('')
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
              >
                {Object.entries(issueCreateFormShellLabels.dependency).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Dependency target
              </span>
              <select
                value={selectedDependencyTargetId}
                onChange={(event) => setSelectedDependencyTargetId(event.target.value)}
                disabled={dependencyType === 'none' || dependencyTargetOptions.length === 0}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
              >
                {dependencyType === 'none' ? (
                  <option value="">No dependency target needed</option>
                ) : dependencyTargetOptions.length === 0 ? (
                  <option value="">No issue targets in this project yet</option>
                ) : (
                  <>
                    <option value="">Select related issue</option>
                    {dependencyTargetOptions.map((issue) => (
                      <option key={issue.id} value={issue.id}>
                        {issue.title}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Tags
              </legend>
              <div className="mt-3 grid gap-2">
                {data.tagOptions.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => toggleArrayValue(tag.id, selectedTagIds, setSelectedTagIds)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Labels
              </legend>
              <div className="mt-3 grid gap-2">
                {data.labelOptions.map((label) => (
                  <label key={label.id} className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedLabelIds.includes(label.id)}
                      onChange={() =>
                        toggleArrayValue(label.id, selectedLabelIds, setSelectedLabelIds)
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span>{label.name}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                System labels such as `Needs Update` and `Ready for Confirmation` are intentionally
                excluded from manual selection in this shell.
              </p>
            </fieldset>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              <p>
                <span className="font-medium text-slate-950">Current project:</span>{' '}
                {currentProject ? `${currentProject.name} · ${currentProject.teamName}` : 'None'}
              </p>
              <p>
                <span className="font-medium text-slate-950">Submit behavior:</span> Deferred to
                `Phase 3.5B`
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <p className="text-sm leading-6 text-slate-500">
              This shell confirms field structure only. No repository writes or activity history
              writes happen in this slice.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={getBackLink(projectId ?? null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
              >
                Cancel
              </Link>
              <button
                type="button"
                disabled
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white opacity-60"
              >
                Create issue
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
