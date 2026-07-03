export const PRIORITY_IDS = ['low', 'medium', 'high', 'critical'] as const

export type PriorityId = (typeof PRIORITY_IDS)[number]

export const PRIORITY_LABELS: Record<PriorityId, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}
