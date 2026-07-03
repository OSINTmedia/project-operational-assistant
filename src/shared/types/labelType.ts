export const LABEL_TYPE_IDS = ['system', 'custom'] as const

export type LabelTypeId = (typeof LABEL_TYPE_IDS)[number]
