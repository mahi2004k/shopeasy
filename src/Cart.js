import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Cart() {

  const API = "http://localhost:5000";
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD CART =================
  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/cart`);
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= UPDATE QTY =================
  const updateQty = async (item, newQty) => {
    try {
      if (newQty <= 0) {
        removeItem(item.id);
        return;
      }

      await fetch(`${API}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty })
      });

      setCartItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, qty: newQty } : i
        )
      );

    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (id) => {
    try {
      await fetch(`${API}/cart/${id}`, { method: "DELETE" });
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ================= TOTAL =================
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="cart-loader">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart-box">
          <h3>Your cart feels lonely 😢</h3>
          <p>Add some amazing products!</p>
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          {/* LEFT */}
          <div className="cart-items">

            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>

                <img src={item.image} alt={item.name} />

                <div className="item-details">

                  <h3>{item.name}</h3>

                  <p className="seller">Sold by: Tech Store</p>

                  <p className="stock">✔ In stock</p>

                  <p className="delivery">
                    🚚 FREE delivery by <b>Tomorrow</b>
                  </p>

                  <p className="price">₹{Number(item.price).toLocaleString()}</p>

                  <div className="item-actions">

                    {/* QTY */}
                    <div className="qty-box">
                      <button onClick={() => updateQty(item, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item, item.qty + 1)}>+</button>
                    </div>

                    <button
                      className="remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* RIGHT SUMMARY */}
          <div className="cart-summary">

            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items ({cartItems.length})</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Buy
            </button>

            <p className="secure-text">🔒 Secure Checkout</p>

          </div>

        </div>
      )}
    </div>
  );
}