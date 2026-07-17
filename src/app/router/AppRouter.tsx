import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '../../features/dashboard/DashboardPage'
import { DemoPage } from '../../features/demo/DemoPage'
import { IssueCreatePage } from '../../features/issues/IssueCreatePage'
import { IssueDetailPage } from '../../features/issues/IssueDetailPage'
import { IssueEditPage } from '../../features/issues/IssueEditPage'
import { PersonalPage } from '../../features/personal/PersonalPage'
import { ProjectCreatePage } from '../../features/projects/ProjectCreatePage'
import { ProjectDetailPage } from '../../features/projects/ProjectDetailPage'
import { ProjectEditPage } from '../../features/projects/ProjectEditPage'
import { ProjectsPage } from '../../features/projects/ProjectsPage'
import { TeamsPage } from '../../features/teams/TeamsPage'
import { AppShell } from '../layout/AppShell'

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectCreatePage />} />
          <Route path="/projects/:projectId/edit" element={<ProjectEditPage />} />
          <Route path="/projects/:projectId/issues/new" element={<IssueCreatePage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/issues/:issueId/edit" element={<IssueEditPage />} />
          <Route path="/issues/:issueId" element={<IssueDetailPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
