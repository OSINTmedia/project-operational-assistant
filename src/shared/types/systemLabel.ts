export const SYSTEM_LABEL_IDS = ['needs-update', 'ready-for-confirmation'] as const

export type SystemLabelId = (typeof SYSTEM_LABEL_IDS)[number]

export const SYSTEM_LABELS: Record<SystemLabelId, string> = {
  'needs-update': 'Needs Update',
  'ready-for-confirmation': 'Ready for Confirmation',
}
