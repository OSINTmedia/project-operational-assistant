import { useEffect, useMemo, useState } from 'react'
import type { IssueId, TeamId, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { statusRepository } from '../../repositories/statusRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import {
  ISSUE_TYPE_LABELS,
  PRIORITY_LABELS,
  USER_ROLE_LABELS,
  type UserRoleId,
} from '../../shared/types'

const NEEDS_UPDATE_LABEL_NAME = 'Needs Update'

export interface TeamWorkspaceIssueSummary {
  id: IssueId
  title: string
  projectId: string
  projectName: string
  typeLabel: string
  statusLabel: string
  priorityLabel: string
  ownerName: string
  updatedAt: string
  attentionLabels: string[]
}

export interface TeamStatusSummaryItem {
  statusId: string
  statusLabel: string
  count: number
}

export interface TeamWorkspaceItem {
  id: TeamId
  name: string
  description: string
  isCurrentUserTeam: boolean
  memberNames: string[]
  totalIssueCount: number
  activeIssueCount: number
  groupIssueCount: number
  blockedIssueCount: number
  delayedIssueCount: number
  needsUpdateCount: number
  statusSummary: TeamStatusSummaryItem[]
  teamIssues: TeamWorkspaceIssueSummary[]
  groupIssues: TeamWorkspaceIssueSummary[]
}

export interface TeamWorkspaceViewData {
  currentUserName: string
  currentUserRoleLabel: string
  currentTeamName: string | null
  teams: TeamWorkspaceItem[]
}

type TeamWorkspaceViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: TeamWorkspaceViewData }

function sortByUpdatedAtDesc<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
}

function sortTeams(left: TeamWorkspaceItem, right: TeamWorkspaceItem): number {
  if (left.isCurrentUserTeam !== right.isCurrentUserTeam) {
    return left.isCurrentUserTeam ? -1 : 1
  }

  const activeIssueDelta = right.activeIssueCount - left.activeIssueCount

  if (activeIssueDelta !== 0) {
    return activeIssueDelta
  }

  return left.name.localeCompare(right.name)
}

async function loadTeamWorkspaceViewData(params: {
  currentUserId: UserId
  currentUserName: string
  currentUserRole: UserRoleId
}): Promise<TeamWorkspaceViewData> {
  const { currentUserId, currentUserName, currentUserRole } = params
  const [teams, users, issues, projects, labels, statuses] = await Promise.all([
    teamRepository.list(),
    userRepository.list(),
    issueRepository.list(),
    projectRepository.list(),
    labelRepository.list(),
    statusRepository.list(),
  ])

  const currentUser = users.find((user) => user.id === currentUserId) ?? null
  const currentTeamId = currentUser?.teamId ?? null
  const currentTeamName = teams.find((team) => team.id === currentTeamId)?.name ?? null
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const labelNames = new Map(labels.map((label) => [label.id, label.name]))
  const statusNames = new Map(statuses.map((status) => [status.id, status.name]))
  const needsUpdateLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)

  const createIssueSummary = (issueId: IssueId): TeamWorkspaceIssueSummary | null => {
    const issue = issues.find((currentIssue) => currentIssue.id === issueId)

    if (!issue) {
      return null
    }

    const attentionLabels = issue.labelIds
      .map((labelId) => labelNames.get(labelId))
      .filter((labelName): labelName is string => Boolean(labelName))

    return {
      id: issue.id,
      title: issue.title,
      projectId: issue.projectId,
      projectName: projectNames.get(issue.projectId) ?? 'Unknown project',
      typeLabel: ISSUE_TYPE_LABELS[issue.type],
      statusLabel: statusNames.get(issue.statusId) ?? issue.statusId,
      priorityLabel: PRIORITY_LABELS[issue.priority],
      ownerName: userNames.get(issue.ownerId) ?? 'Unknown owner',
      updatedAt: issue.updatedAt,
      attentionLabels,
    }
  }

  const teamsData = teams
    .map((team) => {
      const teamUsers = team.memberIds
        .map((memberId) => userNames.get(memberId))
        .filter((memberName): memberName is string => Boolean(memberName))
      const teamIssues = sortByUpdatedAtDesc(issues.filter((issue) => issue.teamId === team.id))
      const teamIssueSummaries = teamIssues
        .map((issue) => createIssueSummary(issue.id))
        .filter((issue): issue is TeamWorkspaceIssueSummary => Boolean(issue))
      const groupIssueSummaries = teamIssues
        .filter((issue) => issue.type === 'group')
        .map((issue) => createIssueSummary(issue.id))
        .filter((issue): issue is TeamWorkspaceIssueSummary => Boolean(issue))

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        isCurrentUserTeam: team.id === currentTeamId,
        memberNames: teamUsers,
        totalIssueCount: teamIssues.length,
        activeIssueCount: teamIssues.filter(
          (issue) => issue.statusId !== 'done' && issue.statusId !== 'canceled',
        ).length,
        groupIssueCount: groupIssueSummaries.length,
        blockedIssueCount: teamIssues.filter((issue) => issue.statusId === 'blocked').length,
        delayedIssueCount: teamIssues.filter((issue) => issue.statusId === 'delayed').length,
        needsUpdateCount: teamIssues.filter((issue) =>
          issue.labelIds.some((labelId) => needsUpdateLabelIds.includes(labelId)),
        ).length,
        statusSummary: statuses
          .map((status) => ({
            statusId: status.id,
            statusLabel: status.name,
            count: teamIssues.filter((issue) => issue.statusId === status.id).length,
          }))
          .filter((status) => status.count > 0),
        teamIssues: teamIssueSummaries,
        groupIssues: groupIssueSummaries,
      }
    })
    .sort(sortTeams)

  return {
    currentUserName,
    currentUserRoleLabel: USER_ROLE_LABELS[currentUserRole],
    currentTeamName,
    teams: teamsData,
  }
}

export function useTeamWorkspaceView(params: {
  currentUserId: UserId | null
  currentUserName: string | null
  currentUserRole: UserRoleId | null
}): TeamWorkspaceViewState {
  const { currentUserId, currentUserName, currentUserRole } = params
  const [state, setState] = useState<TeamWorkspaceViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!currentUserId || !currentUserName || !currentUserRole) {
      setState({
        status: 'error',
        message: 'A demo user must be selected before the Team Workspace can load.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadTeamWorkspaceViewData({
      currentUserId,
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
            error instanceof Error ? error.message : 'Failed to load team workspace visibility.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, currentUserRole])

  return useMemo(() => state, [state])
}
