import type { EntityId, HexColor, ISODateString, LabelTypeId } from '../../shared/types'
import type { UserId } from '../user'

export type TagId = EntityId
export type LabelId = EntityId

export interface Tag {
  id: TagId
  name: string
  normalizedName: string
  color: HexColor
  usageCount: number
  createdBy: UserId
  createdAt: ISODateString
}

export interface Label {
  id: LabelId
  name: string
  type: LabelTypeId
  color: HexColor
  createdBy: UserId
  createdAt: ISODateString
}
