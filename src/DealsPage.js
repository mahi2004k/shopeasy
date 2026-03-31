import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function DealsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = "http://localhost:5000";

  useEffect(() => {

    if (!id) {
      setError("Invalid deal ID");
      setLoading(false);
      return;
    }

    const fetchDeal = async () => {

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/deals/${id}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
          throw new Error("Empty deal data");
        }

        setDeal(data);

      } catch (err) {
        console.error("Fetch Deal Error:", err);
        setError("Deal not found");
      } finally {
        setLoading(false);
      }

    };

    fetchDeal();

  }, [id]);


  // ================= LOADING =================
  if (loading) {
    return <div style={{ padding: "40px" }}>Loading deal...</div>;
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h3>{error}</h3>
        <button onClick={() => navigate("/dashboard")}>
          Go Back
        </button>
      </div>
    );
  }

  // ================= NO DATA =================
  if (!deal) {
    return (
      <div style={{ padding: "40px" }}>
        No deal found
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="dashboard">

      <div className="section">

        <button onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>{deal.discount}% OFF 🎯</h2>

      </div>

      <div className="section">

        <div className="products-grid">

          <div className="product-card">

            <img
              src={deal.image || "https://via.placeholder.com/200"}
              alt={deal.title || "Deal Image"}
            />

            <div className="product-info">

              <h4>{deal.title || "No Title"}</h4>

              {deal.category && (
                <p>Category: {deal.category}</p>
              )}

              <p>Discount: {deal.discount}%</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}