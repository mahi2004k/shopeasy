import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const API = "http://localhost:5000";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // LOAD CART (initial)
  const loadCart = async () => {
    try {
      const res = await fetch(`${API}/cart`);
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ADD ITEM
  const addToCart = async (product) => {
    await fetch(`${API}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...product, qty: 1 })
    });

    loadCart(); // refresh
  };

  // REMOVE ITEM
  const removeFromCart = async (id) => {
    await fetch(`${API}/cart/${id}`, {
      method: "DELETE"
    });

    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // UPDATE QTY
  const updateQty = async (id, qty) => {
    await fetch(`${API}/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ qty })
    });

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  // TOTAL COUNT (IMPORTANT 🔥)
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQty,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);