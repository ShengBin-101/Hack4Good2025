import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [vouchers, setVoucherCount] = useState(0);
  const [goal, setGoal] = useState(0);
  const [taskCategories, setTaskCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      
      setVoucherCount(user.vouchers);
      setGoal(user.goal || 0);
    } else {
      setVoucherCount(0);
    }

    fetchVoucherCountFromLocalStorage();

    setProfilePicture(user.profilePicture);

    fetchTaskCategories();
    fetchUserTransactions();
  }, []);

  const fetchVoucherCountFromLocalStorage = () => {
    const user = localStorage.getItem('user'); // Retrieve user object
    if (user) {
      const parsedUser = JSON.parse(user); // Parse it to JSON
      setVoucherCount(parsedUser.voucher || 0); // Set voucher count, default to 0
    } else {
      setVoucherCount(0); // Default to 0 if no user found
    }
  };

  const fetchTaskCategories = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/task-categories', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setTaskCategories(data))
      .catch((err) => console.error('Error fetching task categories:', err));
  };

  const fetchUserTransactions = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/transactions/user/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error('Error fetching transactions:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleTaskClick = (category) => {
    navigate('/task-submission', { state: { selectedCategory: category } });
  };

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <h1>User Dashboard</h1>
        <button className="nav-button" onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'transactionHistory' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactionHistory')}
        >
          Transaction History
        </button>
      </div>
      {activeTab === 'profile' && (
        <>
          <div className="profile-section">
            <h2>Profile</h2>
            <img src={profilePicture} alt="Profile" className="profile-picture" />
            <p>Vouchers: {vouchers}</p>
          </div>
          <div className="goal-section">
            <h2>Set Your Goal</h2>
            <p>Vouchers needed to reach goal: {Math.max(0, goal - vouchers)}</p>
          </div>
          <div className="available-tasks-section">
            <h2>Available Task Categories</h2>
            <div className="tasks-list-container">
              {taskCategories.length > 0 ? (
                <ul className="tasks-list">
                  {taskCategories.map((category) => (
                    <li
                      key={category._id}
                      className="task-item"
                      onClick={() => handleTaskClick(category)} // Attach click handler
                      style={{ cursor: 'pointer' }}
                    >
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                      <p>Voucher Value: {category.voucherValue}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No task categories available at the moment.</p>
              )}
            </div>
          </div>
        </>
      )}
      {activeTab === 'transactionHistory' && (
        <div className="transaction-history-section">
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            <ul className="transaction-list">
              {transactions.map((transaction) => (
                <li key={transaction._id} className="transaction-item">
                  <p>Product: {transaction.productName}</p>
                  <p>Quantity: {transaction.productQuantity}</p>
                  <p>Date: {transaction.dateTransaction}</p>
                  <p>Time: {transaction.timeTransaction}</p>
                  <p>Vouchers Used: {transaction.voucherTransaction}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;