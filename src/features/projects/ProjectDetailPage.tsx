import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function ProjectDetailPage() {
  const { projectId } = useParams()

  return (
    <PlaceholderPage
      eyebrow="Project detail"
      title={`Project ${projectId ?? 'placeholder'}`}
      description="Placeholder route for project status summary, issue list, and project-level operational context."
      highlights={[
        'Issue table with filters and quick actions',
        'Project progress and team info',
        'Create issue entry point for later implementation',
      ]}
    />
  )
}
