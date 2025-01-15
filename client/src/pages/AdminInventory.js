import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminInventory.css';

const AdminInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', productPicturePath: '', voucherNeeded: 0, stockQuantity: 0 });
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    // Add new product logic here
    const token = localStorage.getItem('token');
    const productData = {
      ...newProduct,
      productPicturePath: newProduct.productPicturePath || 'default-image-url.jpg' // Set default value if empty
    };

    fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setNewProduct({ name: '', description: '', productPicturePath: '', voucherNeeded: 0, stockQuantity: 0 });
      })
      .catch((err) => console.error(err));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    // Update product logic here
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editingProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(products.map((product) => (product._id === data._id ? data : product)));
        setEditingProduct(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteProduct = (productId) => {
    // Delete product logic here
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then(() => {
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((err) => console.error(err));
  };

  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  return (
    <div className="admin-inventory-container">
      <header className="admin-header">
        <h1>Admin Inventory</h1>
        <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="admin-inventory-main">
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
                  <button onClick={() => handleEditProduct(product)}>Edit</button>
                </div>
                <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>
                  <img src="/path/to/trash-can-icon.png" alt="Delete" />
                </button>
              </li>
            ))}
          </ul>
        </section>
        {editingProduct && (
          <div className="edit-popup">
            <div className="edit-popup-content">
              <h2>Edit {editingProduct.name}</h2>
              <label>
                Product Name:
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleInputChangeEdit}
                  placeholder="Product Name"
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChangeEdit}
                  placeholder="Product Description"
                />
              </label>
              <label>
                Voucher Needed:
                <input
                  type="number"
                  name="voucherNeeded"
                  value={editingProduct.voucherNeeded}
                  onChange={handleInputChangeEdit}
                  placeholder="Voucher Needed"
                />
              </label>
              <label>
                Stock Quantity:
                <input
                  type="number"
                  name="stockQuantity"
                  value={editingProduct.stockQuantity}
                  onChange={handleInputChangeEdit}
                  placeholder="Stock Quantity"
                />
              </label>
              <label>
                Product Picture URL:
                <input
                  type="text"
                  name="productPicturePath"
                  value={editingProduct.productPicturePath}
                  onChange={handleInputChangeEdit}
                  placeholder="Product Picture URL"
                />
              </label>
              <button onClick={handleUpdateProduct}>Update</button>
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </div>
        )}
        <section className="add-product-section">
          <h2>Add New Product</h2>
          <label>
            Product Name:
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Product Description"
            />
          </label>
          <label>
            Voucher Needed:
            <input
              type="number"
              name="voucherNeeded"
              value={newProduct.voucherNeeded}
              onChange={handleInputChange}
              placeholder="Voucher Needed"
            />
          </label>
          <label>
            Stock Quantity:
            <input
              type="number"
              name="stockQuantity"
              value={newProduct.stockQuantity}
              onChange={handleInputChange}
              placeholder="Stock Quantity"
            />
          </label>
          <label>
            Product Picture URL:
            <input
              type="text"
              name="productPicturePath"
              value={newProduct.productPicturePath}
              onChange={handleInputChange}
              placeholder="Product Picture URL"
            />
          </label>
          <button onClick={handleAddProduct}>Add Product</button>
        </section>
      </main>
    </div>
  );
};

export default AdminInventory;