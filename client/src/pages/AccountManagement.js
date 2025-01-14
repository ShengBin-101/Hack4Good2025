import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountManagement.css';

const AccountManagement = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch pending users
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        fetch('http://localhost:3001/admin/pending', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching pending users');
                }
                return res.json();
            })
            .then((data) => {
                setPendingUsers(data);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleApprove = (userId) => {
        // Approve user
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/admin/approve/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error approving user');
                setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
            })
            .catch((err) => console.error(err));
    };

    const handleReject = (userId) => {
        // Reject user
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/admin/reject/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error rejecting user');
                setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
            })
            .catch((err) => console.error(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="account-management">
            <header className="admin-header">
                <h1>Account Management</h1>
                <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="approve-button" onClick={() => handleApprove(user._id)}>Approve</button>
                                <button className="reject-button" onClick={() => handleReject(user._id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountManagement;