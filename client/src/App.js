import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountManagement from './pages/AccountManagement';
import ResetPassword from './pages/ResetPassword';
import Marketplace from './pages/Marketplace';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </Router>
  );
};

export default App;