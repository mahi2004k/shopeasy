import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function DealsPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000";

  useEffect(() => {

    const fetchDeal = async () => {

      try {

        const res = await fetch(`${API}/deals/${id}`);

        if (!res.ok) throw new Error("Deal not found");

        const data = await res.json();

        console.log("Deal API:", data);

        setDeal(data);

      } catch (err) {

        console.error(err);
        alert("Deal not found");
        navigate("/dashboard");

      } finally {
        setLoading(false);
      }
    };

    fetchDeal();

  }, [id, navigate]);



  if (loading) {
    return <div style={{ padding: "40px" }}>Loading deal...</div>;
  }

  if (!deal) {
    return <div style={{ padding: "40px" }}>No deal found</div>;
  }



  return (
    <div className="dashboard">

      <div className="section">

        <button onClick={() => navigate(-1)}>← Back</button>

        <h2>{deal.discount} OFF</h2>

      </div>


      <div className="section">

        <div className="products-grid">

          <div className="product-card">

            <img
              src={deal.image || "https://via.placeholder.com/200"}
              alt={deal.title}
            />

            <div className="product-info">

              <h4>{deal.title}</h4>

              {deal.category && (
                <p>Category: {deal.category}</p>
              )}

              <p>Discount: {deal.discount}</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}