import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [userPicturePath, setUserPicturePath] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // For now, just send the form data to the server
        fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                birthday,
                password,
                userPicturePath,
                // We'll handle the "approved" status later
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Registration error');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                // After successful request, go back to home or show a message
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className='form-container'>
            <h1>Register</h1>
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
                <label>Profile Picture Path (Optional):</label>
                <input
                    type="text"
                    value={userPicturePath}
                    onChange={(e) => setUserPicturePath(e.target.value)}
                />
                <br />
                <br />                
            </form>
            <div className="button-container">
          <button type="submit">Register</button>
          <button type="button" onClick={() => navigate('/')}>Back to Login</button>
        </div>

        </div>
    );
}

export default RegisterPage;