import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardShell } from '@/components/layout/DashboardShell'

// Public Pages
import { HomePage } from '@/pages/public/HomePage'
import { ServicesPage } from '@/pages/public/ServicesPage'
import { ServiceDetailPage } from '@/pages/public/ServiceDetailPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { AnnouncementsPage } from '@/pages/public/AnnouncementsPage'
import { ReportPage } from '@/pages/public/ReportPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

// Auth & Citizen Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { CitizenComplaintsPage } from '@/pages/citizen/ComplaintsPage'
import { CitizenComplaintDetailPage } from '@/pages/citizen/ComplaintDetailPage'

// Municipal Dashboard Pages
import { OverviewPage } from '@/pages/dashboard/OverviewPage'
import { MapPage } from '@/pages/dashboard/MapPage'
import { AssetsPage } from '@/pages/dashboard/AssetsPage'
import { AssetDetailPage } from '@/pages/dashboard/AssetDetailPage'
import { SemanticAnalysisPage } from '@/pages/dashboard/SemanticAnalysisPage'
import { ImageIntelligencePage } from '@/pages/dashboard/ImageIntelligencePage'
import { RecurringIncidentsPage } from '@/pages/dashboard/RecurringIncidentsPage'
import { ClusterDetailPage } from '@/pages/dashboard/ClusterDetailPage'
import { PredictiveMaintenancePage } from '@/pages/dashboard/PredictiveMaintenancePage'
import { MaintenancePage } from '@/pages/dashboard/MaintenancePage'
import { DataPipelinePage } from '@/pages/dashboard/DataPipelinePage'
import { DataQualityPage } from '@/pages/dashboard/DataQualityPage'
import { ReportsPage } from '@/pages/dashboard/ReportsPage'

export const router = createBrowserRouter([
  // Public Experience
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:serviceId', element: <ServiceDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'report', element: <ReportPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'citizen/complaints', element: <CitizenComplaintsPage /> },
      { path: 'citizen/complaints/:complaintId', element: <CitizenComplaintDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // Municipal Intelligence Dashboard
  {
    path: '/dashboard',
    element: <DashboardShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'assets', element: <AssetsPage /> },
      { path: 'assets/:assetId', element: <AssetDetailPage /> },
      { path: 'semantic-analysis', element: <SemanticAnalysisPage /> },
      { path: 'image-intelligence', element: <ImageIntelligencePage /> },
      { path: 'recurring-incidents', element: <RecurringIncidentsPage /> },
      { path: 'recurring-incidents/:clusterId', element: <ClusterDetailPage /> },
      { path: 'predictive-maintenance', element: <PredictiveMaintenancePage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'data-pipeline', element: <Navigate to="/dashboard" replace /> },
      { path: 'data-quality', element: <DataQualityPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
})
