import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountManagement.css';

const AccountManagement = () => {
    const [activeTab, setActiveTab] = useState('pending'); // State to manage active tab
    const [pendingUsers, setPendingUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/admin/existing', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching existing users');
                }
                return res.json();
            })
            .then((data) => {
                setExistingUsers(data);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleApprove = (userId) => {
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

    const handleDelete = (userId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/admin/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error deleting user');
                setExistingUsers((prev) => prev.filter((user) => user._id !== userId));
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
            <div className="tabs">
                <button className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Users Waiting for Approval</button>
                <button className={`tab-button ${activeTab === 'existing' ? 'active' : ''}`} onClick={() => setActiveTab('existing')}>Existing Users</button>
            </div>
            {activeTab === 'pending' && (
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
            )}
            {activeTab === 'existing' && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {existingUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AccountManagement;
