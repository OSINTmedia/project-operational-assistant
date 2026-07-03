export const SOURCE_TYPE_IDS = ['email', 'call', 'meeting', 'chat', 'internal', 'other'] as const

export type SourceTypeId = (typeof SOURCE_TYPE_IDS)[number]

export const SOURCE_TYPE_LABELS: Record<SourceTypeId, string> = {
  email: 'Email',
  call: 'Call',
  meeting: 'Meeting',
  chat: 'Chat',
  internal: 'Internal',
  other: 'Other',
}
