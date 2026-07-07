import { useEffect, useMemo, useState } from 'react'
import type { LabelId, ProjectId, TagId, TeamId, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { statusRepository } from '../../repositories/statusRepository'
import { tagRepository } from '../../repositories/tagRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import type { PersistedStatusId } from '../../persistence/records'
import { DEPENDENCY_TYPE_LABELS, ISSUE_TYPE_LABELS, PRIORITY_LABELS } from '../../shared/types'

export interface IssueCreateProjectOption {
  id: ProjectId
  name: string
  teamId: TeamId
  teamName: string
}

export interface IssueCreateUserOption {
  id: UserId
  name: string
  roleLabel: string
}

export interface IssueCreateStatusOption {
  id: PersistedStatusId
  name: string
}

export interface IssueCreateTagOption {
  id: TagId
  name: string
}

export interface IssueCreateLabelOption {
  id: LabelId
  name: string
}

export interface IssueDependencyTargetOption {
  id: string
  title: string
}

export interface IssueCreateFormShellData {
  currentUserName: string
  projectOptions: IssueCreateProjectOption[]
  statusOptions: IssueCreateStatusOption[]
  ownerOptions: IssueCreateUserOption[]
  curatorOptions: IssueCreateUserOption[]
  tagOptions: IssueCreateTagOption[]
  labelOptions: IssueCreateLabelOption[]
  dependencyTargetOptionsByProjectId: Record<ProjectId, IssueDependencyTargetOption[]>
  defaultProjectId: ProjectId | null
  defaultOwnerId: UserId | null
  defaultCuratorId: UserId | null
}

type IssueCreateFormShellState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: IssueCreateFormShellData }

function getRoleLabel(role: string): string {
  switch (role) {
    case 'manager':
      return 'Manager'
    case 'project-manager':
      return 'Project Manager'
    case 'user':
      return 'User'
    default:
      return role
  }
}

export async function loadIssueCreateFormShellData(
  preferredProjectId: ProjectId | null,
  currentUserId: UserId | null,
  currentUserName: string | null,
): Promise<IssueCreateFormShellData> {
  const [projects, teams, statuses, users, tags, labels, issues] = await Promise.all([
    projectRepository.list(),
    teamRepository.list(),
    statusRepository.list(),
    userRepository.list(),
    tagRepository.list(),
    labelRepository.list(),
    issueRepository.list(),
  ])

  const teamNames = new Map(teams.map((team) => [team.id, team.name]))
  const projectsSorted = [...projects].sort((left, right) => left.name.localeCompare(right.name))
  const defaultProjectId =
    preferredProjectId && projects.some((project) => project.id === preferredProjectId)
      ? preferredProjectId
      : (projectsSorted[0]?.id ?? null)
  const defaultOwnerId =
    currentUserId && users.some((user) => user.id === currentUserId) ? currentUserId : null

  return {
    currentUserName: currentUserName ?? 'Current demo user',
    projectOptions: projectsSorted.map((project) => ({
      id: project.id,
      name: project.name,
      teamId: project.teamId,
      teamName: teamNames.get(project.teamId) ?? 'Unknown team',
    })),
    statusOptions: statuses.map((status) => ({
      id: status.id,
      name: status.name,
    })),
    ownerOptions: users.map((user) => ({
      id: user.id,
      name: user.name,
      roleLabel: getRoleLabel(user.role),
    })),
    curatorOptions: users.map((user) => ({
      id: user.id,
      name: user.name,
      roleLabel: getRoleLabel(user.role),
    })),
    tagOptions: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    })),
    labelOptions: labels
      .filter((label) => label.type !== 'system')
      .map((label) => ({
        id: label.id,
        name: label.name,
      })),
    dependencyTargetOptionsByProjectId: issues.reduce<Record<ProjectId, IssueDependencyTargetOption[]>>(
      (accumulator, issue) => {
        if (!accumulator[issue.projectId]) {
          accumulator[issue.projectId] = []
        }

        accumulator[issue.projectId].push({
          id: issue.id,
          title: issue.title,
        })

        return accumulator
      },
      {},
    ),
    defaultProjectId,
    defaultOwnerId,
    defaultCuratorId: defaultOwnerId,
  }
}

export function useIssueCreateFormShell(params: {
  preferredProjectId: ProjectId | null
  currentUserId: UserId | null
  currentUserName: string | null
}): IssueCreateFormShellState {
  const { preferredProjectId, currentUserId, currentUserName } = params
  const [state, setState] = useState<IssueCreateFormShellState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    setState({ status: 'loading' })

    void loadIssueCreateFormShellData(preferredProjectId, currentUserId, currentUserName)
      .then((data) => {
        if (!isActive) {
          return
        }

        setState({
          status: 'ready',
          data,
        })
      })
      .catch((error) => {
        if (!isActive) {
          return
        }

        setState({
          status: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to load issue-create form shell.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, preferredProjectId])

  return useMemo(() => state, [state])
}

export const issueCreateFormShellLabels = {
  type: ISSUE_TYPE_LABELS,
  priority: PRIORITY_LABELS,
  dependency: DEPENDENCY_TYPE_LABELS,
}
