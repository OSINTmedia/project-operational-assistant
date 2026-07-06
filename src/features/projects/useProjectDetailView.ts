import { useEffect, useMemo, useState } from 'react'
import type { ProjectId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import { projectRepository } from '../../repositories/projectRepository'
import { teamRepository } from '../../repositories/teamRepository'
import { userRepository } from '../../repositories/userRepository'
import { STATUS_LABELS } from '../../shared/types'

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
}

type ProjectDetailViewState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing'; message: string }
  | { status: 'ready'; data: ProjectDetailData }

async function loadProjectDetailData(projectId: ProjectId): Promise<ProjectDetailData | null> {
  const [project, projectIssues, users, teams, labels] = await Promise.all([
    projectRepository.getById(projectId),
    issueRepository.listByProjectId(projectId),
    userRepository.list(),
    teamRepository.list(),
    labelRepository.list(),
  ])

  if (!project) {
    return null
  }

  const needsUpdateLabelIds = labels
    .filter((label) => label.type === 'system' && label.name === NEEDS_UPDATE_LABEL_NAME)
    .map((label) => label.id)
  const userNames = new Map(users.map((user) => [user.id, user.name]))
  const teamNames = new Map(teams.map((team) => [team.id, team.name]))
  const latestIssueActivityAt =
    [...projectIssues]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))[0]
      ?.updatedAt ?? null

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
