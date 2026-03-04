import { useState, useEffect } from "react";
import "./AdminPanel.css";

export default function AdminPanel() {

  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  // ✅ DEAL STATES
const [deals, setDeals] = useState(() => {
  return JSON.parse(localStorage.getItem("deals")) || [];
});

const [newDeal, setNewDeal] = useState({
  id: "",
  title: "",
  discount: "",
  image: "",
  category: ""
});

const [editingDealId, setEditingDealId] = useState(null);
const [editedDeal, setEditedDeal] = useState({});


  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const categories = [
  "Fashion", "Electronics", "Furniture", "Stationery",
  "Mobiles", "Groceries", "Appliances", "Beauty",
  "Books", "Toys", "Sports", "Automobile",
];

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    category: "",
    stock: "",
    status: "Active",
    image: ""
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
  localStorage.setItem("deals", JSON.stringify(deals));
}, [deals]);


  // ✅ Add Product
  const handleAddProduct = () => {

    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Fill all fields ❌");
      return;
    }

    const productWithId = {
      ...newProduct,
      id: crypto.randomUUID() // unique ID
    };

    setProducts([...products, productWithId]);

    setNewProduct({
      id: "",
      name: "",
      price: "",
      category: "",
      stock: "",
      status: "Active",
      image: ""
    });

    alert("Product Added ✅");
  };

  // ✅ Add Deal
const handleAddDeal = () => {

  if (!newDeal.title || !newDeal.image) {
    alert("Fill deal details ❌");
    return;
  }

  const dealWithId = {
    ...newDeal,
    id: crypto.randomUUID()
  };

  setDeals([...deals, dealWithId]);

  setNewDeal({
    id: "",
    title: "",
    discount: "",
    image: "",
    category: ""
  });

  alert("Deal Added ✅");
};

// ✅ Delete Deal
const handleDeleteDeal = (id) => {
  setDeals(deals.filter(deal => deal.id !== id));
};

  // ✅ Delete
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };


  // ✅ Start Deal Edit
const handleEditDeal = (deal) => {
  setEditingDealId(deal.id);
  setEditedDeal({ ...deal });
};

// ✅ Save Deal Edit
const handleSaveDeal = () => {
  const updatedDeals = deals.map(d =>
    d.id === editingDealId ? { ...editedDeal } : d
  );

  setDeals(updatedDeals);
  setEditingDealId(null);
  alert("Deal Updated ✅");
};

// ✅ Cancel Deal Edit
const handleCancelDeal = () => {
  setEditingDealId(null);
};


  // ✅ Start Edit
const handleEdit = (product) => {
  setEditingId(product.id);
  setEditedProduct({...product});
};

// ✅ Save Edit
const handleSave = () => {
  const updatedProducts = products.map(p =>
    p.id === editingId ? { ...editedProduct } : p
  );

  setProducts(updatedProducts);
  setEditingId(null);
  alert("Product Updated ✅");
};

// ✅ Cancel Edit
const handleCancel = () => {
  setEditingId(null);
};

  // ✅ Filter + Search Logic
  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p =>
      filterCategory === "All"
        ? true
        : p.category === filterCategory
    );

  return (
    <div className="admin-panel">

      <h2>Admin Dashboard 📊</h2>

      {/* ===== STATS SECTION ===== */}
      <div className="admin-stats">
        <div>Total Products: {products.length}</div>
      </div>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="admin-controls">
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
        </select>
      </div>

      {/* ===== ADD PRODUCT FORM ===== */}
      <div className="admin-form">

        <input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <select
        value={newProduct.category}
        onChange={(e) =>
          setNewProduct({ ...newProduct, category: e.target.value })
        }
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

        <input
          type="number"
          placeholder="Stock Quantity"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
        />

        <select
          value={newProduct.status}
          onChange={(e) =>
            setNewProduct({ ...newProduct, status: e.target.value })
          }
        >
          <option>Active</option>
          <option>Out of Stock</option>
        </select>

        <input
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />

        <button onClick={handleAddProduct}>
          Add Product
        </button>

      </div>


      {/* ===== ADD DEAL FORM ===== */}
<div className="admin-form">
  <h3>Add Deal 🎯</h3>

  <input
    placeholder="Deal Title"
    value={newDeal.title}
    onChange={(e) =>
      setNewDeal({ ...newDeal, title: e.target.value })
    }
  />

  <input
    placeholder="Discount Text (Example: Up to 50% Off)"
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

  <select
    value={newDeal.category}
    onChange={(e) =>
      setNewDeal({ ...newDeal, category: e.target.value })
    }
  >
    <option value="">Select Category</option>
    {categories.map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>

  <button onClick={handleAddDeal}>
    Add Deal
  </button>
</div>

      {/* ===== PRODUCT TABLE ===== */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
  {filteredProducts.map(product => (
    <tr key={product.id}>

      <td>{product.id}</td>

      <td>
        {editingId === product.id ? (
          <input
            value={editedProduct.image}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, image: e.target.value })
            }
          />
        ) : (
          product.image && (
            <img
              src={product.image}
              alt={product.name}
              width="50"
            />
          )
        )}
      </td>

      <td>
        {editingId === product.id ? (
          <input
            value={editedProduct.name}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
          />
        ) : (
          product.name
        )}
      </td>

      <td>
  {editingId === product.id ? (
    <input
      type="number"
      value={editedProduct.price}
      onChange={(e) =>
        setEditedProduct({ ...editedProduct, price: e.target.value })
      }
    />
  ) : (
    <>
      ₹{new Intl.NumberFormat("en-IN").format(product.price)}
    </>
  )}
</td>

      <td>
        {editingId === product.id ? (
          <input
            type="number"
            value={editedProduct.stock}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, stock: e.target.value })
            }
          />
        ) : (
          product.stock
        )}
      </td>

      <td>
        {editingId === product.id ? (
          <select
            value={editedProduct.status}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, status: e.target.value })
            }
          >
            <option>Active</option>
            <option>Out of Stock</option>
          </select>
        ) : (
          product.status
        )}
      </td>

      <td>
        {editingId === product.id ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleEdit(product)}>
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </button>

        
          </>
        )}
      </td>

    </tr>
  ))}
</tbody>
      </table>


      {/* ===== DEALS LIST SECTION ===== */}
<h2 style={{ marginTop: "40px" }}>Manage Deals 🎯</h2>

<table className="admin-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Image</th>
      <th>Title</th>
      <th>Discount</th>
      <th>Category</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {deals.map(deal => (
      <tr key={deal.id}>

        <td>{deal.id}</td>

        <td>
          {editingDealId === deal.id ? (
            <input
              value={editedDeal.image}
              onChange={(e) =>
                setEditedDeal({ ...editedDeal, image: e.target.value })
              }
            />
          ) : (
            deal.image && (
              <img
                src={deal.image}
                alt={deal.title}
                width="60"
              />
            )
          )}
        </td>

        <td>
          {editingDealId === deal.id ? (
            <input
              value={editedDeal.title}
              onChange={(e) =>
                setEditedDeal({ ...editedDeal, title: e.target.value })
              }
            />
          ) : (
            deal.title
          )}
        </td>

        <td>
          {editingDealId === deal.id ? (
            <input
              value={editedDeal.discount}
              onChange={(e) =>
                setEditedDeal({ ...editedDeal, discount: e.target.value })
              }
            />
          ) : (
            deal.discount
          )}
        </td>

        <td>
          {editingDealId === deal.id ? (
            <select
              value={editedDeal.category}
              onChange={(e) =>
                setEditedDeal({ ...editedDeal, category: e.target.value })
              }
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          ) : (
            deal.category
          )}
        </td>

        <td>
          {editingDealId === deal.id ? (
            <>
              <button onClick={handleSaveDeal}>Save</button>
              <button
                onClick={handleCancelDeal}
                className="cancel-btn"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleEditDeal(deal)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDeleteDeal(deal.id)}
              >
                Delete
              </button>
            </>
          )}
        </td>

      </tr>
    ))}
  </tbody>
</table>

      

    </div>
  );
}