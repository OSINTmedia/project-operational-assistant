export const DEFAULT_STATUS_IDS = [
  'new',
  'planned',
  'waiting',
  'blocked',
  'delayed',
  'in-progress',
  'done',
  'canceled',
] as const

export type StatusId = (typeof DEFAULT_STATUS_IDS)[number]

export const STATUS_LABELS: Record<StatusId, string> = {
  new: 'New',
  planned: 'Planned',
  waiting: 'Waiting',
  blocked: 'Blocked',
  delayed: 'Delayed',
  'in-progress': 'In Progress',
  done: 'Done',
  canceled: 'Canceled',
}
