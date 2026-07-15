import { useEffect, useMemo, useState } from 'react'
import type { ProjectId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { tagRepository } from '../../repositories/tagRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import {
  DEPENDENCY_TYPE_LABELS,
  ISSUE_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../../shared/types'

const NEEDS_UPDATE_LABEL_NAME = 'Needs Update'

export interface ProjectDetailData {
  id: ProjectId
  name: string
  description: string
  statusLabel: string
  ownerName: string
  teamName: string
  updatedAt: string
  latestIssueActivityAt: string | null
  totalIssueCount: number
  activeIssueCount: number
  blockedIssueCount: number
  doneIssueCount: number
  needsUpdateCount: number
  issues: ProjectIssueSummary[]
}

export interface ProjectIssueSummary {
  id: string
  title: string
  description: string
  typeLabel: string
  statusLabel: string
  priorityLabel: string
  ownerName: string
  curatorName: string | null
  updatedByName: string
  updatedAt: string
  dependencyLabel: string
  dependencyTargetLabel: string | null
  confirmationRequired: boolean
  participantNames: string[]
  tagNames: string[]
  labelNames: string[]
}

type ProjectDetailViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing'; message: string }
  | { status: 'ready'; data: ProjectDetailData }

function resolveDependencyTargetLabel(params: {
  dependencyTargetId: string | null
  issueTitles: Map<string, string>
  userNames: Map<string, string>
  teamNames: Map<string, string>
}): string | null {
  const { dependencyTargetId, issueTitles, userNames, teamNames } = params

  if (!dependencyTargetId) {
    return null
  }

  return (
    issueTitles.get(dependencyTargetId) ??
    userNames.get(dependencyTargetId) ??
    teamNames.get(dependencyTargetId) ??
    dependencyTargetId
  )
}

async function loadProjectDetailData(projectId: ProjectId): Promise<ProjectDetailData | null> {
  const [project, projectIssues, users, teams, labels, tags] = await Promise.all([
    projectRepository.getById(projectId),
    issueRepository.listByProjectId(projectId),
    userRepository.list(),
    teamRepository.list(),
    labelRepository.list(),
    tagRepository.list(),
  ])

  if (!project) {
    return null
  }

  const needsUpdateLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const teamNames = new Map(teams.map((team) => [team.id, team.name]))
  const labelNames = new Map(labels.map((label) => [label.id, label.name]))
  const tagNames = new Map(tags.map((tag) => [tag.id, tag.name]))
  const issueTitles = new Map(projectIssues.map((issue) => [issue.id, issue.title]))
  const latestIssueActivityAt =
    [...projectIssues]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))[0]
      ?.updatedAt ?? null
  const issueSummaries = [...projectIssues]
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      typeLabel: ISSUE_TYPE_LABELS[issue.type],
      statusLabel: STATUS_LABELS[issue.statusId],
      priorityLabel: PRIORITY_LABELS[issue.priority],
      ownerName: userNames.get(issue.ownerId) ?? 'Unknown owner',
      curatorName: issue.curatorId ? (userNames.get(issue.curatorId) ?? 'Unknown curator') : null,
      updatedByName: userNames.get(issue.updatedBy) ?? 'Unknown updater',
      updatedAt: issue.updatedAt,
      dependencyLabel: DEPENDENCY_TYPE_LABELS[issue.dependencyType],
      dependencyTargetLabel: resolveDependencyTargetLabel({
        dependencyTargetId: issue.dependencyTargetId,
        issueTitles,
        userNames,
        teamNames,
      }),
      confirmationRequired: issue.confirmationRequired,
      participantNames: issue.participantIds
        .map((participantId) => userNames.get(participantId))
        .filter((participantName): participantName is string => Boolean(participantName)),
      tagNames: issue.tagIds
        .map((tagId) => tagNames.get(tagId))
        .filter((tagName): tagName is string => Boolean(tagName)),
      labelNames: issue.labelIds
        .map((labelId) => labelNames.get(labelId))
        .filter((labelName): labelName is string => Boolean(labelName)),
    }))

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    statusLabel: STATUS_LABELS[project.status],
    ownerName: userNames.get(project.ownerId) ?? 'Unknown owner',
    teamName: teamNames.get(project.teamId) ?? 'Unknown team',
    updatedAt: project.updatedAt,
    latestIssueActivityAt,
    totalIssueCount: projectIssues.length,
    activeIssueCount: projectIssues.filter(
      (issue) => issue.statusId !== 'done' && issue.statusId !== 'canceled',
    ).length,
    blockedIssueCount: projectIssues.filter(
      (issue) => issue.statusId === 'blocked' || issue.statusId === 'delayed',
    ).length,
    doneIssueCount: projectIssues.filter((issue) => issue.statusId === 'done').length,
    needsUpdateCount: projectIssues.filter((issue) =>
      issue.labelIds.some((labelId) => needsUpdateLabelIds.includes(labelId)),
    ).length,
    issues: issueSummaries,
  }
}

export function useProjectDetailView(projectId: ProjectId | null): ProjectDetailViewState {
  const [state, setState] = useState<ProjectDetailViewState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!projectId) {
      setState({
        status: 'missing',
        message: 'Project detail cannot load without a valid project id.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadProjectDetailData(projectId)
      .then((data) => {
        if (!isActive) {
          return
        }

        if (!data) {
          setState({
            status: 'missing',
            message: `No demo project was found for id "${projectId}".`,
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
            error instanceof Error ? error.message : 'Failed to load project detail visibility.',
        })
      })

    return () => {
      isActive = false
    }
  }, [projectId])

  return useMemo(() => state, [state])
}
