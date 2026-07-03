import type { TagId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { TagRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type TagRepository = EntityRepository<TagRecord, TagId>

export function createTagRepository(
  database: ProjectOperationalAssistantDb = db,
): TagRepository {
  return createEntityRepository(database.tags)
}

export const tagRepository = createTagRepository()
