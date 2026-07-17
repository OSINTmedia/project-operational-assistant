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
import type { IssueId, LabelId, TagId, UserId } from '../../entities'
import { syncProjectStatusFromIssues } from '../projectRules'
import { createActivityEntry, createActivityValue } from './activityHistory'
import {
  addIssueLabel,
  addIssueTag,
  removeIssueLabel,
  removeIssueTag,
} from './updateIssueClassification'
import { reopenIssueFromConfirmation } from './updateIssueAttention'
import { updateIssueCurator, transferIssueOwner } from './updateIssueResponsibility'
import { updateIssuePriority, updateIssueStatus } from './updateIssueState'

interface SaveIssueEditsDependencies {
  issueRepository?: IssueRepository
  activityHistoryRepository?: ActivityHistoryRepository
  projectRepository?: ProjectRepository
  createId?: () => string
  now?: () => string
}

export interface SaveIssueEditsInput {
  issueId: IssueId
  actorId: UserId
  title: string
  description: string
  projectId: string
  statusId: StatusId
  type: IssueTypeId
  priority: PriorityId
  ownerId: UserId
  curatorId: UserId | null
  tagIds: TagId[]
  labelIds: LabelId[]
  preservedSystemLabelIds: LabelId[]
  dependencyType: DependencyTypeId
  dependencyTargetId: string | null
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function assertRequiredId(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`)
  }
}

function getNow(dependencies: SaveIssueEditsDependencies): string {
  return (dependencies.now ?? (() => new Date().toISOString()))()
}

function getCreateId(dependencies: SaveIssueEditsDependencies): string {
  return (dependencies.createId ?? (() => crypto.randomUUID()))()
}

async function getExistingIssue(issueId: IssueId, repository: IssueRepository): Promise<IssueRecord> {
  const issue = await repository.getById(issueId)

  if (!issue) {
    throw new Error(`Issue not found: ${issueId}`)
  }

  return issue
}

function getIssueUpdatedSummary(oldIssue: IssueRecord, nextIssue: IssueRecord): string | null {
  const changedFields: string[] = []

  if (oldIssue.title !== nextIssue.title) changedFields.push('title')
  if (oldIssue.description !== nextIssue.description) changedFields.push('description')
  if (oldIssue.projectId !== nextIssue.projectId) changedFields.push('project')
  if (oldIssue.type !== nextIssue.type) changedFields.push('type')
  if (oldIssue.dependencyType !== nextIssue.dependencyType) changedFields.push('dependency')
  if (oldIssue.dependencyTargetId !== nextIssue.dependencyTargetId) changedFields.push('dependency target')

  return changedFields.length > 0 ? changedFields.join(', ') : null
}

function areStringArraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

export async function saveIssueEdits(
  input: SaveIssueEditsInput,
  dependencies: SaveIssueEditsDependencies = {},
): Promise<IssueRecord> {
  assertRequiredId(input.issueId, 'Issue')
  assertRequiredId(input.actorId, 'Actor')

  const title = normalizeText(input.title)
  const description = normalizeText(input.description)
  const projectId = normalizeText(input.projectId)
  const ownerId = normalizeText(input.ownerId)
  const curatorId = input.curatorId ? normalizeText(input.curatorId) : null
  const dependencyTargetId =
    input.dependencyType === 'none' ? null : normalizeText(input.dependencyTargetId)

  if (!title) {
    throw new Error('Issue title is required.')
  }

  assertRequiredId(projectId, 'Project')
  assertRequiredId(input.statusId, 'Status')
  assertRequiredId(ownerId, 'Owner')

  if (input.type === 'group' && !curatorId) {
    throw new Error('Group issues require a curator.')
  }

  if (input.dependencyType !== 'none' && !dependencyTargetId) {
    throw new Error('A dependency target is required when a dependency is selected.')
  }

  const issueRepo = dependencies.issueRepository ?? issueRepository
  const historyRepo =
    dependencies.activityHistoryRepository ?? activityHistoryRepository
  const projectsRepo = dependencies.projectRepository ?? projectRepository
  const existingIssue = await getExistingIssue(input.issueId, issueRepo)
  const nextProject = await projectsRepo.getById(projectId)

  if (!nextProject) {
    throw new Error(`Project not found: ${projectId}`)
  }

  const now = getNow(dependencies)
  const nextType = input.type
  const nextCuratorId = nextType === 'group' ? curatorId : null
  const nextParticipantIds = nextType === 'group' ? existingIssue.participantIds : []

  let nextIssue = existingIssue

  if (
    existingIssue.title !== title ||
    existingIssue.description !== description ||
    existingIssue.projectId !== projectId ||
    existingIssue.teamId !== nextProject.teamId ||
      existingIssue.type !== nextType ||
      existingIssue.dependencyType !== input.dependencyType ||
      existingIssue.dependencyTargetId !== dependencyTargetId ||
      !areStringArraysEqual(existingIssue.participantIds, nextParticipantIds)
  ) {
    await issueRepo.update({
      id: existingIssue.id,
      title,
      description,
      projectId,
      teamId: nextProject.teamId,
      type: nextType,
      participantIds: nextParticipantIds,
      dependencyType: input.dependencyType,
      dependencyTargetId,
      updatedBy: input.actorId,
      updatedAt: now,
    })

    const reloadedIssue = await getExistingIssue(input.issueId, issueRepo)
    const changedSummary = getIssueUpdatedSummary(existingIssue, reloadedIssue)

    if (changedSummary) {
      await historyRepo.put(
        createActivityEntry({
          id: getCreateId(dependencies),
          issueId: existingIssue.id,
          actorId: input.actorId,
          actionType: 'issue-updated',
          oldValue: createActivityValue('text', 'Structured issue details'),
          newValue: createActivityValue('text', `Updated: ${changedSummary}`),
          createdAt: now,
        }),
      )
    }

    nextIssue = reloadedIssue
  }

  if (nextIssue.statusId !== input.statusId) {
    if (nextIssue.confirmationRequired && input.statusId !== 'done') {
      nextIssue = await reopenIssueFromConfirmation(
        {
          issueId: nextIssue.id,
          actorId: input.actorId,
          statusId: input.statusId,
        },
        dependencies,
      )
    } else {
      nextIssue = await updateIssueStatus(
        {
          issueId: nextIssue.id,
          actorId: input.actorId,
          statusId: input.statusId,
        },
        dependencies,
      )
    }
  }

  if (nextIssue.priority !== input.priority) {
    nextIssue = await updateIssuePriority(
      {
        issueId: nextIssue.id,
        actorId: input.actorId,
        priority: input.priority,
      },
      dependencies,
    )
  }

  if (nextIssue.ownerId !== ownerId) {
    nextIssue = await transferIssueOwner(
      {
        issueId: nextIssue.id,
        actorId: input.actorId,
        ownerId,
      },
      dependencies,
    )
  }

  if (nextIssue.curatorId !== nextCuratorId) {
    nextIssue = await updateIssueCurator(
      {
        issueId: nextIssue.id,
        actorId: input.actorId,
        curatorId: nextCuratorId,
      },
      dependencies,
    )
  }

  const currentTagIds = new Set(nextIssue.tagIds)
  const nextTagIds = new Set(input.tagIds)

  for (const tagId of nextIssue.tagIds) {
    if (!nextTagIds.has(tagId)) {
      nextIssue = await removeIssueTag(
        {
          issueId: nextIssue.id,
          actorId: input.actorId,
          tagId,
        },
        dependencies,
      )
    }
  }

  for (const tagId of input.tagIds) {
    if (!currentTagIds.has(tagId)) {
      nextIssue = await addIssueTag(
        {
          issueId: nextIssue.id,
          actorId: input.actorId,
          tagId,
        },
        dependencies,
      )
    }
  }

  const preservedCurrentSystemLabelIds = input.preservedSystemLabelIds.filter((labelId) =>
    nextIssue.labelIds.includes(labelId),
  )
  const targetLabelIds = [...new Set([...input.labelIds, ...preservedCurrentSystemLabelIds])]
  const currentLabelIds = new Set(nextIssue.labelIds)
  const nextLabelIds = new Set(targetLabelIds)

  for (const labelId of nextIssue.labelIds) {
    if (!nextLabelIds.has(labelId)) {
      nextIssue = await removeIssueLabel(
        {
          issueId: nextIssue.id,
          actorId: input.actorId,
          labelId,
        },
        dependencies,
      )
    }
  }

  for (const labelId of targetLabelIds) {
    if (!currentLabelIds.has(labelId)) {
      nextIssue = await addIssueLabel(
        {
          issueId: nextIssue.id,
          actorId: input.actorId,
          labelId,
        },
        dependencies,
      )
    }
  }

  const finalIssue = await getExistingIssue(nextIssue.id, issueRepo)

  await syncProjectStatusFromIssues(existingIssue.projectId, {
    issueRepository: issueRepo,
    projectRepository: projectsRepo,
    now: dependencies.now,
  })

  if (finalIssue.projectId !== existingIssue.projectId) {
    await syncProjectStatusFromIssues(finalIssue.projectId, {
      issueRepository: issueRepo,
      projectRepository: projectsRepo,
      now: dependencies.now,
    })
  }

  return finalIssue
}
