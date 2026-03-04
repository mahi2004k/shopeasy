import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountPage.css";

export default function AccountPage() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser = users.find(u => u.email === loggedInEmail);

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="account-page">

      {/* Sidebar */}
      <div className="account-sidebar">
        <h3>My Account</h3>

        <div onClick={() => setActiveTab("profile")}>Profile</div>
        <div onClick={() => setActiveTab("orders")}>Orders</div>
        <div onClick={() => setActiveTab("addresses")}>Addresses</div>
        <div onClick={() => setActiveTab("wishlist")}>Wishlist</div>
        <div onClick={() => setActiveTab("security")}>Security</div>
      </div>

      {/* Content */}
      <div className="account-content">

        {activeTab === "profile" && (
          <div>
            <h2>Profile Details</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2>Your Orders</h2>
            {user.orders?.length === 0 && <p>No orders yet.</p>}
          </div>
        )}

        {activeTab === "addresses" && (
          <div>
            <h2>Saved Addresses</h2>
            {user.addresses?.length === 0 && <p>No addresses added.</p>}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            <h2>Your Wishlist</h2>
            {user.wishlist?.length === 0 && <p>No wishlist items.</p>}
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2>Security Settings</h2>
            <button onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/login");
            }}>
              Logout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}