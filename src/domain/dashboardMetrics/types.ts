import type { IssueRecord, LabelRecord } from '../../persistence/records'

export interface DashboardMetricCounts {
  totalIssues: number
  openIssues: number
  doneIssues: number
  waitingIssues: number
  blockedIssues: number
  delayedIssues: number
  needsUpdateIssues: number
}

export interface CalculateDashboardMetricsInput {
  issues: IssueRecord[]
  labels: LabelRecord[]
}
