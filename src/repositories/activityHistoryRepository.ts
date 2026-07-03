import type { ActivityEntryId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { ActivityEntryRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type ActivityHistoryRepository = EntityRepository<
  ActivityEntryRecord,
  ActivityEntryId
>

export function createActivityHistoryRepository(
  database: ProjectOperationalAssistantDb = db,
): ActivityHistoryRepository {
  return createEntityRepository(database.activityHistory)
}

export const activityHistoryRepository = createActivityHistoryRepository()
