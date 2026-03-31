import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import DealsPage from "./DealsPage";
import Cart from "./Cart";
import Checkout from "./Checkout";
import AdminPanel from "./AdminPanel";
import OwnerRoute from "./OwnerRoute";
import AccountPage from "./AccountPage";

function App() {

  // ✅ CART STATE (localStorage)
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Routes>

      {/* 🔐 AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🏠 DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <Dashboard
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />

      {/* 🔥 DEALS PAGE (✅ FIXED ROUTE) */}
      <Route
        path="/deals/:id"
        element={<DealsPage />}
      />

      {/* 🛒 CART */}
      <Route
        path="/cart"
        element={
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />

      {/* 💳 CHECKOUT */}
      <Route
        path="/checkout"
        element={<Checkout cartItems={cartItems} />}
      />

      {/* ⭐ ADMIN PANEL */}
      <Route
        path="/admin"
        element={
          <OwnerRoute>
            <AdminPanel />
          </OwnerRoute>
        }
      />

      {/* 👤 ACCOUNT */}
      <Route
        path="/account"
        element={<AccountPage />}
      />

    </Routes>
  );
}

export default App;