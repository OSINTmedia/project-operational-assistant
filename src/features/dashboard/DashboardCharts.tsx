import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardDistributions, DashboardDistributionItem } from '../../domain/dashboardMetrics'

const STATUS_CHART_COLORS = ['#0f766e', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b']
const PRIORITY_CHART_COLORS = ['#0f766e', '#14b8a6', '#f59e0b', '#ef4444']
const PROJECT_CHART_COLOR = '#0f766e'

interface ChartPanelProps {
  title: string
  description: string
  children: ReactNode
}

function ChartPanel({ title, description, children }: ChartPanelProps) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
      <div>
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="mt-4 h-64 sm:h-72">{children}</div>
    </article>
  )
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}

function DistributionTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value?: number; payload?: DashboardDistributionItem }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]?.payload

  if (!item) {
    return null
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-panel">
      <p className="text-sm font-medium text-slate-950">{item.label}</p>
      <p className="mt-1 text-sm text-slate-600">{item.count} issues</p>
    </div>
  )
}

function renderPieLabel({
  name,
  percent,
}: {
  name?: string
  percent?: number
}) {
  if (!name || percent === undefined || percent < 0.08) {
    return ''
  }

  return `${name} ${Math.round(percent * 100)}%`
}

function truncateChartLabel(value: string, maxLength = 14): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value
}

export function DashboardCharts({ distributions }: { distributions: DashboardDistributions }) {
  const statusData = distributions.issuesByStatus
  const priorityData = distributions.issuesByPriority
  const projectData = distributions.issuesByProject

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[1.2fr_1fr]">
      <ChartPanel
        title="Issues by status"
        description="Current operational spread across the status model, kept readable rather than decorative."
      >
        {statusData.length === 0 ? (
          <EmptyChartState message="No status distribution is available yet." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#475569', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => truncateChartLabel(value, 12)}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip content={<DistributionTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={STATUS_CHART_COLORS[index % STATUS_CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartPanel>

      <ChartPanel
        title="Issues by priority"
        description="A compact view of urgency, so the portfolio dashboard stays operational instead of score-driven."
      >
        {priorityData.length === 0 ? (
          <EmptyChartState message="No priority distribution is available yet." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="count"
                nameKey="label"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
                labelLine={false}
                label={renderPieLabel}
              >
                {priorityData.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={PRIORITY_CHART_COLORS[index % PRIORITY_CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<DistributionTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartPanel>

      <ChartPanel
        title="Issues by project"
        description="Project concentration stays visible without turning the dashboard into a broad report-builder surface."
      >
        {projectData.length === 0 ? (
          <EmptyChartState message="No project distribution is available yet." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectData}
              layout="vertical"
              margin={{ top: 8, right: 12, bottom: 0, left: 12 }}
            >
              <CartesianGrid horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="label"
                type="category"
                width={96}
                tick={{ fill: '#475569', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => truncateChartLabel(value, 13)}
              />
              <Tooltip content={<DistributionTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill={PROJECT_CHART_COLOR} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartPanel>
    </div>
  )
}
