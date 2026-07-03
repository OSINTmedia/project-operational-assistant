import type { ActivityEntryRecord, IssueRecord } from '../../persistence/records'
import {
  activityHistoryRepository,
  issueRepository,
  type ActivityHistoryRepository,
  type IssueRepository,
} from '../../repositories'
import type { ActivityActionTypeId } from '../../shared/types'
import type { IssueId, UserId } from '../../entities'

interface UpdateIssueResponsibilityDependencies {
  issueRepository?: IssueRepository
  activityHistoryRepository?: ActivityHistoryRepository
  createId?: () => string
  now?: () => string
}

export interface TransferIssueOwnerInput {
  issueId: IssueId
  actorId: UserId
  ownerId: UserId
}

export interface UpdateIssueCuratorInput {
  issueId: IssueId
  actorId: UserId
  curatorId: UserId | null
}

function getNow(dependencies: UpdateIssueResponsibilityDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

function getCreateId(dependencies: UpdateIssueResponsibilityDependencies): string {
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

export async function transferIssueOwner(
  input: TransferIssueOwnerInput,
  dependencies: UpdateIssueResponsibilityDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.ownerId, 'Owner')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)

  if (existingIssue.ownerId === input.ownerId) {
    return existingIssue
  }

  const now = getNow(dependencies)

  await issueRepo.update({
    id: existingIssue.id,
    ownerId: input.ownerId,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    buildActivityEntry({
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'owner-changed',
      oldValue: existingIssue.ownerId,
      newValue: input.ownerId,
      createdAt: now,
      createId: getCreateId(dependencies),
    }),
  )

  return {
    ...existingIssue,
    ownerId: input.ownerId,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}

export async function updateIssueCurator(
  input: UpdateIssueCuratorInput,
  dependencies: UpdateIssueResponsibilityDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)

  if (existingIssue.type === 'group' && input.curatorId === null) {
    throw new Error('Group issues require a curator.')
  }

  if (input.curatorId !== null) {
    assertRequiredId(input.curatorId, 'Curator')
  }

  if (existingIssue.curatorId === input.curatorId) {
    return existingIssue
  }

  const now = getNow(dependencies)

  await issueRepo.update({
    id: existingIssue.id,
    curatorId: input.curatorId,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    buildActivityEntry({
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'curator-changed',
      oldValue: existingIssue.curatorId,
      newValue: input.curatorId,
      createdAt: now,
      createId: getCreateId(dependencies),
    }),
  )

  return {
    ...existingIssue,
    curatorId: input.curatorId,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}
