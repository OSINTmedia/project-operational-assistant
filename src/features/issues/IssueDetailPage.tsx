import { Link, useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function IssueDetailPage() {
  const { issueId } = useParams()

  return (
    <section className="grid gap-4">
      {issueId ? (
        <div className="flex justify-end">
          <Link
            to={`/issues/${issueId}/edit`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            Edit issue shell
          </Link>
        </div>
      ) : null}

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
    </section>
  )
}
