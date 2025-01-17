import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MarketPlace.css';

const MarketPlace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [voucherCount, setVoucherCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch products and voucher count
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/products', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProducts(data);
    };

    const fetchVoucherCountFromLocalStorage = () => {
      const user = localStorage.getItem('user'); // Retrieve user object
      if (user) {
        const parsedUser = JSON.parse(user); // Parse it to JSON
        setVoucherCount(parsedUser.voucher || 0); // Set voucher count, default to 0
      } else {
        setVoucherCount(0); // Default to 0 if no user found
      }
    };

    fetchProducts();
    fetchVoucherCountFromLocalStorage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleOrderProduct = (product) => {
    setSelectedProduct(product);
    setError(''); // Clear any previous errors
    setSuccess(''); // Clear any previous success messages
  };

  const handlePlaceOrder = async () => {
    if (orderQuantity > selectedProduct.stockQuantity) {
      setError('Buying quantity is more than stock quantity.');
      return;
    }

    if (voucherCount < selectedProduct.voucherNeeded * orderQuantity) {
      setError('Not enough vouchers.');
      return;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch('http://localhost:3001/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user._id,
        productName: selectedProduct.name,
        productQuantity: orderQuantity,
        dateTransaction: new Date().toISOString().split('T')[0], // Current date
        timeTransaction: new Date().toISOString().split('T')[1].split('.')[0] // Current time
      })
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts(products.map(product => product._id === updatedProduct._id ? updatedProduct : product));
      setVoucherCount(voucherCount - (selectedProduct.voucherNeeded * orderQuantity));
      setSelectedProduct(null);
      setOrderQuantity(1);
      setError(''); // Clear any previous errors
      setSuccess('Order placed successfully!'); // Set success message
    } else {
      console.error('Failed to place order');
    }
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <div className="voucher-count">Vouchers: {voucherCount}</div>
        <div className="header-buttons">
        <h1>Marketplace</h1>
        <button className="nav-button" onClick={() => navigate('/user-dashboard')}>User Dashboard</button>
        <button className="nav-button" onClick={() => navigate('/user-dashboard', { state: { activeTab: 'quests' } })}>Quests</button>
        <button className="nav-button" onClick={() => navigate('/user-dashboard', { state: { activeTab: 'tasks' } })}>Tasks</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="marketplace-main">
        <section className="products-section">
          <h2>Products</h2>
          <ul className="product-list">
            {products.map((product) => (
              <li key={product._id} className="product-item">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Vouchers Needed: {product.voucherNeeded}</p>
                  <p>Stock Quantity: {product.stockQuantity}</p>
                  <button onClick={() => handleOrderProduct(product)}>Order</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {selectedProduct && (
          <section className="order-section">
            <h2>Order {selectedProduct.name}</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <label>
              Quantity:
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="1"
                max={selectedProduct.stockQuantity}
              />
            </label>
            <button onClick={handlePlaceOrder}>Place Order</button>
            <button onClick={() => setSelectedProduct(null)}>Cancel</button>
          </section>
        )}
        {success && <p className="success-message">{success}</p>}
      </main>
    </div>
  );
};

export default MarketPlace;