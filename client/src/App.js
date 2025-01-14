import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountManagement from './pages/AccountManagement';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
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