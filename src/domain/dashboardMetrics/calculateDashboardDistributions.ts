import { PRIORITY_IDS, PRIORITY_LABELS } from '../../shared/types'
import type {
  CalculateDashboardDistributionsInput,
  DashboardDistributionItem,
  DashboardDistributions,
} from './types'

function sortByCountDescThenLabelAsc(
  left: DashboardDistributionItem,
  right: DashboardDistributionItem,
): number {
  const countDelta = right.count - left.count

  if (countDelta !== 0) {
    return countDelta
  }

  return left.label.localeCompare(right.label)
}

export function calculateDashboardDistributions({
  issues,
  projects,
  users,
  statuses,
}: CalculateDashboardDistributionsInput): DashboardDistributions {
  const statusCounts = statuses
    .map((status) => ({
      id: status.id,
      label: status.name,
      count: issues.filter((issue) => issue.statusId === status.id).length,
    }))
    .filter((item) => item.count > 0)

  const priorityCounts = PRIORITY_IDS.map((priorityId) => ({
    id: priorityId,
    label: PRIORITY_LABELS[priorityId],
    count: issues.filter((issue) => issue.priority === priorityId).length,
  })).filter((item) => item.count > 0)

  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const projectCounts = Array.from(
    issues.reduce((counts, issue) => {
      counts.set(issue.projectId, (counts.get(issue.projectId) ?? 0) + 1)
      return counts
    }, new Map<string, number>()),
  )
    .map(([projectId, count]) => ({
      id: projectId,
      label: projectNames.get(projectId) ?? 'Unknown project',
      count,
    }))
    .sort(sortByCountDescThenLabelAsc)

  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const ownerCounts = Array.from(
    issues.reduce((counts, issue) => {
      counts.set(issue.ownerId, (counts.get(issue.ownerId) ?? 0) + 1)
      return counts
    }, new Map<string, number>()),
  )
    .map(([ownerId, count]) => ({
      id: ownerId,
      label: userNames.get(ownerId) ?? 'Unknown owner',
      count,
    }))
    .sort(sortByCountDescThenLabelAsc)

  return {
    issuesByStatus: statusCounts,
    issuesByPriority: priorityCounts,
    issuesByProject: projectCounts,
    issuesByOwner: ownerCounts,
  }
}
