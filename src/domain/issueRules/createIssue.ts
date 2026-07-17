import type { IssueRecord } from '../../persistence/records'
import {
  activityHistoryRepository,
  issueRepository,
  projectRepository,
  type ActivityHistoryRepository,
  type IssueRepository,
  type ProjectRepository,
} from '../../repositories'
import type {
  DependencyTypeId,
  IssueTypeId,
  PriorityId,
  StatusId,
} from '../../shared/types'
import type { LabelId, ProjectId, TagId, TeamId, UserId } from '../../entities'
import { syncProjectStatusFromIssues } from '../projectRules'
import { createActivityEntry, createActivityValue } from './activityHistory'

export interface CreateIssueInput {
  title: string
  description?: string
  projectId: ProjectId
  teamId: TeamId
  actorId: UserId
  ownerId?: UserId
  curatorId?: UserId | null
  participantIds?: UserId[]
  type?: IssueTypeId
  statusId?: StatusId
  priority?: PriorityId
  tagIds?: TagId[]
  labelIds?: LabelId[]
  dependencyType?: DependencyTypeId
  dependencyTargetId?: string | null
  confirmationRequired?: boolean
}

export interface CreateIssueDependencies {
  createId?: () => string
  now?: () => string
  repository?: IssueRepository
  projectRepository?: ProjectRepository
  activityHistoryRepository?: ActivityHistoryRepository
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function assertRequiredId(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`)
  }
}

export function buildIssueRecord(
  input: CreateIssueInput,
  dependencies: Omit<CreateIssueDependencies, 'repository'> = {},
): IssueRecord {
  const title = normalizeText(input.title)
  const description = normalizeText(input.description)

  if (!title) {
    throw new Error('Issue title is required.')
  }

  assertRequiredId(input.projectId, 'Project')
  assertRequiredId(input.teamId, 'Team')
  assertRequiredId(input.actorId, 'Actor')

  const type = input.type ?? 'individual'
  const ownerId = input.ownerId ?? input.actorId
  const curatorId =
    type === 'group'
      ? input.curatorId ?? input.actorId
      : input.curatorId ?? null
  const participantIds =
    type === 'group'
      ? [...new Set(input.participantIds ?? [])]
      : []
  const statusId = input.statusId ?? 'new'
  const priority = input.priority ?? 'medium'
  const dependencyType = input.dependencyType ?? 'none'
  const dependencyTargetId =
    dependencyType === 'none'
      ? null
      : normalizeText(input.dependencyTargetId) || null
  const createdAt = (dependencies.now ?? (() => new Date().toISOString()))()
  const createId = dependencies.createId ?? (() => crypto.randomUUID())
  const completedAt = statusId === 'done' ? createdAt : null

  return {
    id: createId(),
    title,
    description,
    projectId: input.projectId,
    type,
    statusId,
    priority,
    ownerId,
    curatorId,
    participantIds,
    teamId: input.teamId,
    tagIds: input.tagIds ?? [],
    labelIds: input.labelIds ?? [],
    dependencyType,
    dependencyTargetId,
    createdBy: input.actorId,
    createdAt,
    updatedBy: input.actorId,
    updatedAt: createdAt,
    completedAt,
    confirmationRequired: input.confirmationRequired ?? false,
    confirmedBy: null,
    confirmedAt: null,
  }
}

export async function createIssue(
  input: CreateIssueInput,
  dependencies: CreateIssueDependencies = {},
): Promise<IssueRecord> {
  const repository = dependencies.repository ?? issueRepository
  const projectsRepository = dependencies.projectRepository ?? projectRepository
  const historyRepository =
    dependencies.activityHistoryRepository ?? activityHistoryRepository
  const issueRecord = buildIssueRecord(input, dependencies)

  await repository.create(issueRecord)
  await historyRepository.put(
    createActivityEntry({
      id: (dependencies.createId ?? (() => crypto.randomUUID()))(),
      issueId: issueRecord.id,
      actorId: input.actorId,
      actionType: 'issue-created',
      oldValue: null,
      newValue: createActivityValue('issue', issueRecord.title, issueRecord.id),
      createdAt: issueRecord.createdAt,
    }),
  )

  await syncProjectStatusFromIssues(issueRecord.projectId, {
    issueRepository: repository,
    projectRepository: projectsRepository,
    now: dependencies.now,
  })

  return issueRecord
}
