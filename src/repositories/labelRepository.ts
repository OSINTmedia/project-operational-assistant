import type { LabelId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { LabelRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type LabelRepository = EntityRepository<LabelRecord, LabelId>

export function createLabelRepository(
  database: ProjectOperationalAssistantDb = db,
): LabelRepository {
  return createEntityRepository(database.labels)
}

export const labelRepository = createLabelRepository()
