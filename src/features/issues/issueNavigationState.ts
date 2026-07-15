export type IssueReturnSource = 'dashboard' | 'personal' | 'project' | 'teams'

export interface IssueReturnContext {
  source: IssueReturnSource
  label: string
  path: string
  backLabel: string
}

export interface IssueNavigationState {
  issueReturnContext?: IssueReturnContext
}

const VALID_RETURN_SOURCES = new Set<IssueReturnSource>([
  'dashboard',
  'personal',
  'project',
  'teams',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

function isIssueReturnSource(value: unknown): value is IssueReturnSource {
  return typeof value === 'string' && VALID_RETURN_SOURCES.has(value as IssueReturnSource)
}

export function createIssueNavigationState(
  issueReturnContext: IssueReturnContext,
): IssueNavigationState {
  return { issueReturnContext }
}

export function getIssueReturnContext(state: unknown): IssueReturnContext | null {
  if (!isRecord(state) || !isRecord(state.issueReturnContext)) {
    return null
  }

  const context = state.issueReturnContext

  if (
    !isIssueReturnSource(context.source) ||
    typeof context.label !== 'string' ||
    !isValidInternalPath(context.path) ||
    typeof context.backLabel !== 'string'
  ) {
    return null
  }

  return {
    source: context.source,
    label: context.label,
    path: context.path,
    backLabel: context.backLabel,
  }
}

