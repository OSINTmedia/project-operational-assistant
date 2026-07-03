import type { ActivityEntryRecord, IssueRecord } from '../../persistence/records'
import {
  activityHistoryRepository,
  issueRepository,
  type ActivityHistoryRepository,
  type IssueRepository,
} from '../../repositories'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type PriorityId,
  type StatusId,
} from '../../shared/types'
import type { ActivityActionTypeId } from '../../shared/types'
import type { IssueId, UserId } from '../../entities'

interface UpdateIssueStateDependencies {
  issueRepository?: IssueRepository
  activityHistoryRepository?: ActivityHistoryRepository
  createId?: () => string
  now?: () => string
}

export interface UpdateIssueStatusInput {
  issueId: IssueId
  actorId: UserId
  statusId: StatusId
}

export interface UpdateIssuePriorityInput {
  issueId: IssueId
  actorId: UserId
  priority: PriorityId
}

function getNow(dependencies: UpdateIssueStateDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

function getCreateId(dependencies: UpdateIssueStateDependencies): string {
  return (dependencies.createId ?? (() => crypto.randomUUID()))()
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

function buildActivityEntry(params: {
  issueId: IssueId
  actorId: UserId
  actionType: ActivityActionTypeId
  oldValue: string | null
  newValue: string | null
  createdAt: string
  createId: string
}): ActivityEntryRecord {
  return {
    id: params.createId,
    issueId: params.issueId,
    actorId: params.actorId,
    actionType: params.actionType,
    oldValue: params.oldValue,
    newValue: params.newValue,
    createdAt: params.createdAt,
  }
}

function getStatusActionType(oldStatusId: StatusId, nextStatusId: StatusId): ActivityActionTypeId {
  if (nextStatusId === 'done') {
    return 'issue-completed'
  }

  if (oldStatusId === 'done') {
    return 'issue-reopened'
  }

  return 'status-changed'
}

export async function updateIssueStatus(
  input: UpdateIssueStatusInput,
  dependencies: UpdateIssueStateDependencies = {},
): Promise<IssueRecord> {
  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)

  if (existingIssue.statusId === input.statusId) {
    return existingIssue
  }

  const now = getNow(dependencies)
  const nextCompletedAt =
    input.statusId === 'done'
      ? now
      : existingIssue.statusId === 'done'
        ? null
        : existingIssue.completedAt

  await issueRepo.update({
    id: existingIssue.id,
    statusId: input.statusId,
    updatedBy: input.actorId,
    updatedAt: now,
    completedAt: nextCompletedAt,
  })

  await historyRepo.put(
    buildActivityEntry({
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: getStatusActionType(existingIssue.statusId, input.statusId),
      oldValue: STATUS_LABELS[existingIssue.statusId],
      newValue: STATUS_LABELS[input.statusId],
      createdAt: now,
      createId: getCreateId(dependencies),
    }),
  )

  return {
    ...existingIssue,
    statusId: input.statusId,
    updatedBy: input.actorId,
    updatedAt: now,
    completedAt: nextCompletedAt,
  }
}

export async function updateIssuePriority(
  input: UpdateIssuePriorityInput,
  dependencies: UpdateIssueStateDependencies = {},
): Promise<IssueRecord> {
  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)

  if (existingIssue.priority === input.priority) {
    return existingIssue
  }

  const now = getNow(dependencies)

  await issueRepo.update({
    id: existingIssue.id,
    priority: input.priority,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    buildActivityEntry({
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'priority-changed',
      oldValue: PRIORITY_LABELS[existingIssue.priority],
      newValue: PRIORITY_LABELS[input.priority],
      createdAt: now,
      createId: getCreateId(dependencies),
    }),
  )

  return {
    ...existingIssue,
    priority: input.priority,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}
