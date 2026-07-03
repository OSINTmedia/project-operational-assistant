export const ACTIVITY_ACTION_TYPE_IDS = [
  'issue-created',
  'status-changed',
  'owner-changed',
  'priority-changed',
  'curator-changed',
  'tag-added',
  'tag-removed',
  'issue-updated',
  'issue-completed',
  'issue-confirmed',
  'issue-reopened',
] as const

export type ActivityActionTypeId = (typeof ACTIVITY_ACTION_TYPE_IDS)[number]

export const ACTIVITY_ACTION_LABELS: Record<ActivityActionTypeId, string> = {
  'issue-created': 'Issue Created',
  'status-changed': 'Status Changed',
  'owner-changed': 'Owner Changed',
  'priority-changed': 'Priority Changed',
  'curator-changed': 'Curator Changed',
  'tag-added': 'Tag Added',
  'tag-removed': 'Tag Removed',
  'issue-updated': 'Issue Updated',
  'issue-completed': 'Issue Completed',
  'issue-confirmed': 'Issue Confirmed',
  'issue-reopened': 'Issue Reopened',
}
