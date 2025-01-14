import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MarketPlace.css';

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [vouchers, setVouchers] = useState(0);

  useEffect(() => {
    // Fetch user data (vouchers)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setVouchers(user.vouchers);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
    navigate('/');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <img src="/path/to/logo.png" alt="Logo" className="logo" />
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <select value={filter} onChange={handleFilter} className="filter-dropdown">
          <option value="">All</option>
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
        </select>
        <button className="view-mode-button" onClick={toggleViewMode}>
          {viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
        </button>
        <button className="nav-button" onClick={() => navigate('/user-dashboard')}>User Dashboard</button>
        <p className="vouchers">Vouchers: {vouchers}</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>

      </header>
      <main className={`marketplace-main ${viewMode}`}>
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