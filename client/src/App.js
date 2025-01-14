import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountManagement from './pages/AccountManagement';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Router>
            <Routes>
                <Route path="/" element={user && user.admin ? <Navigate to="/account-management" /> : <HomePage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Route for Admins Only */}
                <Route
                    path="/account-management"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <AccountManagement />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;