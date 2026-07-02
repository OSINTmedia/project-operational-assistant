import { db } from './db'
import { initialSeedState, type SeedState } from './seedData'

export async function resetDemoData(): Promise<SeedState> {
  await db.delete()

  // TODO: recreate database records from seed data when persistence is implemented.
  return initialSeedState
}
