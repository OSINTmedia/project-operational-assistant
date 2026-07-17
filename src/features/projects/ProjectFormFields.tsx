import type { StatusId } from '../../shared/types'
import type { ProjectFormShellData } from './useProjectFormShell'

interface ProjectFormFieldsProps {
  data: ProjectFormShellData
  name: string
  onNameChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  selectedStatusId: StatusId
  onSelectedStatusIdChange: (value: StatusId) => void
  selectedOwnerId: string
  onSelectedOwnerIdChange: (value: string) => void
  selectedTeamId: string
  onSelectedTeamIdChange: (value: string) => void
}

export function ProjectFormFields({
  data,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  selectedStatusId,
  onSelectedStatusIdChange,
  selectedOwnerId,
  onSelectedOwnerIdChange,
  selectedTeamId,
  onSelectedTeamIdChange,
}: ProjectFormFieldsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-950">Project fields</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Project Managers can manage project context without changing issue history directly.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Manager / PM
        </span>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project name
          </span>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Name the project"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={3}
            placeholder="Add a short operational description"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Status
          </span>
          <select
            value={selectedStatusId}
            onChange={(event) => onSelectedStatusIdChange(event.target.value as StatusId)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400"
          >
            {data.statusOptions.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          <span className="text-xs leading-5 text-slate-500">
            If every issue is done, project status is automatically shown and saved as Done.
          </span>
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Owner
          </span>
          <select
            value={selectedOwnerId}
            onChange={(event) => onSelectedOwnerIdChange(event.target.value)}
            disabled={data.ownerOptions.length === 0}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          >
            {data.ownerOptions.length === 0 ? (
              <option value="">No manager options available</option>
            ) : (
              data.ownerOptions.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} · {owner.roleLabel}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Team
          </span>
          <select
            value={selectedTeamId}
            onChange={(event) => onSelectedTeamIdChange(event.target.value)}
            disabled={data.teamOptions.length === 0}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          >
            {data.teamOptions.length === 0 ? (
              <option value="">No teams available</option>
            ) : (
              data.teamOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))
            )}
          </select>
        </label>
      </div>
    </section>
  )
}
