import { useState, useEffect } from "react";

import {
  Search,
  User,
  MapPin,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import DealsSlider from "./DealsSlider";


export default function Dashboard({ cartItems, setCartItems }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loggedUser, setLoggedUser] = useState("");
  

  const navigate = useNavigate();

  const categories = [
    "Fashion", "Electronics", "Furniture", "Stationery",
    "Mobiles", "Groceries", "Appliances", "Beauty",
    "Books", "Toys", "Sports", "Automobile",
  ];

  const [deals] = useState(() => {
  return JSON.parse(localStorage.getItem("deals")) || [];
});

const [products] = useState(() => {
  return JSON.parse(localStorage.getItem("products")) || [];
});

const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(
        product => product.category === selectedCategory
      );

     useEffect(() => {
  const storedUser = localStorage.getItem("loggedInUser");

  if (storedUser) {
    setLoggedUser(storedUser);
  }
}, []);

  return (
    <div className="dashboard">

      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left">

          <Menu
            size={26}
            className="menu-icon"
            onClick={() => setMenuOpen(true)}
          />

          <h1 className="logo">ShopEasy</h1>

          <div className="search-box">
            <Search size={18} />
            <input placeholder="Search for products..." />
          </div>
        </div>

        {/* Dropdown */}
        <div className="nav-right">

          <div
            className="dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Menu <ChevronDown size={18} />
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="dropdown-item">
                  <MapPin size={16} />
                  Deliver to Mumbai
                </div>

               <div
                className="dropdown-item"
                onClick={() => navigate("/account")}
              >
                <User size={16} />
                Account
              </div>

                <div
                className="dropdown-item"
                onClick={() => navigate("/cart")}
                >
                 Cart
                <span className="badge">{cartItems.length}</span>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="menu-drawer"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="menu-header">
                <h3>Hello, {loggedUser || "User"} 👋</h3>
                <X size={22} onClick={() => setMenuOpen(false)} />
              </div>

              <div className="menu-item">Your Orders</div>
              <div className="menu-item">Wishlist</div>
              <div className="menu-item">Rewards</div>
              <div className="menu-item logout">Logout</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
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

      {/* Hero */}
      {selectedCategory === "All" && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="hero"
  >
    <h2>Mega Sale is Live 🔥</h2>
    <p>Best Deals | Top Brands | Huge Discounts</p>
    <button>Shop Now</button>
  </motion.div>
)}

      {/* Deals */}
      {/* Deals Slider */}
      {selectedCategory === "All" && (
        <div className="section">
          <h3>Today's Deals</h3>

          <DealsSlider deals={deals} products={products} />

        </div>
      )}

      {/* ⭐ MIXED PRODUCTS SECTION */}
      <div className="section">
        <h3>Recommended For You ✨</h3>

        <div className="products-grid">
  {filteredProducts.map(product => (
    <motion.div whileHover={{ scale: 1.05 }} key={product.id}>
      <div className="product-card">
        <img src={product.image} alt={product.name} />

        <div className="product-info">
          <h4>{product.name}</h4>
          <p>₹{Number(product.price).toLocaleString("en-IN")}</p>

          <button
  className="cart-btn"
  onClick={() => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);

      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }}
>
  Add to Cart
</button>

          <button
          className="buy-btn"
          onClick={()=>
            navigate("/checkout", { state: { buyNow: product}})
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