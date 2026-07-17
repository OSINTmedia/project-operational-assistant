import { useEffect, useMemo, useState } from 'react'
import { canManageProjects, deriveProjectStatusFromIssues } from '../../domain/projectRules'
import type { ProjectId, TeamId, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import {
  DEFAULT_STATUS_IDS,
  STATUS_LABELS,
  USER_ROLE_LABELS,
  type StatusId,
  type UserRoleId,
} from '../../shared/types'

export interface ProjectFormUserOption {
  id: UserId
  name: string
  roleLabel: string
}

export interface ProjectFormTeamOption {
  id: TeamId
  name: string
}

export interface ProjectFormStatusOption {
  id: StatusId
  name: string
}

export interface ProjectFormProjectData {
  id: ProjectId
  name: string
  description: string
  status: StatusId
  ownerId: UserId
  teamId: TeamId
}

export interface ProjectFormShellData {
  currentUserName: string
  currentUserRole: UserRoleId
  currentUserRoleLabel: string
  canManageProjects: boolean
  project: ProjectFormProjectData | null
  ownerOptions: ProjectFormUserOption[]
  teamOptions: ProjectFormTeamOption[]
  statusOptions: ProjectFormStatusOption[]
  defaultOwnerId: UserId | null
  defaultTeamId: TeamId | null
}

type ProjectFormShellState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing'; message: string }
  | { status: 'ready'; data: ProjectFormShellData }

async function loadProjectFormShellData(params: {
  projectId: ProjectId | null
  currentUserId: UserId
  currentUserName: string
  currentUserRole: UserRoleId
}): Promise<ProjectFormShellData | null> {
  const { projectId, currentUserId, currentUserName, currentUserRole } = params
  const [project, users, teams, projectIssues] = await Promise.all([
    projectId ? projectRepository.getById(projectId) : Promise.resolve(undefined),
    userRepository.list(),
    teamRepository.list(),
    projectId ? issueRepository.listByProjectId(projectId) : Promise.resolve([]),
  ])

  if (projectId && !project) {
    return null
  }

  const ownerOptions = users
    .filter((user) => canManageProjects(user.role))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((user) => ({
      id: user.id,
      name: user.name,
      roleLabel: USER_ROLE_LABELS[user.role],
    }))
  const teamOptions = teams
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((team) => ({
      id: team.id,
      name: team.name,
    }))

  return {
    currentUserName,
    currentUserRole,
    currentUserRoleLabel: USER_ROLE_LABELS[currentUserRole],
    canManageProjects: canManageProjects(currentUserRole),
    project: project
      ? {
          id: project.id,
          name: project.name,
          description: project.description,
          status: deriveProjectStatusFromIssues(projectIssues, project.status),
          ownerId: project.ownerId,
          teamId: project.teamId,
        }
      : null,
    ownerOptions,
    teamOptions,
    statusOptions: DEFAULT_STATUS_IDS.map((statusId) => ({
      id: statusId,
      name: STATUS_LABELS[statusId],
    })),
    defaultOwnerId:
      ownerOptions.find((owner) => owner.id === currentUserId)?.id ?? ownerOptions[0]?.id ?? null,
    defaultTeamId:
      teams.find((team) => team.memberIds.includes(currentUserId))?.id ?? teamOptions[0]?.id ?? null,
  }
}

export function useProjectFormShell(params: {
  projectId: ProjectId | null
  currentUserId: UserId | null
  currentUserName: string | null
  currentUserRole: UserRoleId | null
}): ProjectFormShellState {
  const { projectId, currentUserId, currentUserName, currentUserRole } = params
  const [state, setState] = useState<ProjectFormShellState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!currentUserId || !currentUserName || !currentUserRole) {
      setState({
        status: 'error',
        message: 'A demo user must be selected before project management can load.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadProjectFormShellData({
      projectId,
      currentUserId,
      currentUserName,
      currentUserRole,
    })
      .then((data) => {
        if (!isActive) {
          return
        }

        if (!data) {
          setState({
            status: 'missing',
            message: `No demo project was found for id "${projectId}".`,
          })
          return
        }

        setState({ status: 'ready', data })
      })
      .catch((error) => {
        if (!isActive) {
          return
        }

        setState({
          status: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to load project management options.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, currentUserRole, projectId])

  return useMemo(() => state, [state])
}
