import { useEffect, useMemo, useState } from 'react'
import type { IssueId, LabelId, TagId, UserId } from '../../entities'
import { issueRepository } from '../../repositories/issueRepository'
import { labelRepository } from '../../repositories/labelRepository'
import {
  loadIssueCreateFormShellData,
  type IssueCreateFormShellData,
} from './useIssueCreateFormShell'

export interface IssueEditFormPrefillData extends IssueCreateFormShellData {
  issueId: IssueId
  title: string
  description: string
  type: 'individual' | 'group'
  priority: 'low' | 'medium' | 'high' | 'critical'
  projectId: string
  statusId: string
  ownerId: UserId
  curatorId: UserId | null
  tagIds: TagId[]
  labelIds: LabelId[]
  dependencyType: 'none' | 'user' | 'team' | 'client-representative' | 'external-representative' | 'unknown'
  dependencyTargetId: string | null
  readonlySystemLabelNames: string[]
}

type IssueEditFormPrefillState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing'; message: string }
  | { status: 'ready'; data: IssueEditFormPrefillData }

async function loadIssueEditFormPrefillData(params: {
  issueId: IssueId
  currentUserId: UserId | null
  currentUserName: string | null
}): Promise<IssueEditFormPrefillData | null> {
  const { issueId, currentUserId, currentUserName } = params
  const issue = await issueRepository.getById(issueId)

  if (!issue) {
    return null
  }

  const [formShellData, labels] = await Promise.all([
    loadIssueCreateFormShellData(issue.projectId, currentUserId, currentUserName),
    labelRepository.list(),
  ])

  const editableLabelIds = new Set(formShellData.labelOptions.map((label) => label.id))
  const systemLabelNames = new Map(
    labels
      .filter((label) => label.type === 'system')
      .map((label) => [label.id, label.name]),
  )

  return {
    ...formShellData,
    issueId: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    priority: issue.priority,
    projectId: issue.projectId,
    statusId: issue.statusId,
    ownerId: issue.ownerId,
    curatorId: issue.curatorId,
    tagIds: issue.tagIds,
    labelIds: issue.labelIds.filter((labelId) => editableLabelIds.has(labelId)),
    dependencyType: issue.dependencyType,
    dependencyTargetId: issue.dependencyTargetId,
    readonlySystemLabelNames: issue.labelIds
      .map((labelId) => systemLabelNames.get(labelId))
      .filter((labelName): labelName is string => Boolean(labelName)),
  }
}

export function useIssueEditFormPrefill(params: {
  issueId: IssueId | null
  currentUserId: UserId | null
  currentUserName: string | null
}): IssueEditFormPrefillState {
  const { issueId, currentUserId, currentUserName } = params
  const [state, setState] = useState<IssueEditFormPrefillState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!issueId) {
      setState({
        status: 'missing',
        message: 'Issue edit cannot load without a valid issue id.',
      })
      return
    }

    setState({ status: 'loading' })

    void loadIssueEditFormPrefillData({
      issueId,
      currentUserId,
      currentUserName,
    })
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
            error instanceof Error ? error.message : 'Failed to load issue-edit prefill data.',
        })
      })

    return () => {
      isActive = false
    }
  }, [currentUserId, currentUserName, issueId])

  return useMemo(() => state, [state])
}
