import { create } from 'zustand'
import type { UserId } from '../../entities'
import { loadSeedData } from '../../persistence/seedData'
import type { UserRecord } from '../../persistence/records'
import type { UserRoleId } from '../../shared/types'

type AppLifecycleStatus = 'idle' | 'loading' | 'ready' | 'error'

type DemoAppState = {
  lifecycleStatus: AppLifecycleStatus
  isSeedDataInitialized: boolean
  errorMessage: string | null
  demoUsers: UserRecord[]
  currentUserId: UserId | null
  selectedRole: UserRoleId | null
  initialize: () => Promise<void>
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

export const useDemoAppState = create<DemoAppState>((set, get) => ({
  lifecycleStatus: 'idle',
  isSeedDataInitialized: false,
  errorMessage: null,
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
      const demoUsers = seedState.data.users.filter((user) => user.isDemoUser)
      const defaultUser = getDefaultUser(demoUsers)

      set({
        lifecycleStatus: 'ready',
        isSeedDataInitialized: seedState.initialized,
        demoUsers,
        currentUserId: defaultUser?.id ?? null,
        selectedRole: defaultUser?.role ?? null,
      })
    } catch (error) {
      set({
        lifecycleStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Failed to initialize local demo data.',
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
