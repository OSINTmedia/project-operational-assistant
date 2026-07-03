import type {
  ActivityEntry,
  Issue,
  Label,
  Project,
  Tag,
  Team,
  User,
  UserId,
} from '../entities'
import type { ISODateString, StatusId } from '../shared/types'

export type UserRecord = User
export type TeamRecord = Team
export type ProjectRecord = Project
export type IssueRecord = Issue
export type TagRecord = Tag
export type LabelRecord = Label
export type ActivityEntryRecord = ActivityEntry

export type PersistedStatusId = StatusId | string

export interface StatusRecord {
  id: PersistedStatusId
  name: string
  isCustom: boolean
  createdBy: UserId | null
  createdAt: ISODateString | null
}
