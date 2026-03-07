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

  // ================= INCREASE QTY =================
  const increaseQty = async (item) => {

    try {

      await fetch(`${API}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: item.qty + 1 })
      });

      setCartItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );

    } catch (error) {
      console.error("Error updating quantity:", error);
    }

  };

  // ================= DECREASE QTY =================
  const decreaseQty = async (item) => {

    try {

      if (item.qty <= 1) {
        removeItem(item.id);
        return;
      }

      await fetch(`${API}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: item.qty - 1 })
      });

      setCartItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty - 1 } : i
        )
      );

    } catch (error) {
      console.error("Error updating quantity:", error);
    }

  };

  // ================= REMOVE ITEM =================
  const removeItem = async (id) => {

    try {

      await fetch(`${API}/cart/${id}`, {
        method: "DELETE"
      });

      setCartItems(prev => prev.filter(item => item.id !== id));

    } catch (error) {
      console.error("Error removing item:", error);
    }

  };

  // ================= TOTAL =================
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ================= UI =================
  if (loading) {
    return (
      <div className="cart-page">
        <h2>Loading Cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <h2>Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Cart is Empty</p>
      ) : (
        <div className="cart-container">

          {/* LEFT SIDE */}
          <div className="cart-items">

            {cartItems.map((item) => (

              <div className="cart-card" key={item.id}>

                <img src={item.image} alt={item.name} />

                <div className="cart-info">

                  <h4>{item.name}</h4>

                  <p className="price">₹{item.price}</p>

                  <div className="cart-actions">

                    <div className="qty-control">

                      <button onClick={() => decreaseQty(item)}>
                        −
                      </button>

                      <span>{item.qty}</span>

                      <button onClick={() => increaseQty(item)}>
                        +
                      </button>

                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* RIGHT SIDE */}
          <div className="cart-summary">

            <h3>Price Details</h3>

            <div className="summary-row">
              <span>Items ({cartItems.length})</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}

    </div>
  );
}