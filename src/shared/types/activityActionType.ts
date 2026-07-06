export const ACTIVITY_ACTION_TYPE_IDS = [
  'issue-created',
  'status-changed',
  'owner-changed',
  'priority-changed',
  'curator-changed',
  'tag-added',
  'tag-removed',
  'label-added',
  'label-removed',
  'issue-updated',
  'issue-completed',
  'confirmation-requested',
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
  'label-added': 'Label Added',
  'label-removed': 'Label Removed',
  'issue-updated': 'Issue Updated',
  'issue-completed': 'Issue Completed',
  'confirmation-requested': 'Confirmation Requested',
  'issue-confirmed': 'Issue Confirmed',
  'issue-reopened': 'Issue Reopened',
}
