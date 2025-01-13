import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/HomePage.css'; 

function HomePage() {
    return (
        <div className="homepage">
            <h1>Welcome to the Home Page</h1>
            <p>This is the home page of our React app.</p>
        </div>
    );
}

export default HomePage;