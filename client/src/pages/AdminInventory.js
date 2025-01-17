import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminInventory.css';

const AdminInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', voucherNeeded: 0, stockQuantity: 0 });
  const [productPicture, setProductPicture] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductPicture, setEditingProductPicture] = useState(null);

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

  const handlePictureChange = (e) => {
    setProductPicture(e.target.files[0]);
  };

  const handleAddProduct = () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('voucherNeeded', newProduct.voucherNeeded);
    formData.append('stockQuantity', newProduct.stockQuantity);
    if (productPicture) {
      formData.append('productPicture', productPicture);
    }

    fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setNewProduct({ name: '', description: '', voucherNeeded: 0, stockQuantity: 0 });
        setProductPicture(null);
      })
      .catch((err) => console.error(err));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('description', editingProduct.description);
    formData.append('voucherNeeded', editingProduct.voucherNeeded);
    formData.append('stockQuantity', editingProduct.stockQuantity);
    if (editingProductPicture) {
      formData.append('productPicture', editingProductPicture);
    }

    fetch(`http://localhost:3001/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(products.map((product) => (product._id === data._id ? data : product)));
        setEditingProduct(null);
        setEditingProductPicture(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteProduct = (productId) => {
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

  const handlePictureChangeEdit = (e) => {
    setEditingProductPicture(e.target.files[0]);
  };

  return (
    <div className="admin-inventory-container">
      <header className="common-header">
        <div className="header-buttons">
          <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Admin Dashboard</button>
          <button className="nav-button" onClick={() => navigate('/task-submission')}>Submit Task</button>
          <button className="nav-button" onClick={() => navigate('/view-tasks')}>View Tasks</button>
        </div>
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
                  <button className="edit-button" onClick={() => handleEditProduct(product)}>Edit</button>
                </div>
                <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>
                  <img src="C:/Users/sheng/Desktop/Hack4Good2025/client/src/assets/trash-can.png" alt="Delete" />
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
                Product Picture:
                <input
                  type="file"
                  onChange={handlePictureChangeEdit}
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
            Product Picture:
            <input
              type="file"
              onChange={handlePictureChange}
            />
          </label>
          <button onClick={handleAddProduct}>Add Product</button>
        </section>
      </main>
    </div>
  );
};

export default AdminInventory;