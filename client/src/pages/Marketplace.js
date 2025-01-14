import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MarketPlace.css';

const Marketplace = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
    navigate('/');
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>Minimart Marketplace</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="marketplace-main">
        <h2>Products</h2>
        <ul className="product-list">
          <li className="product-item">Product 1</li>
          <li className="product-item">Product 2</li>
          <li className="product-item">Product 3</li>
        </ul>
      </main>
    </div>
  );
};

export default Marketplace;