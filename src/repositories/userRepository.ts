import type { UserId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { UserRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type UserRepository = EntityRepository<UserRecord, UserId>

export function createUserRepository(
  database: ProjectOperationalAssistantDb = db,
): UserRepository {
  return createEntityRepository(database.users)
}

export const userRepository = createUserRepository()
