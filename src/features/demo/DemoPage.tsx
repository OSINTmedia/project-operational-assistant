import { PlaceholderPage } from '../../shared/components/PlaceholderPage'

export function DemoPage() {
  return (
    <PlaceholderPage
      eyebrow="Demo controls"
      title="Demo"
      description="Placeholder area for seeded demo accounts, reset controls, and short product guidance."
      highlights={[
        'Demo role switching controls',
        'Reset and seed data actions',
        'Short contextual explanation for portfolio visitors',
      ]}
    />
  )
}
