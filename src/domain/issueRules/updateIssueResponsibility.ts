import type { IssueRecord } from '../../persistence/records'
import {
  activityHistoryRepository,
  issueRepository,
  userRepository,
  type ActivityHistoryRepository,
  type IssueRepository,
  type UserRepository,
} from '../../repositories'
import type { IssueId, UserId } from '../../entities'
import { createActivityEntry, createActivityValue } from './activityHistory'

interface UpdateIssueResponsibilityDependencies {
  issueRepository?: IssueRepository
  activityHistoryRepository?: ActivityHistoryRepository
  userRepository?: UserRepository
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

async function getUserLabel(
  userId: UserId,
  repository: UserRepository,
): Promise<string> {
  const user = await repository.getById(userId)
  return user?.name ?? userId
}

export async function transferIssueOwner(
  input: TransferIssueOwnerInput,
  dependencies: UpdateIssueResponsibilityDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.ownerId, 'Owner')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const userRepo = dependencies.userRepository ?? userRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)

  if (existingIssue.ownerId === input.ownerId) {
    return existingIssue
  }

  const now = getNow(dependencies)
  const [oldOwnerLabel, newOwnerLabel] = await Promise.all([
    getUserLabel(existingIssue.ownerId, userRepo),
    getUserLabel(input.ownerId, userRepo),
  ])

  await issueRepo.update({
    id: existingIssue.id,
    ownerId: input.ownerId,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'owner-changed',
      oldValue: createActivityValue('user', oldOwnerLabel, existingIssue.ownerId),
      newValue: createActivityValue('user', newOwnerLabel, input.ownerId),
      createdAt: now,
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
  const userRepo = dependencies.userRepository ?? userRepository
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
  const [oldCuratorLabel, newCuratorLabel] = await Promise.all([
    existingIssue.curatorId ? getUserLabel(existingIssue.curatorId, userRepo) : Promise.resolve(null),
    input.curatorId ? getUserLabel(input.curatorId, userRepo) : Promise.resolve(null),
  ])

  await issueRepo.update({
    id: existingIssue.id,
    curatorId: input.curatorId,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'curator-changed',
      oldValue: existingIssue.curatorId
        ? createActivityValue('user', oldCuratorLabel ?? existingIssue.curatorId, existingIssue.curatorId)
        : null,
      newValue: input.curatorId
        ? createActivityValue('user', newCuratorLabel ?? input.curatorId, input.curatorId)
        : null,
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    curatorId: input.curatorId,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}
