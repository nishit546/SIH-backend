import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SubmitReportPage } from './pages/SubmitReportPage';
import { ReportsListPage } from './pages/ReportsListPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { PatternsPage } from './pages/PatternsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { FitTestPage } from './pages/FitTestPage';
import { PricingPage } from './pages/PricingPage';
import { SecurityPage } from './pages/SecurityPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing, Info & Login Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/fit-test" element={<FitTestPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Application Workspace */}
          <Route element={<MainLayout />}>
            {/* Dashboard: Accessible to HSE Analysts and Admins */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HSE_ANALYST', 'ANALYST', 'MANAGER']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Reports List: Accessible to all authenticated roles */}
            <Route
              path="reports"
              element={
                <ProtectedRoute>
                  <ReportsListPage />
                </ProtectedRoute>
              }
            />

            {/* Submit Observation: Accessible to all authenticated roles */}
            <Route
              path="reports/new"
              element={
                <ProtectedRoute>
                  <SubmitReportPage />
                </ProtectedRoute>
              }
            />

            {/* Report Details: Accessible to all authenticated roles */}
            <Route
              path="reports/:id"
              element={
                <ProtectedRoute>
                  <ReportDetailPage />
                </ProtectedRoute>
              }
            />

            {/* AI Analysis View: Accessible to HSE Analysts and Admins */}
            <Route
              path="reports/:id/analysis"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HSE_ANALYST', 'ANALYST', 'MANAGER']}>
                  <AnalysisResultPage />
                </ProtectedRoute>
              }
            />

            {/* Emerging Safety Patterns: Accessible to HSE Analysts and Admins */}
            <Route
              path="patterns"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HSE_ANALYST', 'ANALYST', 'MANAGER']}>
                  <PatternsPage />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
