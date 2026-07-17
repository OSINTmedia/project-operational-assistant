import type { IssueRecord, ProjectRecord } from '../../persistence/records'
import {
  issueRepository,
  projectRepository,
  type IssueRepository,
  type ProjectRepository,
} from '../../repositories'
import type { ProjectId } from '../../entities'
import type { StatusId } from '../../shared/types'

interface SyncProjectStatusDependencies {
  issueRepository?: IssueRepository
  projectRepository?: ProjectRepository
  now?: () => string
}

function getNow(dependencies: SyncProjectStatusDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

export function deriveProjectStatusFromIssues(
  issues: IssueRecord[],
  fallbackStatus: StatusId,
): StatusId {
  if (issues.length === 0) {
    return fallbackStatus
  }

  if (issues.every((issue) => issue.statusId === 'done')) {
    return 'done'
  }

  if (issues.every((issue) => issue.statusId === 'canceled')) {
    return 'canceled'
  }

  if (issues.some((issue) => issue.statusId === 'blocked')) {
    return 'blocked'
  }

  if (issues.some((issue) => issue.statusId === 'delayed')) {
    return 'delayed'
  }

  if (issues.some((issue) => issue.statusId === 'in-progress')) {
    return 'in-progress'
  }

  if (issues.some((issue) => issue.statusId === 'waiting')) {
    return 'waiting'
  }

  if (issues.some((issue) => issue.statusId === 'planned')) {
    return 'planned'
  }

  if (issues.some((issue) => issue.statusId === 'new')) {
    return 'new'
  }

  return fallbackStatus
}

export async function syncProjectStatusFromIssues(
  projectId: ProjectId,
  dependencies: SyncProjectStatusDependencies = {},
): Promise<ProjectRecord | null> {
  const projectsRepo = dependencies.projectRepository ?? projectRepository
  const issuesRepo = dependencies.issueRepository ?? issueRepository
  const project = await projectsRepo.getById(projectId)

  if (!project) {
    return null
  }

  const projectIssues = await issuesRepo.listByProjectId(projectId)
  const nextStatus = deriveProjectStatusFromIssues(projectIssues, project.status)

  if (project.status === nextStatus) {
    return project
  }

  const nextProject: ProjectRecord = {
    ...project,
    status: nextStatus,
    updatedAt: getNow(dependencies),
  }

  await projectsRepo.put(nextProject)

  return nextProject
}
