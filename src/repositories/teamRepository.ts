import type { TeamId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { TeamRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type TeamRepository = EntityRepository<TeamRecord, TeamId>

export function createTeamRepository(
  database: ProjectOperationalAssistantDb = db,
): TeamRepository {
  return createEntityRepository(database.teams)
}

export const teamRepository = createTeamRepository()
