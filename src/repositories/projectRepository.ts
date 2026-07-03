import type { ProjectId } from '../entities'
import { db, type ProjectOperationalAssistantDb } from '../persistence/db'
import type { ProjectRecord } from '../persistence/records'
import { createEntityRepository, type EntityRepository } from './createEntityRepository'

export type ProjectRepository = EntityRepository<ProjectRecord, ProjectId>

export function createProjectRepository(
  database: ProjectOperationalAssistantDb = db,
): ProjectRepository {
  return createEntityRepository(database.projects)
}

export const projectRepository = createProjectRepository()
