import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MarketPlace.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
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
  };

  const handleOrderProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleConfirmOrder = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
  
    if (!user || !token) {
      console.error('User not authenticated');
      return;
    }

    const totalVoucherNeeded = selectedProduct.voucherNeeded * orderQuantity;
    if (user.voucher < totalVoucherNeeded) {
      setErrorMessage('Not enough vouchers for this purchase.');
      return;
    }

    const transactionData = {
      userId: user._id,
      productName: selectedProduct.name,
      productQuantity: orderQuantity,
      dateTransaction: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      timeTransaction: new Date().toISOString().split('T')[1].split('.')[0], // Current time in HH:MM:SS format
    };

    fetch('http://localhost:3001/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Transaction error:', data.error);
          return;
        }

        // Update the user's voucher balance in local storage
        user.voucher -= totalVoucherNeeded;
        localStorage.setItem('user', JSON.stringify(user));

        // Reset the selected product and order quantity
        setSelectedProduct(null);
        setOrderQuantity(1);
        setErrorMessage('');

        console.log('Transaction successful:', data);
      })
      .catch((err) => {
        console.error('Error processing transaction:', err);
      });
  };

  const handleCancelOrder = () => {
    setSelectedProduct(null);
    setOrderQuantity(1);
    setErrorMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>Marketplace</h1>
        <button className="nav-button" onClick={() => navigate('/user-dashboard')}>User Dashboard</button>
        <button className="nav-button" onClick={() => navigate('/task-submission')}>Submit Task</button>
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
          <section className="order-section">
            <h2>Order {selectedProduct.name}</h2>
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
            <div className='button-container'>
              <button onClick={handleConfirmOrder}>Confirm Order</button>
              <button onClick={handleCancelOrder}>Cancel</button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </section>
        )}
      </main>
    </div>
  );
};

export default Marketplace;