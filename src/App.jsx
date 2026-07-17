import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TriageSession from './pages/TriageSession';
import PatientDetail from './pages/PatientDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Analytics from './pages/Analytics';
import EmergencyProtocols from './pages/EmergencyProtocols';
import ExportReport from './pages/ExportReport';
import SOSButton from './components/SOSButton';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        {/* Global floating SOS button - must be inside BrowserRouter for Link to work */}
        <SOSButton />

        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/triage" element={<TriageSession />} />
            <Route path="/patient/:id" element={<PatientDetail />} />
            <Route path="/patient/:id/export" element={<ExportReport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/protocols" element={<EmergencyProtocols />} />

            {/* Backward compatibility route mapping */}
            <Route path="/referral/:id" element={<PatientDetail />} />

            {/* Optional Redirect for old dashboard paths */}
            <Route
              path="/dashboard/referrals"
              element={<Navigate to="/" replace />}
            />
          </Route>

          {/* Public Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
