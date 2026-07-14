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
import { USER_ROLE_LABELS, type UserRoleId } from '../../shared/types'

export interface DashboardMetricsViewData {
  currentUserName: string
  currentUserRoleLabel: string
  metrics: DashboardMetricCounts
  distributions: DashboardDistributions
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
  }
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
