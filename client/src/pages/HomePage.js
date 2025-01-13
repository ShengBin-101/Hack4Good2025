import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/HomePage.css'; 


function HomePage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = (e) => {
        // navigate('/marketplace');
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
          throw new Error('Login error');
        })
        .then((data) => {
          console.log(data);
          navigate('/marketplace');
        })
        .catch((err) => console.error(err));
    };
  
    return (
      <div>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account?{' '}
          <span style={{ color: 'blue', cursor: 'pointer' }}>Register</span>
        </p>
      </div>
    );
  }

export default HomePage;