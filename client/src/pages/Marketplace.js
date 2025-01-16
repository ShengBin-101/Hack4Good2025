import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import '../styles/MarketPlace.css';

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    // Fetch products
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/products', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleOrderProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleConfirmOrder = () => {
    // Handle order confirmation logic here
    console.log(`Ordering ${orderQuantity} of ${selectedProduct.name}`);
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>
          <FontAwesomeIcon icon={faStore} /> Marketplace
        </h1>
        <div className="header-buttons">
          <button className="nav-button" onClick={() => navigate('/admin-orders')}>View Orders</button>
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
                  <p>Voucher Needed: {product.voucherNeeded}</p>
                  <p>Stock Quantity: {product.stockQuantity}</p>
                  <button onClick={() => handleOrderProduct(product)}>Order</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {selectedProduct && (
          <div className="order-popup">
            <div className="order-popup-content">
              <h2>Order {selectedProduct.name}</h2>
              <label>
                Quantity:
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  min="1"
                />
              </label>
              <button onClick={handleConfirmOrder}>Confirm Order</button>
              <button onClick={() => setSelectedProduct(null)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;