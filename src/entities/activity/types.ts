import type { ActivityActionTypeId, EntityId, ISODateString } from '../../shared/types'
import type { IssueId } from '../issue'
import type { UserId } from '../user'

export type ActivityEntryId = EntityId

export interface ActivityEntry {
  id: ActivityEntryId
  issueId: IssueId
  actorId: UserId
  actionType: ActivityActionTypeId
  oldValue: string | null
  newValue: string | null
  createdAt: ISODateString
}
