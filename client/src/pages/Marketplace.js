import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    setSelectedProduct(null);
    setOrderQuantity(1);
  };

  const handleCancelOrder = () => {
    setSelectedProduct(null);
    setOrderQuantity(1);
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>Marketplace</h1>
        <button className="nav-button" onClick={() => navigate('/user-dashboard')}>User Dashboard</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
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
          <div className="order-popup">
            <div className="order-popup-content">
              <h2>Order {selectedProduct.name}</h2>
              <p>Vouchers needed per item: {selectedProduct.voucherNeeded}</p>
              <input
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
              />
              <p>Total vouchers needed: {orderQuantity * selectedProduct.voucherNeeded}</p>
              <button onClick={handleConfirmOrder}>Confirm</button>
              <button onClick={handleCancelOrder}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;