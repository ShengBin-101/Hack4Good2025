import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminTaskManagement.css';

const AdminTaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const fetchAllTasks = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/tasks', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error(err));
    };

    const handleApproveTask = (taskId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/tasks/${taskId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ approval: true }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                fetchAllTasks(); // Refresh the task list
            })
            .catch((err) => console.error(err));
    };

    const handleRejectTask = (taskId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                fetchAllTasks(); // Refresh the task list
            })
            .catch((err) => console.error(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="admin-task-management">
            <header className="admin-header">
                <h1>Task Management</h1>
                <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <main className="admin-task-main">
                <section className="tasks-section">
                    <h2>Pending Tasks</h2>
                    <ul className="task-list">
                        {tasks.filter(task => task.status === 'pending').map((task) => (
                            <li key={task._id} className="task-item">
                                <div className="task-info">
                                    <h3>{task.taskDescription}</h3>
                                    <p>Voucher Request: {task.voucherRequest}</p>
                                    <p>Date Completed: {new Date(task.dateCompleted).toLocaleDateString()}</p>
                                    <p>Status: {task.status}</p>
                                    {task.taskPicturePath && (
                                        <img src={`http://localhost:3001/assets/${task.taskPicturePath}`} alt="Task Proof" className="task-picture" />
                                    )}
                                </div>
                                <div className="task-actions">
                                    <button className="approve-button" onClick={() => handleApproveTask(task._id)}>Approve</button>
                                    <button className="reject-button" onClick={() => handleRejectTask(task._id)}>Reject</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default AdminTaskManagement;