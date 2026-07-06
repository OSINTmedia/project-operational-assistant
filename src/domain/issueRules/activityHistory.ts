import type { ActivityEntryRecord } from '../../persistence/records'
import type { ActivityActionTypeId, ISODateString } from '../../shared/types'
import type { ActivityValue, ActivityValueKind, IssueId, UserId } from '../../entities'

export function createActivityValue(
  kind: ActivityValueKind,
  label: string,
  id: string | null = null,
): ActivityValue {
  return {
    kind,
    id,
    label,
  }
}

export function createActivityEntry(params: {
  id: string
  issueId: IssueId
  actorId: UserId
  actionType: ActivityActionTypeId
  oldValue: ActivityValue | null
  newValue: ActivityValue | null
  createdAt: ISODateString
}): ActivityEntryRecord {
  return {
    id: params.id,
    issueId: params.issueId,
    actorId: params.actorId,
    actionType: params.actionType,
    oldValue: params.oldValue,
    newValue: params.newValue,
    createdAt: params.createdAt,
  }
}
