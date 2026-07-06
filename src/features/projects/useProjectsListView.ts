import { useEffect, useMemo, useState } from 'react'
import type { ProjectId, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import { STATUS_LABELS, USER_ROLE_LABELS, type UserRoleId } from '../../shared/types'

const NEEDS_UPDATE_LABEL_NAME = 'Needs Update'

export interface ProjectListItem {
  id: ProjectId
  name: string
  description: string
  statusLabel: string
  teamName: string
  ownerName: string
  totalIssueCount: number
  activeIssueCount: number
  blockedIssueCount: number
  doneIssueCount: number
  needsUpdateCount: number
  lastActivityAt: string
}

export interface ProjectsListViewData {
  currentUserName: string
  currentUserRoleLabel: string
  projectCount: number
  totalIssueCount: number
  activeIssueCount: number
  blockedIssueCount: number
  needsUpdateCount: number
  projects: ProjectListItem[]
}

type ProjectsListViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: ProjectsListViewData }

function sortProjects(left: ProjectListItem, right: ProjectListItem): number {
  const activeIssueDelta = right.activeIssueCount - left.activeIssueCount

  if (activeIssueDelta !== 0) {
    return activeIssueDelta
  }

  return Date.parse(right.lastActivityAt) - Date.parse(left.lastActivityAt)
}

async function loadProjectsListViewData(params: {
  currentUserName: string
  currentUserRole: UserRoleId
}): Promise<ProjectsListViewData> {
  const { currentUserName, currentUserRole } = params
  const [projects, issues, users, teams, labels] = await Promise.all([
    projectRepository.list(),
    issueRepository.list(),
    userRepository.list(),
    teamRepository.list(),
    labelRepository.list(),
  ])

  const labelIdsForNeedsUpdate = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const teamNames = new Map(teams.map((team) => [team.id, team.name]))
  const projectItems = projects
    .map((project) => {
      const projectIssues = issues.filter((issue) => issue.projectId === project.id)
      const totalIssueCount = projectIssues.length
      const activeIssueCount = projectIssues.filter(
        (issue) => issue.statusId !== 'done' && issue.statusId !== 'canceled',
      ).length
      const blockedIssueCount = projectIssues.filter(
        (issue) => issue.statusId === 'blocked' || issue.statusId === 'delayed',
      ).length
      const doneIssueCount = projectIssues.filter((issue) => issue.statusId === 'done').length
      const needsUpdateCount = projectIssues.filter((issue) =>
        issue.labelIds.some((labelId) => labelIdsForNeedsUpdate.includes(labelId)),
      ).length
      const lastActivityAt =
        [...projectIssues]
          .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))[0]
          ?.updatedAt ?? project.updatedAt

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        statusLabel: STATUS_LABELS[project.status],
        teamName: teamNames.get(project.teamId) ?? 'Unknown team',
        ownerName: userNames.get(project.ownerId) ?? 'Unknown owner',
        totalIssueCount,
        activeIssueCount,
        blockedIssueCount,
        doneIssueCount,
        needsUpdateCount,
        lastActivityAt,
      }
    })
    .sort(sortProjects)

  return {
    currentUserName,
    currentUserRoleLabel: USER_ROLE_LABELS[currentUserRole],
    projectCount: projectItems.length,
    totalIssueCount: issues.length,
    activeIssueCount: issues.filter(
      (issue) => issue.statusId !== 'done' && issue.statusId !== 'canceled',
    ).length,
    blockedIssueCount: issues.filter(
      (issue) => issue.statusId === 'blocked' || issue.statusId === 'delayed',
    ).length,
    needsUpdateCount: issues.filter((issue) =>
      issue.labelIds.some((labelId) => labelIdsForNeedsUpdate.includes(labelId)),
    ).length,
    projects: projectItems,
  }
}

export function useProjectsListView(params: {
  currentUserId: UserId | null
  currentUserName: string | null
  currentUserRole: UserRoleId | null
}): ProjectsListViewState {
  const { currentUserId, currentUserName, currentUserRole } = params
  const [state, setState] = useState<ProjectsListViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!currentUserId || !currentUserName || !currentUserRole) {
      setState({
        status: 'error',
        message: 'A demo user must be selected before the Projects view can load.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadProjectsListViewData({
      currentUserName,
      currentUserRole,
    })
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
            error instanceof Error ? error.message : 'Failed to load project list visibility.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, currentUserRole])

  return useMemo(() => state, [state])
}
