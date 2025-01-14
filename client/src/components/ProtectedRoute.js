import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }

    console.log('ProtectedRoute - Token:', token);
    console.log('ProtectedRoute - User:', user);

    if (!token || !user) {
        return <Navigate to="/" />;
    }

    if (adminOnly && !user.admin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;