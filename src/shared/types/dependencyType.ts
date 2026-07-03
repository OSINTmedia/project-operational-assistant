export const DEPENDENCY_TYPE_IDS = [
  'none',
  'user',
  'team',
  'client-representative',
  'external-representative',
  'unknown',
] as const

export type DependencyTypeId = (typeof DEPENDENCY_TYPE_IDS)[number]

export const DEPENDENCY_TYPE_LABELS: Record<DependencyTypeId, string> = {
  none: 'None',
  user: 'User',
  team: 'Team',
  'client-representative': 'Client Representative',
  'external-representative': 'External Representative',
  unknown: 'Unknown',
}
