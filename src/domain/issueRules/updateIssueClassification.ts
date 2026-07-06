import type { IssueRecord } from '../../persistence/records'
import {
  activityHistoryRepository,
  issueRepository,
  labelRepository,
  tagRepository,
  type ActivityHistoryRepository,
  type IssueRepository,
  type LabelRepository,
  type TagRepository,
} from '../../repositories'
import type { IssueId, LabelId, TagId, UserId } from '../../entities'
import { createActivityEntry, createActivityValue } from './activityHistory'

interface UpdateIssueClassificationDependencies {
  issueRepository?: IssueRepository
  activityHistoryRepository?: ActivityHistoryRepository
  tagRepository?: TagRepository
  labelRepository?: LabelRepository
  createId?: () => string
  now?: () => string
}

export interface AddIssueTagInput {
  issueId: IssueId
  actorId: UserId
  tagId: TagId
}

export interface RemoveIssueTagInput {
  issueId: IssueId
  actorId: UserId
  tagId: TagId
}

export interface AddIssueLabelInput {
  issueId: IssueId
  actorId: UserId
  labelId: LabelId
}

export interface RemoveIssueLabelInput {
  issueId: IssueId
  actorId: UserId
  labelId: LabelId
}

function getNow(dependencies: UpdateIssueClassificationDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

function getCreateId(dependencies: UpdateIssueClassificationDependencies): string {
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

async function assertTagExists(tagId: TagId, repository: TagRepository): Promise<string> {
  const tag = await repository.getById(tagId)

  if (!tag) {
    throw new Error(`Tag not found: ${tagId}`)
  }

  return tag.name
}

async function assertLabelExists(labelId: LabelId, repository: LabelRepository): Promise<string> {
  const label = await repository.getById(labelId)

  if (!label) {
    throw new Error(`Label not found: ${labelId}`)
  }

  return label.name
}

export async function addIssueTag(
  input: AddIssueTagInput,
  dependencies: UpdateIssueClassificationDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.tagId, 'Tag')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const tagRepo = dependencies.tagRepository ?? tagRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const tagName = await assertTagExists(input.tagId, tagRepo)

  if (existingIssue.tagIds.includes(input.tagId)) {
    return existingIssue
  }

  const now = getNow(dependencies)
  const nextTagIds = [...existingIssue.tagIds, input.tagId]

  await issueRepo.update({
    id: existingIssue.id,
    tagIds: nextTagIds,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'tag-added',
      oldValue: null,
      newValue: createActivityValue('tag', tagName, input.tagId),
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    tagIds: nextTagIds,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}

export async function removeIssueTag(
  input: RemoveIssueTagInput,
  dependencies: UpdateIssueClassificationDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.tagId, 'Tag')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const tagRepo = dependencies.tagRepository ?? tagRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const tagName = await assertTagExists(input.tagId, tagRepo)

  if (!existingIssue.tagIds.includes(input.tagId)) {
    return existingIssue
  }

  const now = getNow(dependencies)
  const nextTagIds = existingIssue.tagIds.filter((tagId) => tagId !== input.tagId)

  await issueRepo.update({
    id: existingIssue.id,
    tagIds: nextTagIds,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'tag-removed',
      oldValue: createActivityValue('tag', tagName, input.tagId),
      newValue: null,
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    tagIds: nextTagIds,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}

export async function addIssueLabel(
  input: AddIssueLabelInput,
  dependencies: UpdateIssueClassificationDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.labelId, 'Label')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const labelRepo = dependencies.labelRepository ?? labelRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const labelName = await assertLabelExists(input.labelId, labelRepo)

  if (existingIssue.labelIds.includes(input.labelId)) {
    return existingIssue
  }

  const now = getNow(dependencies)
  const nextLabelIds = [...existingIssue.labelIds, input.labelId]

  await issueRepo.update({
    id: existingIssue.id,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'label-added',
      oldValue: null,
      newValue: createActivityValue('label', labelName, input.labelId),
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}

export async function removeIssueLabel(
  input: RemoveIssueLabelInput,
  dependencies: UpdateIssueClassificationDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.actorId, 'Actor')
  assertRequiredId(input.labelId, 'Label')

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo = dependencies.activityHistoryRepository ?? activityHistoryRepository
  const labelRepo = dependencies.labelRepository ?? labelRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const labelName = await assertLabelExists(input.labelId, labelRepo)

  if (!existingIssue.labelIds.includes(input.labelId)) {
    return existingIssue
  }

  const now = getNow(dependencies)
  const nextLabelIds = existingIssue.labelIds.filter((labelId) => labelId !== input.labelId)

  await issueRepo.update({
    id: existingIssue.id,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
  })

  await historyRepo.put(
    createActivityEntry({
      id: getCreateId(dependencies),
      issueId: existingIssue.id,
      actorId: input.actorId,
      actionType: 'label-removed',
      oldValue: createActivityValue('label', labelName, input.labelId),
      newValue: null,
      createdAt: now,
    }),
  )

  return {
    ...existingIssue,
    labelIds: nextLabelIds,
    updatedBy: input.actorId,
    updatedAt: now,
  }
}
