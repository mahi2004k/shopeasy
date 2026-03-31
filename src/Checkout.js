import "./Checkout.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./CartContext"; // ✅ IMPORTANT

export default function Checkout() {

  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useCart(); // ✅ GLOBAL CART

  const [paymentMethod, setPaymentMethod] = useState("card");

  const buyNowProduct = location.state?.buyNow;

  // ✅ FIXED ITEMS
  const items = buyNowProduct
    ? [{ ...buyNowProduct, qty: 1 }]
    : cartItems || [];

  // ✅ SAFE TOTAL
  const total = (items || []).reduce(
    (sum, item) =>
      sum + Number(item.price) * item.qty,
    0
  );

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items,
          total,
          paymentMethod
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully ✅");
        navigate("/success");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Order failed ❌");
    }
  };

  // ================= EMPTY =================
  if (!items.length) {
    return <h2 className="empty-cart">Your cart is empty</h2>;
  }

  // ================= UI =================
  return (
    <div className="checkout-page">

      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Review your order and complete payment</p>
      </div>

      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">

          {/* ADDRESS */}
          <div className="card">
            <h3>Delivery Address</h3>
            <div className="address-box">
              <p><strong>Mahesh Konnur</strong></p>
              <p>Mumbai, Maharashtra</p>
              <p>400001</p>
              <p>📞 9876543210</p>
            </div>
            <button className="secondary-btn">
              Change Address
            </button>
          </div>

          {/* ITEMS */}
          <div className="card">
            <h3>Order Items</h3>

            {items.map((item, index) => (
              <div key={index} className="checkout-item">

                <img src={item.image} alt={item.name} />

                <div className="item-details">
                  <h4>{item.name}</h4>

                  <p className="price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>

                  <span className="qty">
                    Qty: {item.qty}
                  </span>
                </div>

              </div>
            ))}

          </div>

          {/* PAYMENT */}
          <div className="card">
            <h3>Payment Method</h3>

            <div className="payment-options">
              {["card", "upi", "cod"].map((method) => (
                <label
                  key={method}
                  className={`payment-option ${
                    paymentMethod === method ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />

                  {method === "card" && "Credit / Debit Card"}
                  {method === "upi" && "UPI Payment"}
                  {method === "cod" && "Cash on Delivery"}
                </label>
              ))}
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <div className="summary-card">

            <h3>Price Details</h3>

            <div className="summary-row">
              <span>Items</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>

            <p className="secure-text">
              🔒 Safe and secure payments
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}