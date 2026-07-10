import { useEffect, useMemo, useState } from 'react'
import type { IssueId } from '../../entities'
import {
  activityHistoryRepository,
  issueRepository,
  labelRepository,
  projectRepository,
  statusRepository,
  tagRepository,
  teamRepository,
  userRepository,
} from '../../repositories'
import {
  ACTIVITY_ACTION_LABELS,
  DEPENDENCY_TYPE_LABELS,
  ISSUE_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../../shared/types'

export interface IssueDetailActivityEntry {
  id: string
  actionLabel: string
  actorName: string
  oldValueLabel: string | null
  newValueLabel: string | null
  createdAt: string
}

export interface IssueDetailData {
  id: IssueId
  title: string
  description: string
  projectId: string
  projectName: string
  teamName: string
  typeLabel: string
  statusLabel: string
  priorityLabel: string
  ownerName: string
  curatorName: string | null
  createdByName: string
  updatedByName: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
  confirmedAt: string | null
  confirmedByName: string | null
  confirmationRequired: boolean
  dependencyLabel: string
  dependencyTargetLabel: string | null
  tagNames: string[]
  labelNames: string[]
  participantNames: string[]
  activity: IssueDetailActivityEntry[]
}

type IssueDetailViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing'; message: string }
  | { status: 'ready'; data: IssueDetailData }

function resolveDependencyTargetLabel(params: {
  dependencyType: string
  dependencyTargetId: string | null
  issueTitles: Map<string, string>
  userNames: Map<string, string>
  teamNames: Map<string, string>
}): string | null {
  const { dependencyType, dependencyTargetId, issueTitles, userNames, teamNames } = params

  if (!dependencyTargetId) {
    return null
  }

  if (issueTitles.has(dependencyTargetId)) {
    return issueTitles.get(dependencyTargetId) ?? null
  }

  if (dependencyType === 'user') {
    return userNames.get(dependencyTargetId) ?? dependencyTargetId
  }

  if (dependencyType === 'team') {
    return teamNames.get(dependencyTargetId) ?? dependencyTargetId
  }

  return dependencyTargetId
}

function getActivityValueLabel(
  value: { kind: string; label: string; id: string | null } | null,
): string | null {
  if (!value) {
    return null
  }

  return value.label
}

async function loadIssueDetailData(issueId: IssueId): Promise<IssueDetailData | null> {
  const [
    issue,
    issues,
    users,
    projects,
    teams,
    labels,
    tags,
    statuses,
    activityEntries,
  ] = await Promise.all([
    issueRepository.getById(issueId),
    issueRepository.list(),
    userRepository.list(),
    projectRepository.list(),
    teamRepository.list(),
    labelRepository.list(),
    tagRepository.list(),
    statusRepository.list(),
    activityHistoryRepository.list(),
  ])

  if (!issue) {
    return null
  }

  const project = projects.find((entry) => entry.id === issue.projectId) ?? null
  const issueTitles = new Map(issues.map((entry) => [entry.id, entry.title]))
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const teamNames = new Map(teams.map((team) => [team.id, team.name]))
  const labelNames = new Map(labels.map((label) => [label.id, label.name]))
  const tagNames = new Map(tags.map((tag) => [tag.id, tag.name]))
  const statusNames = new Map(statuses.map((status) => [status.id, status.name]))
  const issueActivity = activityEntries
    .filter((entry) => entry.issueId === issue.id)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .map((entry) => ({
      id: entry.id,
      actionLabel: ACTIVITY_ACTION_LABELS[entry.actionType],
      actorName: userNames.get(entry.actorId) ?? 'Unknown actor',
      oldValueLabel: getActivityValueLabel(entry.oldValue),
      newValueLabel: getActivityValueLabel(entry.newValue),
      createdAt: entry.createdAt,
    }))

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    projectId: issue.projectId,
    projectName: project?.name ?? 'Unknown project',
    teamName: teamNames.get(issue.teamId) ?? 'Unknown team',
    typeLabel: ISSUE_TYPE_LABELS[issue.type],
    statusLabel: statusNames.get(issue.statusId) ?? STATUS_LABELS[issue.statusId],
    priorityLabel: PRIORITY_LABELS[issue.priority],
    ownerName: userNames.get(issue.ownerId) ?? 'Unknown owner',
    curatorName: issue.curatorId ? (userNames.get(issue.curatorId) ?? 'Unknown curator') : null,
    createdByName: userNames.get(issue.createdBy) ?? 'Unknown creator',
    updatedByName: userNames.get(issue.updatedBy) ?? 'Unknown updater',
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    completedAt: issue.completedAt,
    confirmedAt: issue.confirmedAt,
    confirmedByName: issue.confirmedBy
      ? (userNames.get(issue.confirmedBy) ?? 'Unknown confirmer')
      : null,
    confirmationRequired: issue.confirmationRequired,
    dependencyLabel: DEPENDENCY_TYPE_LABELS[issue.dependencyType],
    dependencyTargetLabel: resolveDependencyTargetLabel({
      dependencyType: issue.dependencyType,
      dependencyTargetId: issue.dependencyTargetId,
      issueTitles,
      userNames,
      teamNames,
    }),
    tagNames: issue.tagIds
      .map((tagId) => tagNames.get(tagId))
      .filter((tagName): tagName is string => Boolean(tagName)),
    labelNames: issue.labelIds
      .map((labelId) => labelNames.get(labelId))
      .filter((labelName): labelName is string => Boolean(labelName)),
    participantNames: issue.participantIds
      .map((participantId) => userNames.get(participantId))
      .filter((participantName): participantName is string => Boolean(participantName)),
    activity: issueActivity,
  }
}

export function useIssueDetailView(issueId: IssueId | null): IssueDetailViewState {
  const [state, setState] = useState<IssueDetailViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!issueId) {
      setState({
        status: 'missing',
        message: 'Issue detail cannot load without a valid issue id.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadIssueDetailData(issueId)
      .then((data) => {
        if (!isActive) {
          return
        }

        if (!data) {
          setState({
            status: 'missing',
            message: `No demo issue was found for id "${issueId}".`,
          })
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
            error instanceof Error ? error.message : 'Failed to load issue detail visibility.',
        })
      })

    return () => {
      isActive = false
    }
  }, [issueId])

  return useMemo(() => state, [state])
}
