import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";

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
  return (
    <CartProvider>

      <Routes>

        {/* 🔐 AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🏠 DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🔥 DEALS */}
        <Route path="/deals/:id" element={<DealsPage />} />

        {/* 🛒 CART */}
        <Route path="/cart" element={<Cart />} />

        {/* 💳 CHECKOUT */}
        <Route path="/checkout" element={<Checkout />} />

        {/* ⭐ ADMIN */}
        <Route
          path="/admin"
          element={
            <OwnerRoute>
              <AdminPanel />
            </OwnerRoute>
          }
        />

        {/* 👤 ACCOUNT */}
        <Route path="/account" element={<AccountPage />} />

      </Routes>

    </CartProvider>
  );
}

export default App;