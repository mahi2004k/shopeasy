import "./Checkout.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout({ cartItems }) {

  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const buyNowProduct = location.state?.buyNow;

  const items = buyNowProduct
    ? [{ ...buyNowProduct, qty: 1 }]
    : cartItems;

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price.replace(/[^0-9]/g, "")) * item.qty,
    0
  );

  // ======================
  // PLACE ORDER FUNCTION
  // ======================
  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items,
          total: total,
          paymentMethod: paymentMethod
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

  if (!items.length) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-container">

        <div className="checkout-left">

          <div className="checkout-card">
            <h3>Delivery Address</h3>
            <p>
              Mahesh Konnur <br />
              Mumbai, Maharashtra <br />
              400001 <br />
              Phone: 9876543210
            </p>
            <button>Change Address</button>
          </div>

          <div className="checkout-card">
            <h3>Order Items</h3>

            {items.map((item, index) => (
              <div key={index} className="checkout-item">
                <img src={item.image} alt={item.name} />

                <div>
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>
                  <span>Qty: {item.qty}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-card">
            <h3>Payment Method</h3>

            <label className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit / Debit Card
            </label>

            <label className={`payment-option ${paymentMethod === "upi" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI Payment
            </label>

            <label className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>

        </div>

        <div className="checkout-right">
          <div className="summary-card">
            <h3>Price Details</h3>

            <div className="summary-row">
              <span>Items</span>
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
              className="place-order"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}