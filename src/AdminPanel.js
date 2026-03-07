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

  // ================= LOAD PRODUCTS =================
  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      })
      .catch(err => console.error("Products Fetch Error:", err));
  }, []);

  // ================= LOAD DEALS =================
  useEffect(() => {
    fetch(`${API}/deals`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDeals(data);
        else setDeals([]);
      })
      .catch(err => console.error("Deals Fetch Error:", err));
  }, []);

  // ================= ADD / UPDATE PRODUCT =================
  const handleAddProduct = async () => {
    try {
      const payload = { ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0 };
      const response = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setProducts([...products, data]);
        resetProductForm();
        alert("Product Added ✅");
      } else {
        alert(data.message || "Error adding product");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error ❌");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const payload = { ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0 };
      const response = await fetch(`${API}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(products.map(p => (p.id === editingProduct.id ? data : p)));
        resetProductForm();
        alert("Product Updated ✅");
      } else {
        alert(data.message || "Error updating product");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error ❌");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product, price: product.price.toString(), stock: product.stock.toString() });
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${API}/products/${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const resetProductForm = () => {
    setNewProduct({ name: "", price: "", category: "", stock: "", status: "Active", image: "" });
    setEditingProduct(null);
  };

  // ================= ADD / UPDATE DEAL =================
  const handleAddDeal = async () => {
    try {
      const payload = { ...newDeal, discount: parseInt(newDeal.discount) || 0 };
      const response = await fetch(`${API}/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setDeals([...deals, data]);
        resetDealForm();
        alert("Deal Added ✅");
      } else {
        alert(data.message || "Error adding deal");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error ❌");
    }
  };

  const handleUpdateDeal = async () => {
    try {
      const payload = { ...newDeal, discount: parseInt(newDeal.discount) || 0 };
      const response = await fetch(`${API}/deals/${editingDeal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setDeals(deals.map(d => (d.id === editingDeal.id ? data : d)));
        resetDealForm();
        alert("Deal Updated ✅");
      } else {
        alert(data.message || "Error updating deal");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error ❌");
    }
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setNewDeal({ ...deal, discount: deal.discount.toString() });
  };

  const handleDeleteDeal = async (id) => {
    try {
      await fetch(`${API}/deals/${id}`, { method: "DELETE" });
      setDeals(deals.filter(d => d.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const resetDealForm = () => {
    setNewDeal({ title: "", discount: "", image: "", category: "" });
    setEditingDeal(null);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard 📊</h2>

      {/* ================= PRODUCT FORM ================= */}
      <div className="admin-form">
        <h3>{editingProduct ? "Edit Product ✏️" : "Add Product"}</h3>
        <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
        <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
        <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
        <input placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
        {editingProduct ? (
          <button onClick={handleUpdateProduct}>Update Product</button>
        ) : (
          <button onClick={handleAddProduct}>Add Product</button>
        )}
      </div>

      {/* ================= PRODUCT TABLE ================= */}
      <h3>Products</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><img src={p.image} alt={p.name} width="50" height="50" /></td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button onClick={() => handleEditProduct(p)}>Edit</button>
                <button onClick={() => handleDeleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= DEAL FORM ================= */}
      <div className="admin-form">
        <h3>{editingDeal ? "Edit Deal ✏️" : "Add Deal 🎯"}</h3>
        <input placeholder="Title" value={newDeal.title} onChange={e => setNewDeal({ ...newDeal, title: e.target.value })} />
        <input type="number" placeholder="Discount" value={newDeal.discount} onChange={e => setNewDeal({ ...newDeal, discount: e.target.value })} />
        <input placeholder="Image URL" value={newDeal.image} onChange={e => setNewDeal({ ...newDeal, image: e.target.value })} />
        <input placeholder="Category" value={newDeal.category} onChange={e => setNewDeal({ ...newDeal, category: e.target.value })} />
        {editingDeal ? (
          <button onClick={handleUpdateDeal}>Update Deal</button>
        ) : (
          <button onClick={handleAddDeal}>Add Deal</button>
        )}
      </div>

      {/* ================= DEAL TABLE ================= */}
      <h3>Deals</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Discount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td><img src={d.image} alt={d.title} width="50" height="50" /></td>
              <td>{d.title}</td>
              <td>{d.discount}</td>
              <td>
                <button onClick={() => handleEditDeal(d)}>Edit</button>
                <button onClick={() => handleDeleteDeal(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}