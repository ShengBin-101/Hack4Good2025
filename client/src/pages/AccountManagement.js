import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountManagement.css';

const AccountManagement = () => {
    const [activeTab, setActiveTab] = useState('pending'); // State to manage active tab
    const [viewMode, setViewMode] = useState('users'); // State to manage view mode
    const [pendingUsers, setPendingUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [userPicturePath, setUserPicturePath] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPendingUsers = () => {
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
    };

    const fetchExistingUsers = () => {
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
    };

    useEffect(() => {
        fetchPendingUsers();
        fetchExistingUsers();
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
                fetchPendingUsers();
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
                fetchPendingUsers();
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

    const handleRegisterAdmin = () => {
        setViewMode('register');
    };

    const handleRegister = (e) => {
        e.preventDefault();

        // Validate input fields
        if (!name || !email || !birthday || !password) {
            setError('All fields except Profile Picture URL are required.');
            return;
        }

        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/auth/register-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                birthday,
                password,
                userPicturePath,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        throw new Error(data.msg || 'Registration error');
                    });
                }
                return res.json();
            })
            .then((data) => {
                setMessage('Admin registered successfully');
                setError('');
                setViewMode('users');
                fetchExistingUsers();
            })
            .catch((err) => {
                setError(err.message);
                setMessage('');
            });
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
                <button
                    className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('pending');
                        setViewMode('users');
                    }}
                >
                    Users Waiting for Approval
                </button>
                <button
                    className={`tab-button ${activeTab === 'existing' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('existing');
                        setViewMode('users');
                    }}
                >
                    Existing Users
                </button>
                <button className="register-admin-button" onClick={handleRegisterAdmin}>Register Admin</button>
            </div>
            {viewMode === 'users' && activeTab === 'pending' && (
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
            {viewMode === 'users' && activeTab === 'existing' && (
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
            {viewMode === 'register' && (
                <div className="form-container">
                    <h1>Register Admin</h1>
                    <form onSubmit={handleRegister}>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Birthday:</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Profile Picture URL (Optional):</label>
                        <input
                            type="text"
                            value={userPicturePath}
                            onChange={(e) => setUserPicturePath(e.target.value)}
                        />
                        <div className="button-container">
                            <button type="submit">Register</button>
                        </div>
                        {message && <p className="message">{message}</p>}
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default AccountManagement;