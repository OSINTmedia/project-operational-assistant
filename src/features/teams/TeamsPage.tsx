import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function TeamsPage() {
  return (
    <PlaceholderPage
      eyebrow="Team workspace"
      title="Team Workspace"
      description="Placeholder route for lightweight team-level visibility without org-management complexity."
      highlights={[
        'Team members and team issue visibility',
        'Blocked, delayed, and needs update counts',
        'Team progress summary for dashboard continuity',
      ]}
    />
  )
}
