import type {
  IssueRecord,
  LabelRecord,
  ProjectRecord,
  StatusRecord,
  UserRecord,
} from '../../persistence/records'

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

export interface DashboardDistributionItem {
  id: string
  label: string
  count: number
}

export interface DashboardDistributions {
  issuesByStatus: DashboardDistributionItem[]
  issuesByPriority: DashboardDistributionItem[]
  issuesByProject: DashboardDistributionItem[]
  issuesByOwner: DashboardDistributionItem[]
}

export interface CalculateDashboardDistributionsInput {
  issues: IssueRecord[]
  projects: ProjectRecord[]
  users: UserRecord[]
  statuses: StatusRecord[]
}
