import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function PersonalPage() {
  return (
    <PlaceholderPage
      eyebrow="My work surface"
      title="Personal"
      description="Placeholder view for assigned issues, curated issues, and personal attention signals."
      highlights={[
        'Assigned to me and Created by me sections',
        'Needs Update and confirmation-required views',
        'Fast operational updates without navigation clutter',
      ]}
    />
  )
}
