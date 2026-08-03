import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { PageEditorPage } from './pages/admin/PageEditorPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { FriendJourneyPage } from './pages/friend/FriendJourneyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Secret Friend-Facing Experience Route */}
        <Route path="/:randomId/:friendSlug" element={<FriendJourneyPage />} />

        {/* Admin Public Routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/pages" element={<DashboardPage />} />
          <Route path="/admin/pages/:id/edit" element={<PageEditorPage />} />
          <Route path="/admin/pages/:id/analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Default Fallbacks */}
        <Route path="/admin" element={<Navigate to="/admin/pages" replace />} />
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
