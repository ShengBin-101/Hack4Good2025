import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MarketPlace.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [voucherCount, setVoucherCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchVoucherCountFromLocalStorage();
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

  const fetchVoucherCountFromLocalStorage = () => {
    const user = localStorage.getItem('user'); // Retrieve user object
    if (user) {
      const parsedUser = JSON.parse(user); // Parse it to JSON
      setVoucherCount(parsedUser.voucher || 0); // Set voucher count, default to 0
    } else {
      setVoucherCount(0); // Default to 0 if no user found
    }
  };

  const handleOrderProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleConfirmOrder = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: selectedProduct._id,
        quantity: orderQuantity
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setVoucherCount((prevCount) => prevCount - selectedProduct.voucherNeeded * orderQuantity); // Update voucher count for non-admin users
        localStorage.setItem('voucher', voucherCount - selectedProduct.voucherNeeded * orderQuantity); // Update voucher count in local storage
        setSelectedProduct(null);
        setOrderQuantity(1);
        alert('Order placed successfully!');
      })
      .catch((err) => console.error(err));
  };

  const handleCancelOrder = () => {
    setSelectedProduct(null);
    setOrderQuantity(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('voucher');
    navigate('/');
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>Marketplace</h1>
        <button className="nav-button" onClick={() => navigate('/user-dashboard')}>User Dashboard</button>
        <button className="nav-button" onClick={() => navigate('/task-submission')}>Submit Task</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <p>Voucher Count: {voucherCount}</p> {/* Display voucher count */}
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
            <button onClick={handleConfirmOrder}>Confirm Order</button>
            <button onClick={handleCancelOrder}>Cancel</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Marketplace;