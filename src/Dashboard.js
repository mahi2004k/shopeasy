import { useState, useEffect } from "react";
import {
  Search,
  User,
  MapPin,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import DealsSlider from "./DealsSlider";

export default function Dashboard({ cartItems, setCartItems }) {

  const navigate = useNavigate();
  const API = "http://localhost:5000";

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loggedUser, setLoggedUser] = useState("");
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Fashion", "Electronics", "Furniture", "Stationery",
    "Mobiles", "Groceries", "Appliances", "Beauty",
    "Books", "Toys", "Sports", "Automobile",
  ];

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!user || !isLoggedIn) {
      navigate("/");
    } else {
      setLoggedUser(user);
    }
  }, [navigate]);

  // 📦 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, dealRes] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/deals`)
        ]);

        const productData = await productRes.json();
        const dealData = await dealRes.json();

        const normalizedDeals = dealData.map(d => ({
          id: d.id,
          title: d.title,
          discount: d.discount,
          image: d.image || "https://via.placeholder.com/150",
          category: d.category || "General"
        }));

        setProducts(productData);
        setDeals(normalizedDeals);

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔎 FILTER PRODUCTS
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(p => p.category === selectedCategory);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  // 🛒 ADD TO CART (FIXED)
  const addToCart = async (product) => {
    try {
      await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        })
      });

      // ✅ Proper state update (ONLY ONCE)
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);

        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          );
        }

        return [...prev, { ...product, qty: 1 }];
      });

    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading products...</div>;
  }

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">

        <div className="nav-left">
          <Menu size={26} className="menu-icon" onClick={() => setMenuOpen(true)} />

          <h1 className="logo">ShopEasy</h1>

          <div className="search-box">
            <Search size={18} />
            <input placeholder="Search for products..." />
          </div>
        </div>

        <div className="nav-right-horizontal">

          <div className="nav-item">
            <MapPin size={16} />
            <span>Deliver to India</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/account")}>
            <User size={16} />
            <span>Account</span>
          </div>

          <div className="nav-item cart" onClick={() => navigate("/cart")}>
            🛒
            <span>Cart</span>
            <span className="badge">
              {cartItems?.reduce((sum, item) => sum + (item.qty || 0), 0)}
            </span>
          </div>

        </div>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="menu-overlay"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="menu-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
            >
              <div className="menu-header">
                <h3>Hello, {loggedUser}</h3>
                <X onClick={() => setMenuOpen(false)} />
              </div>

              <div className="menu-item" onClick={() => navigate("/account")}>
                👤 Your Account
              </div>

              <div className="menu-item" onClick={() => navigate("/orders")}>
                📦 Your Orders
              </div>

              <div className="menu-item" onClick={() => navigate("/cart")}>
                🛒 Your Cart
              </div>

              <div className="menu-item logout" onClick={handleLogout}>
                🚪 Logout
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CATEGORIES */}
      <div className="categories">
        <span
          className={`category-pill ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </span>

        {categories.map(cat => (
          <span
            key={cat}
            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* DEALS */}
      {selectedCategory === "All" && (
        <div className="section">
          <h3>Today's Deals</h3>
          <DealsSlider deals={deals} />
        </div>
      )}

      {/* PRODUCTS */}
      <div className="section">
        <h3>Recommended For You ✨</h3>

        <div className="products-grid">

          {filteredProducts.map(product => (
            <motion.div whileHover={{ scale: 1.05 }} key={product.id}>

              <div className="product-card">

                <img
                  src={product.image || "https://via.placeholder.com/200"}
                  alt={product.name}
                />

                <div className="product-info">

                  <h4>{product.name}</h4>

                  <p>₹{Number(product.price).toLocaleString("en-IN")}</p>

                  <button
                    className="cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>

                  <button
                    className="buy-btn"
                    onClick={() =>
                      navigate("/checkout", { state: { buyNow: product } })
                    }
                  >
                    Buy Now
                  </button>

                </div>

              </div>

            </motion.div>
          ))}

        </div>
      </div>

    </div>
  );
}