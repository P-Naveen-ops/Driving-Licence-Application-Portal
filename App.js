import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage           from './pages/HomePage';
import LoginPage          from './pages/LoginPage';
import SignUpPage         from './pages/SignUpPage';
import DashboardPage      from './pages/DashboardPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import EligibilityPage    from './pages/EligibilityPage';
import TestSchedulerPage  from './pages/TestSchedulerPage';
import FeePaymentPage     from './pages/FeePaymentPage';
import SlotBookingPage    from './pages/SlotBookingPage';
import StatusTrackPage    from './pages/StatusTrackPage';
import CertificatePage    from './pages/CertificatePage';
import NotificationsPage  from './pages/NotificationsPage';
import AdminPanelPage     from './pages/AdminPanelPage';
import ExportPage         from './pages/ExportPage';

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/signup"         element={<SignUpPage />} />
        <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/apply"          element={<ProtectedRoute><ApplicationFormPage /></ProtectedRoute>} />
        <Route path="/eligibility"    element={<ProtectedRoute><EligibilityPage /></ProtectedRoute>} />
        <Route path="/test-scheduler" element={<ProtectedRoute><TestSchedulerPage /></ProtectedRoute>} />
        <Route path="/fee-payment"    element={<ProtectedRoute><FeePaymentPage /></ProtectedRoute>} />
        <Route path="/slot-booking"   element={<ProtectedRoute><SlotBookingPage /></ProtectedRoute>} />
        <Route path="/status"         element={<ProtectedRoute><StatusTrackPage /></ProtectedRoute>} />
        <Route path="/certificate"    element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
        <Route path="/notifications"  element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminPanelPage /></ProtectedRoute>} />
        <Route path="/export"         element={<ProtectedRoute adminOnly><ExportPage /></ProtectedRoute>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast must be inside Router but outside Routes */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
