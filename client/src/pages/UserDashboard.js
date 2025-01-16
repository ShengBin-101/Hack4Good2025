import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [vouchers, setVouchers] = useState(0);
  const [goal, setGoal] = useState(0);
  const [taskCategories, setTaskCategories] = useState([]);
  const [quests, setQuests] = useState([]);
  const [pendingQuestIds, setPendingQuestIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    // Fetch user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setProfilePicture(user.profilePicture);
      setVouchers(user.vouchers);
      setGoal(user.goal || 0);
    } else {
      setVouchers(0);
    }

    // Fetch task categories and quests
    fetchTaskCategories();
    fetchQuests();
    fetchPendingQuestSubmissions();
  }, []);

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

  const fetchQuests = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/quests', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setQuests(data.filter(quest => quest.status === 'available')))
      .catch((err) => console.error('Error fetching quests:', err));
  };

  const fetchPendingQuestSubmissions = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/quest-submissions/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setPendingQuestIds(data.filter(submission => submission.status === 'pending').map(submission => submission.questId._id)))
      .catch((err) => console.error('Error fetching pending quest submissions:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleTaskClick = (category) => {
    navigate('/task-submission', { state: { selectedCategory: category } });
  };

  const handleQuestClick = (quest) => {
    navigate('/quest-submission', { state: { selectedQuest: quest } });
  };

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <h1>User Dashboard</h1>
        <button className="nav-button" onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
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
                  onClick={() => handleTaskClick(category)}
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
      <div className="available-quests-section">
        <h2>Available Quests</h2>
        <div className="quests-list-container">
          {quests.length > 0 ? (
            <ul className="quests-list">
              {quests.filter(quest => !pendingQuestIds.includes(quest._id)).map((quest) => (
                <li
                  key={quest._id}
                  className="quest-item"
                  onClick={() => handleQuestClick(quest)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{quest.name}</h3>
                  <p>{quest.description}</p>
                  <p>Voucher Value: {quest.voucherValue}</p>
                  <p>Cooldown: {quest.cooldown} minutes</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No quests available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
