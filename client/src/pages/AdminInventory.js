import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminInventory = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }

  return (
    <div>
        <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <h1>Admin Inventory</h1>
      <p>View existing listings on the minimart here.</p>
      {/* Add list of listings */}
    </div>
    );
};

export default AdminInventory;