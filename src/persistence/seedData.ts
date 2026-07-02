export type SeedState = {
  initialized: boolean
}

export const initialSeedState: SeedState = {
  initialized: false,
}

export async function loadSeedData(): Promise<SeedState> {
  // TODO: replace with full seed collections and first-load bootstrap behavior.
  return initialSeedState
}
