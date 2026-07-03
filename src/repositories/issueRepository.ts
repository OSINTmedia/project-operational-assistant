import type { IssueId, ProjectId, TeamId, UserId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { IssueRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'
import type { StatusId } from '../shared/types'

export type CreateIssueRecordInput = IssueRecord

export type UpdateIssueRecordInput = Pick<IssueRecord, 'id' | 'updatedBy' | 'updatedAt'> &
  Partial<
    Omit<IssueRecord, 'id' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>
  >

export interface IssueRepository extends EntityRepository<IssueRecord, IssueId> {
  create(issue: CreateIssueRecordInput): Promise<IssueId>
  update(input: UpdateIssueRecordInput): Promise<IssueId>
  listByProjectId(projectId: ProjectId): Promise<IssueRecord[]>
  listByOwnerId(ownerId: UserId): Promise<IssueRecord[]>
  listByTeamId(teamId: TeamId): Promise<IssueRecord[]>
  listByStatusId(statusId: StatusId): Promise<IssueRecord[]>
}

export function createIssueRepository(
  database: ProjectOperationalAssistantDb = db,
): IssueRepository {
  const baseRepository = createEntityRepository<IssueRecord, IssueId>(database.issues)

  return {
    ...baseRepository,

    create(issue) {
      return baseRepository.put(issue)
    },

    async update(input) {
      const existingIssue = await baseRepository.getById(input.id)

      if (!existingIssue) {
        throw new Error(`Issue not found: ${input.id}`)
      }

      const nextIssue: IssueRecord = {
        ...existingIssue,
        ...input,
        id: existingIssue.id,
        createdBy: existingIssue.createdBy,
        createdAt: existingIssue.createdAt,
      }

      return baseRepository.put(nextIssue)
    },

    listByProjectId(projectId) {
      return database.issues.where('projectId').equals(projectId).toArray()
    },

    listByOwnerId(ownerId) {
      return database.issues.where('ownerId').equals(ownerId).toArray()
    },

    listByTeamId(teamId) {
      return database.issues.where('teamId').equals(teamId).toArray()
    },

    listByStatusId(statusId) {
      return database.issues.where('statusId').equals(statusId).toArray()
    },
  }
}

export const issueRepository = createIssueRepository()
