import type { ActivityActionTypeId, EntityId, ISODateString } from '../../shared/types'
import type { IssueId } from '../issue'
import type { UserId } from '../user'

export type ActivityEntryId = EntityId

export type ActivityValueKind =
  | 'issue'
  | 'status'
  | 'priority'
  | 'user'
  | 'tag'
  | 'label'
  | 'text'

export interface ActivityValue {
  kind: ActivityValueKind
  id: string | null
  label: string
}

export interface ActivityEntry {
  id: ActivityEntryId
  issueId: IssueId
  actorId: UserId
  actionType: ActivityActionTypeId
  oldValue: ActivityValue | null
  newValue: ActivityValue | null
  createdAt: ISODateString
}
