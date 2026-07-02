import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function IssueDetailPage() {
  const { issueId } = useParams()

  return (
    <PlaceholderPage
      eyebrow="Issue detail"
      title={`Issue ${issueId ?? 'placeholder'}`}
      description="Reserved for structured issue detail, quick actions, and activity history."
      highlights={[
        'Owner, Curator, Status, Priority, Tags, and Labels',
        'Dependency and activity history region',
        'Future quick actions for status, owner, and confirmation',
      ]}
    />
  )
}
