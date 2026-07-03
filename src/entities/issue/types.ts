import type {
  DependencyTypeId,
  ISODateString,
  IssueTypeId,
  PriorityId,
  StatusId,
} from '../../shared/types'
import type { ProjectId } from '../project'
import type { LabelId, TagId } from '../tag'
import type { TeamId } from '../team'
import type { UserId } from '../user'

export type IssueId = string

export interface Issue {
  id: IssueId
  title: string
  description: string
  projectId: ProjectId
  type: IssueTypeId
  statusId: StatusId
  priority: PriorityId
  ownerId: UserId
  curatorId: UserId | null
  teamId: TeamId
  tagIds: TagId[]
  labelIds: LabelId[]
  dependencyType: DependencyTypeId
  dependencyTargetId: string | null
  createdBy: UserId
  createdAt: ISODateString
  updatedBy: UserId
  updatedAt: ISODateString
  completedAt: ISODateString | null
  confirmationRequired: boolean
  confirmedBy: UserId | null
  confirmedAt: ISODateString | null
}
