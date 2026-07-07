import type { DependencyTypeId, IssueTypeId, PriorityId } from '../../shared/types'
import {
  issueCreateFormShellLabels,
  type IssueCreateFormShellData,
} from './useIssueCreateFormShell'

type IssueFormFieldsProps = {
  data: IssueCreateFormShellData
  title: string
  onTitleChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  selectedProjectId: string
  onSelectedProjectIdChange: (value: string) => void
  selectedStatusId: string
  onSelectedStatusIdChange: (value: string) => void
  type: IssueTypeId
  onTypeChange: (value: IssueTypeId) => void
  priority: PriorityId
  onPriorityChange: (value: PriorityId) => void
  selectedOwnerId: string
  onSelectedOwnerIdChange: (value: string) => void
  selectedCuratorId: string
  onSelectedCuratorIdChange: (value: string) => void
  dependencyType: DependencyTypeId
  onDependencyTypeChange: (value: DependencyTypeId) => void
  selectedDependencyTargetId: string
  onSelectedDependencyTargetIdChange: (value: string) => void
  selectedTagIds: string[]
  onToggleTagId: (value: string) => void
  selectedLabelIds: string[]
  onToggleLabelId: (value: string) => void
}

export function IssueFormFields({
  data,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  selectedProjectId,
  onSelectedProjectIdChange,
  selectedStatusId,
  onSelectedStatusIdChange,
  type,
  onTypeChange,
  priority,
  onPriorityChange,
  selectedOwnerId,
  onSelectedOwnerIdChange,
  selectedCuratorId,
  onSelectedCuratorIdChange,
  dependencyType,
  onDependencyTypeChange,
  selectedDependencyTargetId,
  onSelectedDependencyTargetIdChange,
  selectedTagIds,
  onToggleTagId,
  selectedLabelIds,
  onToggleLabelId,
}: IssueFormFieldsProps) {
  const dependencyTargetOptions = selectedProjectId
    ? (data.dependencyTargetOptionsByProjectId[selectedProjectId] ?? [])
    : []

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-600 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Title
          </span>
          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
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
            onChange={(event) => onDescriptionChange(event.target.value)}
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
            onChange={(event) => onSelectedProjectIdChange(event.target.value)}
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
            onChange={(event) => onSelectedStatusIdChange(event.target.value)}
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
            onChange={(event) => onTypeChange(event.target.value as IssueTypeId)}
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
            onChange={(event) => onPriorityChange(event.target.value as PriorityId)}
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
            onChange={(event) => onSelectedOwnerIdChange(event.target.value)}
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
            onChange={(event) => onSelectedCuratorIdChange(event.target.value)}
            disabled={type !== 'group'}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          >
            {type !== 'group' ? <option value="">Only relevant for group issues</option> : null}
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
            onChange={(event) => onDependencyTypeChange(event.target.value as DependencyTypeId)}
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
            onChange={(event) => onSelectedDependencyTargetIdChange(event.target.value)}
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
                  onChange={() => onToggleTagId(tag.id)}
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
                  onChange={() => onToggleLabelId(label.id)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>{label.name}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            System labels such as `Needs Update` and `Ready for Confirmation` are intentionally
            excluded from manual selection in this form.
          </p>
        </fieldset>
      </div>
    </>
  )
}
