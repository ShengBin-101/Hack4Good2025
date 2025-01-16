import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountManagement from './pages/AccountManagement';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Marketplace from './pages/Marketplace';
import UserDashboard from './pages/UserDashboard';
import PastRedemptions from './pages/PastRedemptions';
import AdminInventory from './pages/AdminInventory';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyOTPPage from './pages/VerifyOTPPage';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={user && user.admin ? <Navigate to="/admin-dashboard" /> : <HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account-management" element={<ProtectedRoute adminOnly={true}><AccountManagement /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/past-redemptions" element={<ProtectedRoute><PastRedemptions /></ProtectedRoute>} />
        <Route path="/admin-listings" element={<ProtectedRoute adminOnly={true}><AdminInventory /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
      </Routes>
    </Router>
  );
};

export default App;