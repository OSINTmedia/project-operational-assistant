import Dexie, { type Table } from 'dexie'
import type { ActivityEntryRecord, IssueRecord, LabelRecord, ProjectRecord, StatusRecord, TagRecord, TeamRecord, UserRecord } from './records'
import { PERSISTENCE_TABLE_NAMES } from './tableNames'

export class ProjectOperationalAssistantDb extends Dexie {
  users!: Table<UserRecord, UserRecord['id']>
  teams!: Table<TeamRecord, TeamRecord['id']>
  projects!: Table<ProjectRecord, ProjectRecord['id']>
  issues!: Table<IssueRecord, IssueRecord['id']>
  tags!: Table<TagRecord, TagRecord['id']>
  labels!: Table<LabelRecord, LabelRecord['id']>
  statuses!: Table<StatusRecord, StatusRecord['id']>
  activityHistory!: Table<ActivityEntryRecord, ActivityEntryRecord['id']>

  constructor() {
    super('project-operational-assistant')

    this.version(1).stores({
      [PERSISTENCE_TABLE_NAMES.users]: 'id, name, email, role, teamId, isDemoUser',
      [PERSISTENCE_TABLE_NAMES.teams]: 'id, name, createdAt, updatedAt',
      [PERSISTENCE_TABLE_NAMES.projects]:
        'id, name, status, ownerId, teamId, createdBy, createdAt, updatedAt',
      [PERSISTENCE_TABLE_NAMES.issues]:
        'id, projectId, type, statusId, priority, ownerId, curatorId, *participantIds, teamId, *tagIds, *labelIds, dependencyType, dependencyTargetId, createdBy, createdAt, updatedAt, completedAt, confirmationRequired, confirmedBy, confirmedAt',
      [PERSISTENCE_TABLE_NAMES.tags]: 'id, normalizedName, name, createdBy, createdAt',
      [PERSISTENCE_TABLE_NAMES.labels]: 'id, name, type, createdBy, createdAt',
      [PERSISTENCE_TABLE_NAMES.statuses]: 'id, name, isCustom, createdBy, createdAt',
      [PERSISTENCE_TABLE_NAMES.activityHistory]:
        'id, issueId, actorId, actionType, createdAt',
    })
  }
}

export const db = new ProjectOperationalAssistantDb()
