import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import BusRoutes from './pages/BusRoutes';
import AboutUs from './pages/AboutUs';

import StudentDashboard from './features/dashboard/StudentDashboard';
import DriverDashboard from './features/dashboard/DriverDashboard';
import AdminDashboard from './features/dashboard/AdminDashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import AdminAttendance from './pages/AdminAttendance';
import VerifyAttendance from './pages/VerifyAttendance';
import ScannerLogin from './pages/ScannerLogin';
import Scanner from './pages/Scanner';
import { useAuthStore } from './store/authStore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="routes" element={<BusRoutes />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="attendance" element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          } />
          <Route path="verify" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'driver']}>
              <VerifyAttendance />
            </ProtectedRoute>
          } />

          <Route path="dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="driver-dashboard" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/attendance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAttendance />
            </ProtectedRoute>
          } />

        </Route>
        <Route path="/scanner/login" element={<ScannerLogin />} />
        <Route path="/scanner" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <Scanner />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
