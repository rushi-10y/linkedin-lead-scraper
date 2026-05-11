import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/auth/Login.jsx';
import RegisterPage from '../pages/auth/Register.jsx';

import Dashboard from '../pages/dashboard/Dashboard.jsx';
import LeadList from '../pages/leads/LeadList.jsx';
import LeadDetails from '../pages/leads/LeadDetails.jsx';
import ImportLeads from '../pages/leads/ImportLeads.jsx';

import CompanyList from '../pages/companies/CompanyList.jsx';

import Reports from '../pages/reports/Reports.jsx';
import ExportData from '../pages/reports/ExportData.jsx';

import Profile from '../pages/settings/Profile.jsx';
import Roles from '../pages/settings/Roles.jsx';
import Users from '../pages/settings/Users.jsx';

import ScrapeJobs from '../pages/scraping/ScrapeJobs.jsx';

import PrivateRoute from './PrivateRoute.jsx';
import AppLayout from '../layout/AppLayout.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Protected + Layout */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Leads */}
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/leads/import" element={<ImportLeads />} />

        {/* Companies */}
        <Route path="/companies" element={<CompanyList />} />

        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/export" element={<ExportData />} />

        {/* Scraping */}
        <Route path="/scraping" element={<Navigate to="/scraping/jobs" />} />
        <Route path="/scraping/jobs" element={<ScrapeJobs />} />
        <Route path="/scraping/keyword" element={<Navigate to="/scraping/jobs" replace />} />
        <Route path="/scraping/linkedin" element={<Navigate to="/scraping/jobs" replace />} />
        <Route path="/scraping/manual" element={<Navigate to="/scraping/jobs" replace />} />

        {/* Settings */}
        <Route path="/settings" element={<Navigate to="/settings/profile" />} />
        <Route path="/settings/profile" element={<Profile />} />
        <Route path="/settings/roles" element={<Roles />} />
        <Route path="/settings/users" element={<Users />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
