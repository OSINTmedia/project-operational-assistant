import { create } from 'zustand'
import type { UserId } from '../../entities'
import { resetDemoData as resetPersistedDemoData } from '../../persistence/resetDemoData'
import { loadSeedData, type SeedState } from '../../persistence/seedData'
import type { UserRecord } from '../../persistence/records'
import type { UserRoleId } from '../../shared/types'

type AppLifecycleStatus = 'idle' | 'loading' | 'ready' | 'error'
type DemoControlsStatus = 'idle' | 'resetting'

type DemoAppState = {
  lifecycleStatus: AppLifecycleStatus
  demoControlsStatus: DemoControlsStatus
  isSeedDataInitialized: boolean
  errorMessage: string | null
  resetErrorMessage: string | null
  lastResetAt: string | null
  demoUsers: UserRecord[]
  currentUserId: UserId | null
  selectedRole: UserRoleId | null
  initialize: () => Promise<void>
  resetDemoData: () => Promise<void>
  setSelectedRole: (role: UserRoleId) => void
  setCurrentUser: (userId: UserId) => void
}

function getDefaultUser(users: UserRecord[], preferredRole?: UserRoleId): UserRecord | null {
  if (preferredRole) {
    const roleMatch = users.find((user) => user.role === preferredRole)

    if (roleMatch) {
      return roleMatch
    }
  }

  return users[0] ?? null
}

function getHydratedDemoIdentityState(
  seedState: SeedState,
  preferredRole: UserRoleId | null,
): Pick<DemoAppState, 'isSeedDataInitialized' | 'demoUsers' | 'currentUserId' | 'selectedRole'> {
  const demoUsers = seedState.data.users.filter((user) => user.isDemoUser)
  const defaultUser = getDefaultUser(demoUsers, preferredRole ?? undefined)

  return {
    isSeedDataInitialized: seedState.initialized,
    demoUsers,
    currentUserId: defaultUser?.id ?? null,
    selectedRole: defaultUser?.role ?? null,
  }
}

export const useDemoAppState = create<DemoAppState>((set, get) => ({
  lifecycleStatus: 'idle',
  demoControlsStatus: 'idle',
  isSeedDataInitialized: false,
  errorMessage: null,
  resetErrorMessage: null,
  lastResetAt: null,
  demoUsers: [],
  currentUserId: null,
  selectedRole: null,

  initialize: async () => {
    const { lifecycleStatus } = get()

    if (lifecycleStatus === 'loading' || lifecycleStatus === 'ready') {
      return
    }

    set({
      lifecycleStatus: 'loading',
      errorMessage: null,
    })

    try {
      const seedState = await loadSeedData()

      set({
        lifecycleStatus: 'ready',
        ...getHydratedDemoIdentityState(seedState, null),
      })
    } catch (error) {
      set({
        lifecycleStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Failed to initialize local demo data.',
      })
    }
  },

  resetDemoData: async () => {
    const { demoControlsStatus, selectedRole } = get()

    if (demoControlsStatus === 'resetting') {
      return
    }

    set({
      demoControlsStatus: 'resetting',
      resetErrorMessage: null,
    })

    try {
      const seedState = await resetPersistedDemoData()

      set({
        demoControlsStatus: 'idle',
        lastResetAt: new Date().toISOString(),
        resetErrorMessage: null,
        ...getHydratedDemoIdentityState(seedState, selectedRole),
      })
    } catch (error) {
      set({
        demoControlsStatus: 'idle',
        resetErrorMessage:
          error instanceof Error ? error.message : 'Failed to reset local demo data.',
      })
    }
  },

  setSelectedRole: (role) => {
    const { demoUsers, currentUserId } = get()
    const currentUser = demoUsers.find((user) => user.id === currentUserId) ?? null
    const nextUser =
      (currentUser?.role === role ? currentUser : null) ?? getDefaultUser(demoUsers, role)

    set({
      selectedRole: role,
      currentUserId: nextUser?.id ?? null,
    })
  },

  setCurrentUser: (userId) => {
    const currentUser = get().demoUsers.find((user) => user.id === userId)

    if (!currentUser) {
      return
    }

    set({
      currentUserId: currentUser.id,
      selectedRole: currentUser.role,
    })
  },
}))

export function getCurrentDemoUser(
  demoUsers: UserRecord[],
  currentUserId: UserId | null,
): UserRecord | null {
  if (!currentUserId) {
    return null
  }

  return demoUsers.find((user) => user.id === currentUserId) ?? null
}
