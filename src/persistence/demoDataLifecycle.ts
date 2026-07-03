import { db, type ProjectOperationalAssistantDb } from './db'
import type { DemoSeedData } from './seedData'

export async function readPersistedDemoData(
  database: ProjectOperationalAssistantDb = db,
): Promise<DemoSeedData> {
  const [users, teams, projects, issues, tags, labels, statuses, activityHistory] =
    await Promise.all([
      database.users.toArray(),
      database.teams.toArray(),
      database.projects.toArray(),
      database.issues.toArray(),
      database.tags.toArray(),
      database.labels.toArray(),
      database.statuses.toArray(),
      database.activityHistory.toArray(),
    ])

  return {
    users,
    teams,
    projects,
    statuses,
    tags,
    labels,
    issues,
    activityHistory,
  }
}

export async function writeDemoData(
  data: DemoSeedData,
  database: ProjectOperationalAssistantDb = db,
): Promise<DemoSeedData> {
  await database.transaction('rw', database.tables, async () => {
    await Promise.all([
      database.users.bulkPut(data.users),
      database.teams.bulkPut(data.teams),
      database.projects.bulkPut(data.projects),
      database.issues.bulkPut(data.issues),
      database.tags.bulkPut(data.tags),
      database.labels.bulkPut(data.labels),
      database.statuses.bulkPut(data.statuses),
      database.activityHistory.bulkPut(data.activityHistory),
    ])
  })

  return readPersistedDemoData(database)
}

export async function clearPersistedDemoData(
  database: ProjectOperationalAssistantDb = db,
): Promise<void> {
  await database.transaction('rw', database.tables, async () => {
    await Promise.all([
      database.activityHistory.clear(),
      database.issues.clear(),
      database.projects.clear(),
      database.teams.clear(),
      database.users.clear(),
      database.tags.clear(),
      database.labels.clear(),
      database.statuses.clear(),
    ])
  })
}

export async function hasPersistedDemoData(
  database: ProjectOperationalAssistantDb = db,
): Promise<boolean> {
  const userCount = await database.users.count()
  return userCount > 0
}
