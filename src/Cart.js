import "./Cart.css";
import { useNavigate } from "react-router-dom";

export default function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate();

  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index].qty += 1;
    setCartItems(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];

    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
    } else {
      updated.splice(index, 1); // remove if qty = 1
    }

    setCartItems(updated);
  };

  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price.replace(/[^0-9]/g, "")) * item.qty,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Cart is Empty</p>
      ) : (
        <div className="cart-container">

          {/* LEFT SIDE */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-card" key={index}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p className="price">{item.price}</p>

                  <div className="cart-actions">
                    <div className="qty-control">
                      <button onClick={() => decreaseQty(index)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(index)}>+</button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(index)}
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