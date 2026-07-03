import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { PersistedStatusId, StatusRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type StatusRepository = EntityRepository<StatusRecord, PersistedStatusId>

export function createStatusRepository(
  database: ProjectOperationalAssistantDb = db,
): StatusRepository {
  return createEntityRepository(database.statuses)
}

export const statusRepository = createStatusRepository()
