import React, { useEffect, useState } from 'react';
import '../styles/AccountManagement.css';

const AccountManagement = () => {
    const [pendingUsers, setPendingUsers] = useState([]);

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

    return (
        <div className="account-management">
            <h1>Account Management</h1>
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
                                <button onClick={() => handleApprove(user._id)}>Approve</button>
                                <button onClick={() => handleReject(user._id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AccountManagement;