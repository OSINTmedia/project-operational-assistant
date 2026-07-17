import { AlertCircle, ArrowLeft, FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentDemoUser, useDemoAppState } from '../../app/state/useDemoAppState'
import { createProject } from '../../domain/projectRules'
import { ContextBreadcrumbs } from '../../shared/components/ContextBreadcrumbs'
import type { StatusId } from '../../shared/types'
import { ProjectFormFields } from './ProjectFormFields'
import { type ProjectFormShellData, useProjectFormShell } from './useProjectFormShell'

function getProjectFormBlockingMessage(params: {
  canManageProjects: boolean
  name: string
  selectedStatusId: string
  selectedOwnerId: string
  selectedTeamId: string
  ownerOptionCount: number
  teamOptionCount: number
}): string | null {
  if (!params.canManageProjects) {
    return 'Project management is available to Manager and Project Manager demo roles.'
  }

  if (!params.name.trim()) {
    return 'Project name is required.'
  }

  if (params.ownerOptionCount === 0 || !params.selectedOwnerId) {
    return 'A project owner is required.'
  }

  if (params.teamOptionCount === 0 || !params.selectedTeamId) {
    return 'A project team is required.'
  }

  if (!params.selectedStatusId) {
    return 'Project status is required.'
  }

  return null
}

export function ProjectCreatePage() {
  const demoUsers = useDemoAppState((state) => state.demoUsers)
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const currentUser = getCurrentDemoUser(demoUsers, currentUserId)
  const formShell = useProjectFormShell({
    projectId: null,
    currentUserId,
    currentUserName: currentUser?.name ?? null,
    currentUserRole: currentUser?.role ?? null,
  })

  if (formShell.status === 'loading') {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project create
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Create Project</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Loading project management options for the current demo user.
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
              <p className="text-sm font-semibold text-rose-700">
                Project create form unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{formShell.message}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (formShell.status === 'missing') {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project create
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Project form unavailable</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {formShell.message}
          </p>
        </div>
      </section>
    )
  }

  return <ProjectCreatePageReady data={formShell.data} />
}

function ProjectCreatePageReady({ data }: { data: ProjectFormShellData }) {
  const navigate = useNavigate()
  const currentUserId = useDemoAppState((state) => state.currentUserId)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedStatusId, setSelectedStatusId] = useState<StatusId>(
    data.statusOptions.find((status) => status.id === 'planned')?.id ??
      data.statusOptions[0]?.id ??
      'new',
  )
  const [selectedOwnerId, setSelectedOwnerId] = useState(data.defaultOwnerId ?? '')
  const [selectedTeamId, setSelectedTeamId] = useState(data.defaultTeamId ?? '')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const blockingMessage = getProjectFormBlockingMessage({
    canManageProjects: data.canManageProjects,
    name,
    selectedStatusId,
    selectedOwnerId,
    selectedTeamId,
    ownerOptionCount: data.ownerOptions.length,
    teamOptionCount: data.teamOptions.length,
  })
  const formId = 'project-create-form'

  if (!data.canManageProjects) {
    return (
      <section className="grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-panel sm:p-5">
          <ContextBreadcrumbs
            items={[
              { label: 'Projects', to: '/projects' },
              { label: 'Create project' },
            ]}
          />

          <Link
            to="/projects"
            className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Project create
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Project management locked</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Project management is available to Manager and Project Manager demo roles. Switch demo
            role to manage project records.
          </p>
        </div>
      </section>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (blockingMessage) {
      setSubmitError(blockingMessage)
      return
    }

    if (!currentUserId) {
      setSubmitError('A current demo user is required to create a project.')
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const project = await createProject({
        actorId: currentUserId,
        actorRole: data.currentUserRole,
        name,
        description,
        status: selectedStatusId,
        ownerId: selectedOwnerId,
        teamId: selectedTeamId,
      })

      navigate(`/projects/${project.id}`)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create project in local demo data.',
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
            { label: 'Create project' },
          ]}
        />

        <Link
          to="/projects"
          className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Project create
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-2xl">
              Create Project
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Create a project frame for demo work. Save opens the new project; cancel returns to
              Projects.
            </p>
          </div>

          <div className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 lg:max-w-sm">
            <p className="font-medium text-slate-950">{data.currentUserName}</p>
            <p className="mt-1 hidden sm:block">{data.currentUserRoleLabel}</p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4">
        <div className="flex items-start gap-3">
          <FolderPlus className="mt-1 h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-slate-950">Create project context</p>
            <p className="mt-1 hidden text-sm leading-6 text-slate-600 sm:block">
              The form writes through project domain rules and local repositories.
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
                  <span className="font-medium text-slate-950">After create:</span> open new
                  project detail
                </p>
                <p>
                  <span className="font-medium text-slate-950">Cancel:</span> return to Projects
                </p>
              </div>
              <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-auto">
                <Link
                  to="/projects"
                  aria-label="Cancel project creation and return to Projects."
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                >
                  Cancel to Projects
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(blockingMessage)}
                  className="min-h-10 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating project...' : 'Create project'}
                </button>
              </div>
            </div>
          </div>

          <ProjectFormFields
            data={data}
            name={name}
            onNameChange={setName}
            description={description}
            onDescriptionChange={setDescription}
            selectedStatusId={selectedStatusId}
            onSelectedStatusIdChange={setSelectedStatusId}
            selectedOwnerId={selectedOwnerId}
            onSelectedOwnerIdChange={setSelectedOwnerId}
            selectedTeamId={selectedTeamId}
            onSelectedTeamIdChange={setSelectedTeamId}
          />
        </form>
      </section>
    </section>
  )
}
