import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, SupabaseStatusWidget } from './components/shared/Shared';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { CustomerHome } from './components/customer/CustomerHome';
import { ProviderProfileView } from './components/customer/ProviderProfile';
import { CustomerBookings } from './components/customer/CustomerBookings';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { ProviderDashboard, ProviderProfilePage } from './components/provider/ProviderPages';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Role mismatch, redirect back to default home of current role
    if (currentUser.role === 'provider') return <Navigate to="/provider-dashboard" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function RoleHomeRedirect() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/signup" replace />;
  }

  if (currentUser.role === 'provider') {
    return <Navigate to="/provider-dashboard" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/home" replace />;
}

function MainLayout() {
  const { currentUser } = useApp();
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between">
      <div>
        {currentUser && <Navbar />}
        <Routes>
          <Route path="/" element={<RoleHomeRedirect />} />
          
          {/* CUSTOMER DIRECTORY DECISION PATHS */}
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerHome />
            </ProtectedRoute>
          } />
          
          <Route path="/provider/:id" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ProviderProfileView />
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProfile />
            </ProtectedRoute>
          } />

          {/* PROVIDER EXECUTIVE DASHBOARDS */}
          <Route path="/provider-dashboard" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/provider-bookings" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/provider-profile" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderProfilePage />
            </ProtectedRoute>
          } />

          {/* ADMIN OVERVIEW CONTROLS */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          } />

          {/* COMBINED CROSS-SERVICE-PROVIDER REAL-TIME CHATS */}
          <Route path="/chat/:convId/:otherId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      {/* Modern, high contrast subtle footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-400 font-medium">
        <div>🏠 HomeEase Service Providers &copy; 2026 &bull; Secure utility services hub &bull; Bengaluru, India</div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <SupabaseStatusWidget />
        <Routes>
          {/* Public authentication paths */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Main dynamic paths with navbar wrapper */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
