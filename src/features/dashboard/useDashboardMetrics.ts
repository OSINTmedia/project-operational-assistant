import { useEffect, useMemo, useState } from 'react'
import {
  calculateDashboardDistributions,
  calculateDashboardMetrics,
  type DashboardDistributions,
  type DashboardMetricCounts,
} from '../../domain/dashboardMetrics'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { statusRepository } from '../../repositories/statusRepository'
import { userRepository } from '../../repositories/userRepository'
import {
  PRIORITY_LABELS,
  USER_ROLE_LABELS,
  type PriorityId,
  type UserRoleId,
} from '../../shared/types'

const NEEDS_UPDATE_LABEL_NAME = 'Needs Update'

export interface DashboardIssueSummary {
  id: string
  title: string
  projectId: string
  projectName: string
  statusId: string
  statusLabel: string
  priorityId: PriorityId
  priorityLabel: string
  ownerName: string
  updatedAt: string
  hasNeedsUpdateLabel: boolean
}

export interface DashboardFilterOption {
  value: string
  label: string
  count: number
}

export interface DashboardMetricsViewData {
  currentUserName: string
  currentUserRoleLabel: string
  metrics: DashboardMetricCounts
  distributions: DashboardDistributions
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
  currentUserName: string
  currentUserRole: UserRoleId
}): Promise<DashboardMetricsViewData> {
  const { currentUserName, currentUserRole } = params
  const [issues, labels, projects, statuses, users] = await Promise.all([
    issueRepository.list(),
    labelRepository.list(),
    projectRepository.list(),
    statusRepository.list(),
    userRepository.list(),
  ])
  const needsUpdateLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const statusNames = new Map(statuses.map((status) => [status.id, status.name]))
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const issueSummaries = [...issues]
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .map((issue) => ({
      id: issue.id,
      title: issue.title,
      projectId: issue.projectId,
      projectName: projectNames.get(issue.projectId) ?? 'Unknown project',
      statusId: issue.statusId,
      statusLabel: statusNames.get(issue.statusId) ?? 'Unknown status',
      priorityId: issue.priority,
      priorityLabel: PRIORITY_LABELS[issue.priority],
      ownerName: userNames.get(issue.ownerId) ?? 'Unknown owner',
      updatedAt: issue.updatedAt,
      hasNeedsUpdateLabel: issue.labelIds.some((labelId) => needsUpdateLabelIds.includes(labelId)),
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
    issues: issueSummaries,
    filterOptions: {
      statuses: statusOptions,
      priorities: priorityOptions,
      projects: projectOptions,
    },
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
  currentUserName: string | null
  currentUserRole: UserRoleId | null
}): DashboardMetricsViewState {
  const { currentUserName, currentUserRole } = params
  const [state, setState] = useState<DashboardMetricsViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!currentUserName || !currentUserRole) {
      setState({
        status: 'error',
        message: 'A demo user must be selected before the Dashboard can load.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadDashboardMetricsViewData({
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
  }, [currentUserName, currentUserRole])

  return useMemo(() => state, [state])
}
