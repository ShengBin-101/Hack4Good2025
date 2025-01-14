import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [vouchers, setVouchers] = useState(0);
  const [goal, setGoal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data (profile picture and vouchers)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setProfilePicture(user.profilePicture);
      setVouchers(user.vouchers);
      setGoal(user.goal || 0);
    }
    else {
      setVouchers(0);
    }
  }, []);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.value);
    // Save the updated profile picture to local storage or backend
    const user = JSON.parse(localStorage.getItem('user'));
    user.profilePicture = e.target.value;
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };

  const handleSaveGoal = () => {
    // Save the goal to local storage or backend
    const user = JSON.parse(localStorage.getItem('user'));
    user.goal = goal;
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
        <input
          type="text"
          value={profilePicture}
          onChange={handleProfilePictureChange}
          placeholder="Profile Picture URL"
        />
        <p>Vouchers: {vouchers}</p>
      </div>
      <div className="goal-section">
        <h2>Set Your Goal</h2>
        <p>Vouchers needed to reach goal: {goal - vouchers}</p>
        <input
          type="range"
          min="0"
          max="100"
          value={goal}
          onChange={handleGoalChange}
        />
        <p>Goal: {goal} vouchers</p>
        <button onClick={handleSaveGoal}>Save Goal</button>
      </div>
    </div>
  );
};

export default UserDashboard;