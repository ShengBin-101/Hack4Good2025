import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/QuestSubmissionPage.css';

const QuestSubmissionPage = () => {
    const [proofImage, setProofImage] = useState(null);
    const [questSubmissions, setQuestSubmissions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedQuest } = location.state;

    useEffect(() => {
        fetchUserQuestSubmissions();
    }, []);

    const fetchUserQuestSubmissions = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/quest-submissions/${user._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setQuestSubmissions(data))
            .catch((err) => console.error('Error fetching quest submissions:', err));
    };

    const handleProofImageChange = (e) => {
        setProofImage(e.target.files[0]);
    };

    const handleSubmitQuest = (e) => {
        e.preventDefault();
        if (!proofImage) {
            alert('Proof image is required.');
            return;
        }

        const formData = new FormData();
        formData.append('userId', JSON.parse(localStorage.getItem('user'))._id);
        formData.append('questId', selectedQuest._id);
        formData.append('proofImage', proofImage);

        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/quest-submissions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                fetchUserQuestSubmissions(); // Refresh the quest submissions list
            })
            .catch((err) => console.error('Error submitting quest:', err));
    };

    const handleDeleteSubmission = (submissionId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/quest-submissions/pending/${submissionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                fetchUserQuestSubmissions(); // Refresh the quest submissions list
            })
            .catch((err) => console.error('Error deleting quest submission:', err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="quest-submission-page">
            <header className="user-header">
                <h1>Quest Submission</h1>
                <button className="nav-button" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <main className="quest-submission-main">
                <section className="submit-quest-section">
                    <h2>Submit Quest</h2>
                    <form onSubmit={handleSubmitQuest}>
                        <label>Quest Name:</label>
                        <p>{selectedQuest.name}</p>
                        <label>Proof Image:</label>
                        <input type="file" accept="image/*" onChange={handleProofImageChange} />
                        <button type="submit">Submit Quest</button>
                    </form>
                </section>
                <section className="quest-submissions-section">
                    <h2>Your Quest Submissions</h2>
                    <ul className="quest-submission-list">
                        {questSubmissions.map((submission) => (
                            <li key={submission._id} className="quest-submission-item">
                                <div className="quest-submission-info">
                                    <h3>{submission.questId.name}</h3>
                                    <p>Status: {submission.status}</p>
                                    {submission.proofImagePath && (
                                        <img src={`http://localhost:3001/assets/${submission.proofImagePath}`} alt="Quest Proof" className="quest-proof-picture" />
                                    )}
                                </div>
                                {submission.status === 'pending' && (
                                    <button className="delete-button" onClick={() => handleDeleteSubmission(submission._id)}>Delete</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default QuestSubmissionPage;