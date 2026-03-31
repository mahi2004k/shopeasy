import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminPanel.css";

export default function AdminPanel() {
  const API = "http://localhost:5000";

  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    status: "Active",
    image: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const [newDeal, setNewDeal] = useState({
    title: "",
    discount: "",
    image: "",
    category: "",
  });

  const [editingDeal, setEditingDeal] = useState(null);

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/deals`),
      ]);

      const pData = await pRes.json();
      const dData = await dRes.json();

      setProducts(Array.isArray(pData) ? pData : []);
      setDeals(Array.isArray(dData) ? dData : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= PRODUCT =================
  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Name & Price required");
      return;
    }

    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
    };

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `${API}/products/${editingProduct.id}`
      : `${API}/products`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetProduct();
    fetchData();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  const resetProduct = () => {
    setNewProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      status: "Active",
      image: "",
    });
    setEditingProduct(null);
  };

  // ================= DEAL =================
  const handleSaveDeal = async () => {
    const payload = {
      ...newDeal,
      discount: parseInt(newDeal.discount) || 0,
    };

    const method = editingDeal ? "PUT" : "POST";
    const url = editingDeal ? `${API}/deals/${editingDeal.id}` : `${API}/deals`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetDeal();
    fetchData();
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm("Delete deal?")) return;
    await fetch(`${API}/deals/${id}`, { method: "DELETE" });
    fetchData();
  };

  const resetDeal = () => {
    setNewDeal({
      title: "",
      discount: "",
      image: "",
      category: "",
    });
    setEditingDeal(null);
  };

  // ================= FILTER =================
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* ===== TOP CARDS ===== */}
      <div className="dashboard-cards">
        <div
          className={`dash-card ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          📦 Products
        </div>

        <div
          className={`dash-card ${activeTab === "deals" ? "active" : ""}`}
          onClick={() => setActiveTab("deals")}
        >
          🎯 Deals
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      {activeTab === "products" && (
        <>
          {/* SEARCH */}
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FORM */}
          <div className="form-section">
            <h2>{editingProduct ? "Edit" : "Add"} Product</h2>

            <input
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <input
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <input
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />

            <input
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            <button onClick={handleSaveProduct}>
              {editingProduct ? "Update" : "Add"}
            </button>
          </div>

          {/* LIST */}
          <div className="products-container">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.05 }}
                className="product-card"
              >
                <div className="image-container">
                  <img
                    src={p.image || "https://via.placeholder.com/200"}
                    alt={p.name}
                  />
                </div>
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>

                <div className="card-buttons">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setNewProduct({
                        ...p,
                        price: p.price.toString(),
                        stock: p.stock.toString(),
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDeleteProduct(p.id)}>
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ================= DEALS ================= */}
      {activeTab === "deals" && (
        <>
          <div className="form-section">
            <h2>{editingDeal ? "Edit" : "Add"} Deal</h2>

            <input
              placeholder="Title"
              value={newDeal.title}
              onChange={(e) =>
                setNewDeal({ ...newDeal, title: e.target.value })
              }
            />

            <input
              placeholder="Discount"
              value={newDeal.discount}
              onChange={(e) =>
                setNewDeal({ ...newDeal, discount: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={newDeal.image}
              onChange={(e) =>
                setNewDeal({ ...newDeal, image: e.target.value })
              }
            />

            <input
              placeholder="Category"
              value={newDeal.category}
              onChange={(e) =>
                setNewDeal({ ...newDeal, category: e.target.value })
              }
            />

            <button onClick={handleSaveDeal}>
              {editingDeal ? "Update" : "Add"}
            </button>
          </div>

          <div className="products-container">
            {deals.map((d) => (
              <div key={d.id} className="product-card">
                <img
                  src={d.image || "https://via.placeholder.com/200"}
                  alt={d.title}
                />
                <h3>{d.title}</h3>
                <p>{d.discount}% OFF</p>

                <div className="card-buttons">
                  <button
                    onClick={() => {
                      setEditingDeal(d);
                      setNewDeal({ ...d, discount: d.discount.toString() });
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDeleteDeal(d.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}
