import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Reset password error');
      })
      .then((data) => {
        setMessage('Password reset link sent to your email');
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setMessage('');
      });
  };

  return (
    <div>
      <div className="form-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        <div className="button-container">
          <button type="submit">Reset Password</button>
          <button type="button" onClick={() => navigate('/')}>Back to Login</button>
        </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;