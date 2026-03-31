import { useState, useEffect } from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const API = "http://localhost:5000";

  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    status: "Active",
    image: ""
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const [newDeal, setNewDeal] = useState({
    title: "",
    discount: "",
    image: "",
    category: ""
  });

  const [editingDeal, setEditingDeal] = useState(null);

  // ================= LOAD =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Products Fetch Error:", err);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await fetch(`${API}/deals`);
      const data = await res.json();
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Deals Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDeals();
  }, []);

  // ================= PRODUCT =================
  const handleAddProduct = async () => {
    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0
    };

    await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    resetProductForm();
    fetchProducts();
  };

  const handleUpdateProduct = async () => {
    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0
    };

    await fetch(`${API}/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    resetProductForm();
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setNewProduct({
      ...p,
      price: p.price.toString(),
      stock: p.stock.toString()
    });
  };

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      status: "Active",
      image: ""
    });
    setEditingProduct(null);
  };

  // ================= DEAL =================
  const handleAddDeal = async () => {
    const payload = {
      ...newDeal,
      discount: parseInt(newDeal.discount) || 0
    };

    await fetch(`${API}/deals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    resetDealForm();
    fetchDeals();
  };

  const handleUpdateDeal = async () => {
    const payload = {
      ...newDeal,
      discount: parseInt(newDeal.discount) || 0
    };

    await fetch(`${API}/deals/${editingDeal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    resetDealForm();
    fetchDeals();
  };

  const handleDeleteDeal = async (id) => {
    await fetch(`${API}/deals/${id}`, { method: "DELETE" });
    fetchDeals();
  };

  const handleEditDeal = (d) => {
    setEditingDeal(d);
    setNewDeal({
      ...d,
      discount: d.discount.toString()
    });
  };

  const resetDealForm = () => {
    setNewDeal({
      title: "",
      discount: "",
      image: "",
      category: ""
    });
    setEditingDeal(null);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard 📊</h2>

      {/* ================= PRODUCT FORM ================= */}
      <div className="admin-form">
        <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

        <input placeholder="Name" value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />

        <input placeholder="Price" value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />

        <input placeholder="Category" value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />

        <input placeholder="Stock" value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />

        <input placeholder="Image URL" value={newProduct.image}
          onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />

        {editingProduct ? (
          <button onClick={handleUpdateProduct}>Update</button>
        ) : (
          <button onClick={handleAddProduct}>Add</button>
        )}
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <h3>Products</h3>

<div className="products-grid">
  {products.map((p) => (
    <div className="product-card" key={p.id}>

      <div className="product-image">
        <img
          src={p.image || "https://via.placeholder.com/200"}
          alt={p.name}
        />
      </div>

      <div className="product-info">
        <h4>{p.name}</h4>

        <p>₹{p.price}</p>
        <p>{p.category}</p>

        <div className="product-buttons">
          <button className="cart-btn" onClick={() => handleEditProduct(p)}>
            Edit
          </button>

          <button className="buy-btn" onClick={() => handleDeleteProduct(p.id)}>
            Delete
          </button>
        </div>
      </div>

    </div>
  ))}
</div>

      {/* ================= DEAL FORM ================= */}
      <div className="admin-form">
        <h3>{editingDeal ? "Edit Deal" : "Add Deal"}</h3>

        <input placeholder="Title" value={newDeal.title}
          onChange={e => setNewDeal({ ...newDeal, title: e.target.value })} />

        <input placeholder="Discount" value={newDeal.discount}
          onChange={e => setNewDeal({ ...newDeal, discount: e.target.value })} />

        <input placeholder="Image URL" value={newDeal.image}
          onChange={e => setNewDeal({ ...newDeal, image: e.target.value })} />

        <input placeholder="Category" value={newDeal.category}
          onChange={e => setNewDeal({ ...newDeal, category: e.target.value })} />

        {editingDeal ? (
          <button onClick={handleUpdateDeal}>Update</button>
        ) : (
          <button onClick={handleAddDeal}>Add</button>
        )}
      </div>

      {/* ================= DEAL LIST ================= */}
      <h3>Deals</h3>

<div className="products-grid">
  {deals.map((d) => (
    <div className="product-card" key={d.id}>

      <div className="product-image">
        <img
          src={d.image || "https://via.placeholder.com/200"}
          alt={d.title}
        />
      </div>

      <div className="product-info">
        <h4>{d.title}</h4>

        <p>{d.discount}% OFF</p>
        <p>{d.category}</p>

        <div className="product-buttons">
          <button className="cart-btn" onClick={() => handleEditDeal(d)}>
            Edit
          </button>

          <button className="buy-btn" onClick={() => handleDeleteDeal(d.id)}>
            Delete
          </button>
        </div>
      </div>

    </div>
  ))}
</div>

    </div>
  );
}