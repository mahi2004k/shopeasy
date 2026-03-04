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

  // ✅ PRODUCTS STATE (GLOBAL)
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ SAVE PRODUCTS TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ✅ CART STATE
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // ✅ SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <Dashboard
            products={products}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />

      <Route
        path="/deals"
        element={<DealsPage products={products} />}
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

      {/* ⭐ ADMIN PANEL ROUTE */}
      <Route
        path="/admin"
        element={
          <OwnerRoute>
            <AdminPanel
              products={products}
              setProducts={setProducts}
            />
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