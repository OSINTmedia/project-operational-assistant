import type { IssueId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { IssueRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type IssueRepository = EntityRepository<IssueRecord, IssueId>

export function createIssueRepository(
  database: ProjectOperationalAssistantDb = db,
): IssueRepository {
  return createEntityRepository(database.issues)
}

export const issueRepository = createIssueRepository()
