import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function DealsPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const deal = location.state;

  // ✅ Get products from localStorage (added via Admin)
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // ❌ If page refreshed and state lost
  if (!deal) return <div>Invalid Deal</div>;

  // ✅ Find the linked product using productId
  const product = products.find(p => p.id === deal.productId);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="dashboard">

      <div className="section">
        <button onClick={() => navigate(-1)}>← Back</button>

        <h2>{deal.title}</h2>
        <p>{deal.discount}</p>
      </div>

      <div className="section">
        <div className="products-grid">

          <div className="product-card">
            <img src={product.image} alt={product.name} />

            <div className="product-info">
              <h4>{product.name}</h4>
              <p>
                ₹{new Intl.NumberFormat("en-IN").format(product.price)}
              </p>
              <p>Status: {product.status}</p>
              <p>Stock: {product.stock}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}