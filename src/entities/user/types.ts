import type { EntityId, UserRoleId } from '../../shared/types'

export type UserId = EntityId

export interface User {
  id: UserId
  name: string
  email: string
  role: UserRoleId
  teamId: EntityId | null
  avatarInitials: string
  isDemoUser: boolean
}
