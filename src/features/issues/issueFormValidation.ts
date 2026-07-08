import type { DependencyTypeId, IssueTypeId } from '../../shared/types'

export interface IssueFormBlockingStateInput {
  mode: 'create' | 'edit'
  title: string
  selectedProjectId: string
  selectedStatusId: string
  selectedOwnerId: string
  type: IssueTypeId
  selectedCuratorId: string
  dependencyType: DependencyTypeId
  selectedDependencyTargetId: string
  projectOptionCount: number
  statusOptionCount: number
  ownerOptionCount: number
  curatorOptionCount: number
  dependencyTargetOptionCount: number
  currentProjectAvailable: boolean
}

function getModeLabel(mode: 'create' | 'edit'): string {
  return mode === 'create' ? 'Issue creation' : 'Issue editing'
}

export function getIssueFormBlockingMessage(
  input: IssueFormBlockingStateInput,
): string | null {
  const modeLabel = getModeLabel(input.mode)

  if (input.projectOptionCount === 0) {
    return `${modeLabel} is unavailable until demo projects are loaded.`
  }

  if (input.statusOptionCount === 0) {
    return `${modeLabel} is unavailable until demo statuses are loaded.`
  }

  if (input.ownerOptionCount === 0) {
    return `${modeLabel} is unavailable until demo users are loaded.`
  }

  if (input.selectedProjectId && !input.currentProjectAvailable) {
    return 'The selected project is no longer available in current demo data.'
  }

  if (!input.title.trim()) {
    return 'Issue title is required.'
  }

  if (!input.selectedProjectId) {
    return 'A valid project is required.'
  }

  if (!input.selectedStatusId) {
    return 'Status is required.'
  }

  if (!input.selectedOwnerId) {
    return 'Owner is required.'
  }

  if (input.type === 'group' && input.curatorOptionCount === 0) {
    return 'Group issues require at least one available curator.'
  }

  if (input.type === 'group' && !input.selectedCuratorId) {
    return 'Group issues require a curator.'
  }

  if (input.dependencyType !== 'none' && input.dependencyTargetOptionCount === 0) {
    return 'The selected project has no available dependency targets yet.'
  }

  if (input.dependencyType !== 'none' && !input.selectedDependencyTargetId) {
    return 'A dependency target is required when a dependency is selected.'
  }

  return null
}
