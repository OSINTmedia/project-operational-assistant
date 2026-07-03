export const ISSUE_TYPE_IDS = ['individual', 'group'] as const

export type IssueTypeId = (typeof ISSUE_TYPE_IDS)[number]

export const ISSUE_TYPE_LABELS: Record<IssueTypeId, string> = {
  individual: 'Individual',
  group: 'Group',
}
