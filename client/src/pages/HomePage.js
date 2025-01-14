import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 400) {
          throw new Error('Wrong Login Credentials');
        }
        throw new Error('Login error');
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem('token', data.token); // Store the token
        if (data.user.admin) {
          navigate('/account-management');
        } else {
          navigate('/marketplace');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };

  return (
    <div className="form-container">  
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button type="submit">Login</button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Don’t have an account?{' '}
        <span style={{ color: 'blue', cursor: 'pointer' }}
        onClick={() => navigate('/register')}>Register</span>
      </p>
      <p>
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate('/reset-password')}
        >
          Forgot Password?
        </span>
      </p>
    </div>
  );
}

export default HomePage;