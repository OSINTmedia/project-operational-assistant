import { useEffect, useMemo, useState } from 'react'
import {
  calculateDashboardDistributions,
  calculateDashboardMetrics,
  type DashboardDistributions,
  type DashboardMetricCounts,
} from '../../domain/dashboardMetrics'
import type { Issue, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { statusRepository } from '../../repositories/statusRepository'
import { tagRepository } from '../../repositories/tagRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import {
  DEPENDENCY_TYPE_LABELS,
  PRIORITY_LABELS,
  type DependencyTypeId,
  USER_ROLE_LABELS,
  type PriorityId,
  type UserRoleId,
} from '../../shared/types'

const NEEDS_UPDATE_LABEL_NAME = 'Needs Update'
const READY_FOR_CONFIRMATION_LABEL_NAME = 'Ready for Confirmation'

export interface DashboardIssueSummary {
  id: string
  title: string
  description: string
  projectId: string
  projectName: string
  statusId: string
  statusLabel: string
  priorityId: PriorityId
  priorityLabel: string
  ownerId: UserId
  ownerName: string
  curatorId: UserId | null
  curatorName: string | null
  participantIds: UserId[]
  createdBy: UserId
  updatedByName: string
  updatedAt: string
  dependencyType: DependencyTypeId
  dependencyTargetId: string | null
  dependencyLabel: string
  dependencyTargetLabel: string | null
  confirmationRequired: boolean
  confirmedAt: string | null
  hasNeedsUpdateLabel: boolean
  hasReadyForConfirmationLabel: boolean
  tagNames: string[]
}

export interface DashboardFilterOption {
  value: string
  label: string
  count: number
}

export interface DashboardSelectedUserActions {
  assignedIssues: number
  curatedIssues: number
  needsUpdateIssues: number
  confirmationNeededIssues: number
}

export interface DashboardWorkspaceRisks {
  blockedIssues: number
  delayedIssues: number
  needsUpdateIssues: number
}

export interface DashboardMetricsViewData {
  currentUserName: string
  currentUserRoleLabel: string
  metrics: DashboardMetricCounts
  distributions: DashboardDistributions
  selectedUserActions: DashboardSelectedUserActions
  workspaceRisks: DashboardWorkspaceRisks
  issues: DashboardIssueSummary[]
  filterOptions: {
    statuses: DashboardFilterOption[]
    priorities: DashboardFilterOption[]
    projects: DashboardFilterOption[]
  }
}

type DashboardMetricsViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DashboardMetricsViewData }

async function loadDashboardMetricsViewData(params: {
  currentUserId: UserId
  currentUserName: string
  currentUserRole: UserRoleId
}): Promise<DashboardMetricsViewData> {
  const { currentUserId, currentUserName, currentUserRole } = params
  const [issues, labels, projects, statuses, tags, teams, users] = await Promise.all([
    issueRepository.list(),
    labelRepository.list(),
    projectRepository.list(),
    statusRepository.list(),
    tagRepository.list(),
    teamRepository.list(),
    userRepository.list(),
  ])
  const needsUpdateLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)
  const readyForConfirmationLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === READY_FOR_CONFIRMATION_LABEL_NAME)
    .map((label) => label.id)
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const statusNames = new Map(statuses.map((status) => [status.id, status.name]))
  const tagNames = new Map(tags.map((tag) => [tag.id, tag.name]))
  const teamNames = new Map(teams.map((team) => [team.id, team.name]))
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const issueTitles = new Map(issues.map((issue) => [issue.id, issue.title]))
  const selectedUserActions = calculateSelectedUserActions({
    currentUserId,
    issues,
    needsUpdateLabelIds,
    readyForConfirmationLabelIds,
  })
  const workspaceRisks = {
    blockedIssues: issues.filter((issue) => issue.statusId === 'blocked').length,
    delayedIssues: issues.filter((issue) => issue.statusId === 'delayed').length,
    needsUpdateIssues: issues.filter((issue) =>
      issue.labelIds.some((labelId) => needsUpdateLabelIds.includes(labelId)),
    ).length,
  }
  const issueSummaries = [...issues]
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      projectId: issue.projectId,
      projectName: projectNames.get(issue.projectId) ?? 'Unknown project',
      statusId: issue.statusId,
      statusLabel: statusNames.get(issue.statusId) ?? 'Unknown status',
      priorityId: issue.priority,
      priorityLabel: PRIORITY_LABELS[issue.priority],
      ownerId: issue.ownerId,
      ownerName: userNames.get(issue.ownerId) ?? 'Unknown owner',
      curatorId: issue.curatorId,
      curatorName: issue.curatorId ? (userNames.get(issue.curatorId) ?? 'Unknown curator') : null,
      participantIds: issue.participantIds,
      createdBy: issue.createdBy,
      updatedByName: userNames.get(issue.updatedBy) ?? 'Unknown updater',
      updatedAt: issue.updatedAt,
      dependencyType: issue.dependencyType,
      dependencyTargetId: issue.dependencyTargetId,
      dependencyLabel: DEPENDENCY_TYPE_LABELS[issue.dependencyType],
      dependencyTargetLabel: resolveDependencyTargetLabel({
        dependencyTargetId: issue.dependencyTargetId,
        issueTitles,
        teamNames,
        userNames,
      }),
      confirmationRequired: issue.confirmationRequired,
      confirmedAt: issue.confirmedAt,
      hasNeedsUpdateLabel: issue.labelIds.some((labelId) => needsUpdateLabelIds.includes(labelId)),
      hasReadyForConfirmationLabel: issue.labelIds.some((labelId) =>
        readyForConfirmationLabelIds.includes(labelId),
      ),
      tagNames: issue.tagIds
        .map((tagId) => tagNames.get(tagId))
        .filter((tagName): tagName is string => Boolean(tagName)),
    }))
  const statusOptions = calculateFilterOptions(issueSummaries, (issue) => issue.statusId, (issue) => issue.statusLabel)
  const priorityOptions = calculateFilterOptions(
    issueSummaries,
    (issue) => issue.priorityId,
    (issue) => issue.priorityLabel,
  )
  const projectOptions = calculateFilterOptions(
    issueSummaries,
    (issue) => issue.projectId,
    (issue) => issue.projectName,
  )

  return {
    currentUserName,
    currentUserRoleLabel: USER_ROLE_LABELS[currentUserRole],
    metrics: calculateDashboardMetrics({
      issues,
      labels,
    }),
    distributions: calculateDashboardDistributions({
      issues,
      projects,
      statuses,
      users,
    }),
    selectedUserActions,
    workspaceRisks,
    issues: issueSummaries,
    filterOptions: {
      statuses: statusOptions,
      priorities: priorityOptions,
      projects: projectOptions,
    },
  }
}

function isOpenIssue(issue: Issue): boolean {
  return issue.statusId !== 'done' && issue.statusId !== 'canceled'
}

function resolveDependencyTargetLabel(params: {
  dependencyTargetId: string | null
  issueTitles: Map<string, string>
  userNames: Map<string, string>
  teamNames: Map<string, string>
}): string | null {
  const { dependencyTargetId, issueTitles, userNames, teamNames } = params

  if (!dependencyTargetId) {
    return null
  }

  return (
    issueTitles.get(dependencyTargetId) ??
    userNames.get(dependencyTargetId) ??
    teamNames.get(dependencyTargetId) ??
    dependencyTargetId
  )
}

function hasAnyLabel(issue: Issue, labelIds: string[]): boolean {
  return issue.labelIds.some((labelId) => labelIds.includes(labelId))
}

function isIssueRelatedToUser(issue: Issue, currentUserId: UserId): boolean {
  return (
    issue.ownerId === currentUserId ||
    issue.createdBy === currentUserId ||
    issue.curatorId === currentUserId ||
    issue.participantIds.includes(currentUserId) ||
    issue.dependencyTargetId === currentUserId
  )
}

function calculateSelectedUserActions(input: {
  currentUserId: UserId
  issues: Issue[]
  needsUpdateLabelIds: string[]
  readyForConfirmationLabelIds: string[]
}): DashboardSelectedUserActions {
  const {
    currentUserId,
    issues,
    needsUpdateLabelIds,
    readyForConfirmationLabelIds,
  } = input

  return {
    assignedIssues: issues.filter(
      (issue) => isOpenIssue(issue) && issue.ownerId === currentUserId,
    ).length,
    curatedIssues: issues.filter(
      (issue) => isOpenIssue(issue) && issue.curatorId === currentUserId,
    ).length,
    needsUpdateIssues: issues.filter(
      (issue) =>
        isIssueRelatedToUser(issue, currentUserId) &&
        hasAnyLabel(issue, needsUpdateLabelIds),
    ).length,
    confirmationNeededIssues: issues.filter(
      (issue) =>
        issue.confirmationRequired &&
        issue.confirmedAt === null &&
        issue.dependencyType === 'user' &&
        issue.dependencyTargetId === currentUserId &&
        hasAnyLabel(issue, readyForConfirmationLabelIds),
    ).length,
  }
}

function calculateFilterOptions(
  issues: DashboardIssueSummary[],
  getValue: (issue: DashboardIssueSummary) => string,
  getLabel: (issue: DashboardIssueSummary) => string,
): DashboardFilterOption[] {
  const counts = new Map<
    string,
    {
      label: string
      count: number
    }
  >()

  issues.forEach((issue) => {
    const value = getValue(issue)
    const current = counts.get(value)

    if (current) {
      current.count += 1
      return
    }

    counts.set(value, {
      label: getLabel(issue),
      count: 1,
    })
  })

  return Array.from(counts.entries())
    .map(([value, data]) => ({
      value,
      label: data.label,
      count: data.count,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
}

export function useDashboardMetrics(params: {
  currentUserId: UserId | null
  currentUserName: string | null
  currentUserRole: UserRoleId | null
}): DashboardMetricsViewState {
  const { currentUserId, currentUserName, currentUserRole } = params
  const [state, setState] = useState<DashboardMetricsViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!currentUserId || !currentUserName || !currentUserRole) {
      setState({
        status: 'error',
        message: 'A demo user must be selected before the Dashboard can load.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadDashboardMetricsViewData({
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
            error instanceof Error ? error.message : 'Failed to load dashboard metric visibility.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, currentUserRole])

  return useMemo(() => state, [state])
}
