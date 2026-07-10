import type { LabelRecord } from '../../persistence/records'
import { SYSTEM_LABELS, type StatusId } from '../../shared/types'
import type { CalculateDashboardMetricsInput, DashboardMetricCounts } from './types'

const CLOSED_STATUS_IDS: StatusId[] = ['done', 'canceled']
const NEEDS_UPDATE_LABEL_NAME = SYSTEM_LABELS['needs-update']

function countIssuesByStatus(
  issues: CalculateDashboardMetricsInput['issues'],
  statusId: StatusId,
): number {
  return issues.filter((issue) => issue.statusId === statusId).length
}

function isOpenIssue(statusId: StatusId): boolean {
  return !CLOSED_STATUS_IDS.includes(statusId)
}

function getNeedsUpdateLabelId(labels: LabelRecord[]): LabelRecord['id'] {
  const needsUpdateLabel = labels.find(
    (label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME,
  )

  if (!needsUpdateLabel) {
    throw new Error(`System label not found: ${NEEDS_UPDATE_LABEL_NAME}`)
  }

  return needsUpdateLabel.id
}

export function calculateDashboardMetrics({
  issues,
  labels,
}: CalculateDashboardMetricsInput): DashboardMetricCounts {
  const needsUpdateLabelId = getNeedsUpdateLabelId(labels)

  return {
    totalIssues: issues.length,
    openIssues: issues.filter((issue) => isOpenIssue(issue.statusId)).length,
    doneIssues: countIssuesByStatus(issues, 'done'),
    waitingIssues: countIssuesByStatus(issues, 'waiting'),
    blockedIssues: countIssuesByStatus(issues, 'blocked'),
    delayedIssues: countIssuesByStatus(issues, 'delayed'),
    needsUpdateIssues: issues.filter((issue) => issue.labelIds.includes(needsUpdateLabelId)).length,
  }
}
