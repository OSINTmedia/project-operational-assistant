import type { EntityId, ISODateString } from '../../shared/types'
import type { UserId } from '../user'

export type TeamId = EntityId

export interface Team {
  id: TeamId
  name: string
  description: string
  memberIds: UserId[]
  createdAt: ISODateString
  updatedAt: ISODateString
}
