import type { IssueRecord, LabelRecord } from '../../persistence/records'
import {
  activityHistoryRepository,
  issueRepository,
  labelRepository,
  type ActivityHistoryRepository,
  type IssueRepository,
  type LabelRepository,
} from '../../repositories'
import type { IssueId, LabelId, UserId } from '../../entities'
import { STATUS_LABELS } from '../../shared/types'
import { createActivityEntry, createActivityValue } from './activityHistory'

const SYSTEM_LABEL_NAMES = {
  needsUpdate: 'Needs Update',
  readyForConfirmation: 'Ready for Confirmation',
} as const

const STALE_ISSUE_THRESHOLD_MS = 1000 * 60 * 60 * 24

interface UpdateIssueAttentionDependencies {
  issueRepository?: IssueRepository
  activityHistoryRepository?: ActivityHistoryRepository
  labelRepository?: LabelRepository
  createId?: () => string
  now?: () => string
  staleIssueThresholdMs?: number
}

export interface RefreshNeedsUpdateInput {
  issueId: IssueId
  actorId: UserId
}

export interface MarkReadyForConfirmationInput {
  issueId: IssueId
  actorId: UserId
}

export interface ConfirmIssueInput {
  issueId: IssueId
  actorId: UserId
}

export interface ReopenIssueFromConfirmationInput {
  issueId: IssueId
  actorId: UserId
  statusId: IssueRecord['statusId']
}

function getNow(dependencies: UpdateIssueAttentionDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

function getCreateId(dependencies: UpdateIssueAttentionDependencies): string {
  return (dependencies.createId ?? (() => crypto.randomUUID()))()
}

function assertRequiredId(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`)
  }
}

async function getExistingIssue(
  issueId: IssueId,
  repository: IssueRepository,
): Promise<IssueRecord> {
  const issue = await repository.getById(issueId)

  if (!issue) {
    throw new Error(`Issue not found: ${issueId}`)
  }

  return issue
}

async function getSystemLabelByName(
  labelName: string,
  repository: LabelRepository,
): Promise<LabelRecord> {
  const labels = await repository.list()
  const label = labels.find((entry) => entry.type === 'system' && entry.name === labelName)

  if (!label) {
    throw new Error(`System label not found: ${labelName}`)
  }

  return label
}

function isIssueStale(issue: IssueRecord, now: string, staleIssueThresholdMs: number): boolean {
  if (issue.statusId === 'done' || issue.statusId === 'canceled') {
    return false
  }

  const updatedAtMs = Date.parse(issue.updatedAt)
  const nowMs = Date.parse(now)

  return nowMs - updatedAtMs >= staleIssueThresholdMs
}

function addLabelId(labelIds: LabelId[], labelId: LabelId): LabelId[] {
  return labelIds.includes(labelId) ? labelIds : [...labelIds, labelId]
}

function removeLabelId(labelIds: LabelId[], labelId: LabelId): LabelId[] {
  return labelIds.filter((currentLabelId) => currentLabelId !== labelId)
}

export async function refreshNeedsUpdateLabel(
  input: RefreshNeedsUpdateInput,
  dependencies: UpdateIssueAttentionDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const labelRepo = dependencies.labelRepository ?? labelRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const now = getNow(dependencies)
  const staleIssueThresholdMs =
    dependencies.staleIssueThresholdMs ?? STALE_ISSUE_THRESHOLD_MS
  const needsUpdateLabel = await getSystemLabelByName(
    SYSTEM_LABEL_NAMES.needsUpdate,
    labelRepo,
  )

  const shouldHaveNeedsUpdate = isIssueStale(existingIssue, now, staleIssueThresholdMs)
  const hasNeedsUpdate = existingIssue.labelIds.includes(needsUpdateLabel.id)

  if (shouldHaveNeedsUpdate === hasNeedsUpdate) {
    return existingIssue
  }

  const nextLabelIds = shouldHaveNeedsUpdate
    ? addLabelId(existingIssue.labelIds, needsUpdateLabel.id)
    : removeLabelId(existingIssue.labelIds, needsUpdateLabel.id)

  await issueRepo.update({
    id: existingIssue.id,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  return {
    ...existingIssue,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}

export async function markIssueReadyForConfirmation(
  input: MarkReadyForConfirmationInput,
  dependencies: UpdateIssueAttentionDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const labelRepo = dependencies.labelRepository ?? labelRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const readyLabel = await getSystemLabelByName(
    SYSTEM_LABEL_NAMES.readyForConfirmation,
    labelRepo,
  )
  const now = getNow(dependencies)

  const nextLabelIds = addLabelId(existingIssue.labelIds, readyLabel.id)

  if (
    existingIssue.statusId === 'done' &&
    existingIssue.confirmationRequired &&
    existingIssue.labelIds.includes(readyLabel.id)
  ) {
    return existingIssue
  }

  await issueRepo.update({
    id: existingIssue.id,
    statusId: 'done',
    confirmationRequired: true,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
    completedAt: existingIssue.completedAt ?? now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'confirmation-requested',
      oldValue: existingIssue.labelIds.includes(readyLabel.id)
        ? createActivityValue('label', readyLabel.name, readyLabel.id)
        : null,
      newValue: createActivityValue('label', readyLabel.name, readyLabel.id),
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    statusId: 'done',
    confirmationRequired: true,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
    completedAt: existingIssue.completedAt ?? now,
  }
}

export async function confirmIssue(
  input: ConfirmIssueInput,
  dependencies: UpdateIssueAttentionDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const labelRepo = dependencies.labelRepository ?? labelRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const readyLabel = await getSystemLabelByName(
    SYSTEM_LABEL_NAMES.readyForConfirmation,
    labelRepo,
  )
  const now = getNow(dependencies)
  const nextLabelIds = removeLabelId(existingIssue.labelIds, readyLabel.id)

  await issueRepo.update({
    id: existingIssue.id,
    confirmationRequired: false,
    confirmedBy: input.actorId,
    confirmedAt: now,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
    statusId: 'done',
    completedAt: existingIssue.completedAt ?? now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'issue-confirmed',
      oldValue: createActivityValue('label', readyLabel.name, readyLabel.id),
      newValue: createActivityValue('text', 'Confirmed'),
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    confirmationRequired: false,
    confirmedBy: input.actorId,
    confirmedAt: now,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
    statusId: 'done',
    completedAt: existingIssue.completedAt ?? now,
  }
}

export async function reopenIssueFromConfirmation(
  input: ReopenIssueFromConfirmationInput,
  dependencies: UpdateIssueAttentionDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const labelRepo = dependencies.labelRepository ?? labelRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const readyLabel = await getSystemLabelByName(
    SYSTEM_LABEL_NAMES.readyForConfirmation,
    labelRepo,
  )
  const now = getNow(dependencies)
  const nextLabelIds = removeLabelId(existingIssue.labelIds, readyLabel.id)

  await issueRepo.update({
    id: existingIssue.id,
    statusId: input.statusId,
    confirmationRequired: false,
    confirmedBy: null,
    confirmedAt: null,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
    completedAt: input.statusId === 'done' ? existingIssue.completedAt ?? now : null,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'issue-reopened',
      oldValue: createActivityValue('label', readyLabel.name, readyLabel.id),
      newValue: createActivityValue('status', STATUS_LABELS[input.statusId], input.statusId),
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    statusId: input.statusId,
    confirmationRequired: false,
    confirmedBy: null,
    confirmedAt: null,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
    completedAt: input.statusId === 'done' ? existingIssue.completedAt ?? now : null,
  }
}
