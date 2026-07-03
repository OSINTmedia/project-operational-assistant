export const PERSISTENCE_TABLE_NAMES = {
  users: 'users',
  teams: 'teams',
  projects: 'projects',
  issues: 'issues',
  tags: 'tags',
  labels: 'labels',
  statuses: 'statuses',
  activityHistory: 'activityHistory',
} as const

export type PersistenceTableName =
  (typeof PERSISTENCE_TABLE_NAMES)[keyof typeof PERSISTENCE_TABLE_NAMES]
