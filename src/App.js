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

  // ✅ CART STATE (keep localStorage for cart)
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ✅ Dashboard will fetch products from backend */}
      <Route
        path="/dashboard"
        element={
          <Dashboard
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />

      {/* ✅ Deal by ID (important change) */}
      <Route
        path="/deal/:id"
        element={<DealsPage />}
      />

      <Route
        path="/cart"
        element={
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />

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

      <Route
        path="/account"
        element={<AccountPage />}
      />

    </Routes>
  );
}

export default App;