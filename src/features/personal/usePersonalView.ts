import { useEffect, useMemo, useState } from 'react'
import type { Issue, IssueId, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import {
  ISSUE_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  USER_ROLE_LABELS,
  type UserRoleId,
} from '../../shared/types'

type PersonalSectionId =
  | 'assigned'
  | 'created'
  | 'curated'
  | 'needs-update'
  | 'confirmation'

export interface PersonalIssueSummary {
  id: IssueId
  title: string
  projectName: string
  statusLabel: string
  priorityLabel: string
  typeLabel: string
  updatedAt: string
  confirmationRequired: boolean
  attentionLabels: string[]
}

export interface PersonalSection {
  id: PersonalSectionId
  title: string
  description: string
  issues: PersonalIssueSummary[]
  emptyMessage: string
}

export interface PersonalViewData {
  currentUserName: string
  currentUserRoleLabel: string
  sections: PersonalSection[]
}

type PersonalViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: PersonalViewData }

const NEEDS_UPDATE_LABEL_NAME = 'Needs Update'
const READY_FOR_CONFIRMATION_LABEL_NAME = 'Ready for Confirmation'

function sortByUpdatedAtDesc(issues: Issue[]): Issue[] {
  return [...issues].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
}

function isIssueRelatedToUser(issue: Issue, currentUserId: UserId): boolean {
  return (
    issue.ownerId === currentUserId ||
    issue.createdBy === currentUserId ||
    issue.curatorId === currentUserId ||
    issue.participantIds.includes(currentUserId) ||
    issue.dependencyTargetId === currentUserId
  )
}

function createIssueSummary(
  issue: Issue,
  projectNames: Map<string, string>,
  labelNames: Map<string, string>,
): PersonalIssueSummary {
  const attentionLabels = issue.labelIds
    .map((labelId) => labelNames.get(labelId))
    .filter((labelName): labelName is string => Boolean(labelName))

  return {
    id: issue.id,
    title: issue.title,
    projectName: projectNames.get(issue.projectId) ?? 'Unknown project',
    statusLabel: STATUS_LABELS[issue.statusId],
    priorityLabel: PRIORITY_LABELS[issue.priority],
    typeLabel: ISSUE_TYPE_LABELS[issue.type],
    updatedAt: issue.updatedAt,
    confirmationRequired: issue.confirmationRequired,
    attentionLabels,
  }
}

async function loadPersonalViewData(
  currentUserId: UserId,
  currentUserName: string,
  currentUserRole: UserRoleId,
): Promise<PersonalViewData> {
  const [issues, projects, labels] = await Promise.all([
    issueRepository.list(),
    projectRepository.list(),
    labelRepository.list(),
  ])

  const labelNames = new Map(labels.map((label) => [label.id, label.name]))
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))
  const needsUpdateLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)
  const readyForConfirmationLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === READY_FOR_CONFIRMATION_LABEL_NAME)
    .map((label) => label.id)

  const assignedIssues = sortByUpdatedAtDesc(issues.filter((issue) => issue.ownerId === currentUserId))
  const createdIssues = sortByUpdatedAtDesc(issues.filter((issue) => issue.createdBy === currentUserId))
  const curatedIssues = sortByUpdatedAtDesc(
    issues.filter((issue) => issue.curatorId === currentUserId),
  )
  const needsUpdateIssues = sortByUpdatedAtDesc(
    issues.filter(
      (issue) =>
        isIssueRelatedToUser(issue, currentUserId) &&
        issue.labelIds.some((labelId) => needsUpdateLabelIds.includes(labelId)),
    ),
  )
  const confirmationIssues = sortByUpdatedAtDesc(
    issues.filter(
      (issue) =>
        issue.confirmationRequired &&
        issue.dependencyType === 'user' &&
        issue.dependencyTargetId === currentUserId &&
        issue.labelIds.some((labelId) => readyForConfirmationLabelIds.includes(labelId)),
    ),
  )

  return {
    currentUserName,
    currentUserRoleLabel: USER_ROLE_LABELS[currentUserRole],
    sections: [
      {
        id: 'assigned',
        title: 'Assigned to me',
        description: 'Issues where the next operational action is currently on your side.',
        issues: assignedIssues.map((issue) => createIssueSummary(issue, projectNames, labelNames)),
        emptyMessage: 'No assigned issues for the current demo user.',
      },
      {
        id: 'created',
        title: 'Created by me',
        description: 'Issues you opened and may still need to monitor across projects.',
        issues: createdIssues.map((issue) => createIssueSummary(issue, projectNames, labelNames)),
        emptyMessage: 'No issues were created by the current demo user.',
      },
      {
        id: 'curated',
        title: 'Curated by me',
        description: 'Group-oriented work where you are keeping context and continuity intact.',
        issues: curatedIssues.map((issue) => createIssueSummary(issue, projectNames, labelNames)),
        emptyMessage: 'No curated issues are assigned to the current demo user.',
      },
      {
        id: 'needs-update',
        title: 'Needs update',
        description: 'Issues with stale operational context that now need a refreshed status signal.',
        issues: needsUpdateIssues.map((issue) => createIssueSummary(issue, projectNames, labelNames)),
        emptyMessage: 'No issues currently carry the Needs Update attention label.',
      },
      {
        id: 'confirmation',
        title: 'Awaiting my confirmation',
        description: 'Lightweight confirmation placeholders for work that is done from another side and waiting on your acceptance.',
        issues: confirmationIssues.map((issue) => createIssueSummary(issue, projectNames, labelNames)),
        emptyMessage: 'No confirmation-required issues currently point to the current demo user.',
      },
    ],
  }
}

export function usePersonalView(params: {
  currentUserId: UserId | null
  currentUserName: string | null
  currentUserRole: UserRoleId | null
}): PersonalViewState {
  const { currentUserId, currentUserName, currentUserRole } = params
  const [state, setState] = useState<PersonalViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!currentUserId || !currentUserName || !currentUserRole) {
      setState({
        status: 'error',
        message: 'A demo user must be selected before the Personal view can load.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadPersonalViewData(currentUserId, currentUserName, currentUserRole)
      .then((data) => {
        if (!isActive) {
          return
        }

        setState({
          status: 'ready',
          data,
        })
      })
      .catch((error) => {
        if (!isActive) {
          return
        }

        setState({
          status: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to load personal issue relationships.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, currentUserRole])

  return useMemo(() => state, [state])
}
