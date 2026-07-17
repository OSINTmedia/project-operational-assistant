import type { ProjectRecord } from '../../persistence/records'
import {
  issueRepository,
  projectRepository,
  teamRepository,
  userRepository,
  type IssueRepository,
  type ProjectRepository,
  type TeamRepository,
  type UserRepository,
} from '../../repositories'
import type { ProjectId, TeamId, UserId } from '../../entities'
import type { StatusId, UserRoleId } from '../../shared/types'
import { deriveProjectStatusFromIssues } from './syncProjectStatus'

interface ProjectRuleDependencies {
  issueRepository?: IssueRepository
  projectRepository?: ProjectRepository
  teamRepository?: TeamRepository
  userRepository?: UserRepository
  createId?: () => string
  now?: () => string
}

export interface SaveProjectInput {
  actorId: UserId
  actorRole: UserRoleId | null
  name: string
  description: string
  status: StatusId
  ownerId: UserId
  teamId: TeamId
}

export interface SaveProjectEditsInput extends SaveProjectInput {
  projectId: ProjectId
}

function getNow(dependencies: ProjectRuleDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

function getCreateId(dependencies: ProjectRuleDependencies): string {
  return (dependencies.createId ?? (() => crypto.randomUUID()))()
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function assertRequiredId(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`)
  }
}

export function canManageProjects(role: UserRoleId | null): boolean {
  return role === 'manager' || role === 'project-manager'
}

function assertCanManageProjects(role: UserRoleId | null): void {
  if (!canManageProjects(role)) {
    throw new Error('Project management is available to Manager and Project Manager demo roles.')
  }
}

async function assertProjectRelationsExist(
  input: Pick<SaveProjectInput, 'ownerId' | 'teamId'>,
  dependencies: ProjectRuleDependencies,
): Promise<void> {
  const usersRepo = dependencies.userRepository ?? userRepository
  const teamsRepo = dependencies.teamRepository ?? teamRepository
  const [owner, team] = await Promise.all([
    usersRepo.getById(input.ownerId),
    teamsRepo.getById(input.teamId),
  ])

  if (!owner) {
    throw new Error(`Project owner not found: ${input.ownerId}`)
  }

  if (!team) {
    throw new Error(`Project team not found: ${input.teamId}`)
  }
}

export async function createProject(
  input: SaveProjectInput,
  dependencies: ProjectRuleDependencies = {},
): Promise<ProjectRecord> {
  assertCanManageProjects(input.actorRole)
  assertRequiredId(input.actorId, 'Actor')

  const name = normalizeText(input.name)
  const description = normalizeText(input.description)
  const ownerId = normalizeText(input.ownerId)
  const teamId = normalizeText(input.teamId)

  if (!name) {
    throw new Error('Project name is required.')
  }

  assertRequiredId(ownerId, 'Project owner')
  assertRequiredId(teamId, 'Project team')
  await assertProjectRelationsExist({ ownerId, teamId }, dependencies)

  const projectRepo = dependencies.projectRepository ?? projectRepository
  const now = getNow(dependencies)
  const project: ProjectRecord = {
    id: getCreateId(dependencies),
    name,
    description,
    status: input.status,
    ownerId,
    teamId,
    createdBy: input.actorId,
    createdAt: now,
    updatedAt: now,
  }

  await projectRepo.put(project)

  return project
}

export async function saveProjectEdits(
  input: SaveProjectEditsInput,
  dependencies: ProjectRuleDependencies = {},
): Promise<ProjectRecord> {
  assertCanManageProjects(input.actorRole)
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.projectId, 'Project')

  const name = normalizeText(input.name)
  const description = normalizeText(input.description)
  const ownerId = normalizeText(input.ownerId)
  const teamId = normalizeText(input.teamId)

  if (!name) {
    throw new Error('Project name is required.')
  }

  assertRequiredId(ownerId, 'Project owner')
  assertRequiredId(teamId, 'Project team')
  await assertProjectRelationsExist({ ownerId, teamId }, dependencies)

  const projectRepo = dependencies.projectRepository ?? projectRepository
  const issuesRepo = dependencies.issueRepository ?? issueRepository
  const existingProject = await projectRepo.getById(input.projectId)

  if (!existingProject) {
    throw new Error(`Project not found: ${input.projectId}`)
  }

  const projectIssues = await issuesRepo.listByProjectId(existingProject.id)
  const nextStatus = deriveProjectStatusFromIssues(projectIssues, input.status)
  const nextProject: ProjectRecord = {
    ...existingProject,
    name,
    description,
    status: nextStatus,
    ownerId,
    teamId,
    updatedAt: getNow(dependencies),
  }

  await projectRepo.put(nextProject)

  return nextProject
}
