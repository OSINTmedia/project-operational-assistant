import type { EntityId, ISODateString, StatusId } from '../../shared/types'
import type { TeamId } from '../team'
import type { UserId } from '../user'

export type ProjectId = EntityId
export type ProjectStatusId = StatusId

export interface Project {
  id: ProjectId
  name: string
  description: string
  status: ProjectStatusId
  ownerId: UserId
  teamId: TeamId
  createdBy: UserId
  createdAt: ISODateString
  updatedAt: ISODateString
}
