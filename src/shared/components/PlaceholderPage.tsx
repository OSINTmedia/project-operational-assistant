type PlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
  highlights: string[]
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  highlights,
}: PlaceholderPageProps) {
  return (
    <section className="grid gap-5">
      <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Implementation status</p>
              <p className="mt-1 text-sm text-slate-500">
                Route exists. Product workflow and data logic are intentionally pending.
              </p>
            </div>
            <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
              Foundation only
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel">
          <p className="text-sm font-medium text-slate-900">Next implementation layer</p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600">
            <li>Data model definitions</li>
            <li>Dexie schema and seed/reset flow</li>
            <li>Zustand app state and route-level queries</li>
            <li>Actual tables, forms, and dashboard widgets</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
