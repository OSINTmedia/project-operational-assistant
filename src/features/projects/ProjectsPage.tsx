import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function ProjectsPage() {
  return (
    <PlaceholderPage
      eyebrow="Project workspace"
      title="Projects"
      description="Placeholder route for project listing, project creation, and project-scoped issue operations."
      highlights={[
        'Project cards or table foundation',
        'Filters by status, owner, priority, and tag',
        'Entry point to project detail and issue creation later',
      ]}
    />
  )
}
