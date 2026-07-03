import { clearPersistedDemoData, writeDemoData } from './demoDataLifecycle'
import { demoSeedData, type SeedState } from './seedData'

export async function resetDemoData(): Promise<SeedState> {
  await clearPersistedDemoData()
  const data = await writeDemoData(demoSeedData)

  return {
    initialized: true,
    data,
  }
}
